param(
    [string]$BaseUrl = "https://jus-tice.co.il",
    [string]$OutputPath = "project-control/live-related-content-qa-2026-05-11.csv"
)

$ErrorActionPreference = "Stop"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Net.Http
Add-Type -AssemblyName System.Web

function Add-QaParam {
    param(
        [string]$Url
    )

    $separator = if ($Url.Contains("?")) { "&" } else { "?" }
    return $Url + $separator + "qa=related-content-" + (Get-Date -Format "yyyyMMddHHmmss")
}

function Convert-HtmlText {
    param(
        [string]$Value
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return ""
    }

    $withoutTags = [regex]::Replace($Value, "<[^>]+>", " ")
    $collapsed = [regex]::Replace($withoutTags, "\s+", " ").Trim()
    return [System.Web.HttpUtility]::HtmlDecode($collapsed)
}

function Get-Attr {
    param(
        [string]$Html,
        [string]$Name
    )

    $match = [regex]::Match($Html, [regex]::Escape($Name) + "=""([^""]*)""", "IgnoreCase")
    if ($match.Success) {
        return [System.Web.HttpUtility]::HtmlDecode($match.Groups[1].Value)
    }

    return ""
}

function Invoke-LivePage {
    param(
        [string]$Url
    )

    $handler = New-Object System.Net.Http.HttpClientHandler
    $handler.AllowAutoRedirect = $true

    $client = New-Object System.Net.Http.HttpClient($handler)
    $client.Timeout = [TimeSpan]::FromSeconds(30)
    $client.DefaultRequestHeaders.UserAgent.ParseAdd("Jus-Tice related content QA")

    try {
        $response = $client.GetAsync($Url).GetAwaiter().GetResult()
        $content = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
        $finalUrl = $response.RequestMessage.RequestUri.AbsoluteUri

        $title = ""
        $titleMatch = [regex]::Match($content, "<title>(.*?)</title>", "Singleline")
        if ($titleMatch.Success) {
            $title = Convert-HtmlText -Value $titleMatch.Groups[1].Value
        }

        return [pscustomobject]@{
            Status = [int]$response.StatusCode
            FinalUrl = $finalUrl
            Body = $content
            Title = $title
            Error = ""
        }
    } catch {
        return [pscustomobject]@{
            Status = 0
            FinalUrl = ""
            Body = ""
            Title = ""
            Error = $_.Exception.Message
        }
    } finally {
        $client.Dispose()
        $handler.Dispose()
    }
}

$base = $BaseUrl.TrimEnd("/")

$samples = @(
    @{ key = "general_lawyer_selection"; path = "/find-lawyer-how-to-find-good-attorney/"; expected = "lawyer_selection" },
    @{ key = "criminal_drug_offenses"; path = "/drug-offenses-criminal-lawyer/"; expected = "criminal_law" },
    @{ key = "real_estate_cost"; path = "/real-estate-lawyer-cost-2025/"; expected = "real_estate" },
    @{ key = "family_mutual_divorce"; path = "/mutual-divorce-agreement-2025/"; expected = "family_divorce" }
)

$rows = @()

foreach ($sample in $samples) {
    $requestUrl = Add-QaParam -Url ($base + $sample.path)
    $result = Invoke-LivePage -Url $requestUrl
    $body = [string]$result.Body

    $sectionMatch = [regex]::Match($body, '<section[^>]*class="[^"]*related-articles[^"]*"[^>]*data-related-mode="(?:semantic|fallback)"[^>]*>', "Singleline")
    $relatedMode = if ($sectionMatch.Success) { Get-Attr -Html $sectionMatch.Value -Name "data-related-mode" } else { "" }
    $sourceCluster = if ($sectionMatch.Success) { Get-Attr -Html $sectionMatch.Value -Name "data-related-source-cluster" } else { "" }
    $cardCount = if ($sectionMatch.Success) { Get-Attr -Html $sectionMatch.Value -Name "data-related-card-count" } else { "" }
    $cards = [regex]::Matches($body, '<article[^>]*data-related-card="true"[\s\S]*?</article>', "Singleline")

    if ($cards.Count -eq 0) {
        $status = "REVIEW"
        if ($result.Status -eq 200 -and $sourceCluster -eq $sample.expected -and $body.Contains("related-articles--fallback")) {
            $status = "VERIFIED"
        }

        $rows += [pscustomobject]@{
            checked_at = (Get-Date).ToString("s")
            status = $status
            source_key = $sample.key
            source_url = $requestUrl
            http_status = $result.Status
            final_url = $result.FinalUrl
            source_title = $result.Title
            related_mode = if ($relatedMode) { $relatedMode } else { "missing" }
            expected_source_cluster = $sample.expected
            detected_source_cluster = if ($sourceCluster) { $sourceCluster } else { "missing" }
            related_card_count = if ($cardCount) { $cardCount } else { "0" }
            card_index = 0
            card_match = "missing"
            card_cluster = ""
            card_title = ""
            card_url = ""
            notes = if ($result.Error) { $result.Error } else { "No related cards detected; fallback is acceptable only when source cluster is known." }
        }

        continue
    }

    $index = 0
    foreach ($card in $cards) {
        $index++
        $html = $card.Value
        $cardMatch = Get-Attr -Html $html -Name "data-related-cluster-match"
        $cardCluster = Get-Attr -Html $html -Name "data-related-card-cluster"
        $cardUrl = Get-Attr -Html $html -Name "href"
        $titleMatch = [regex]::Match($html, '<h[23][^>]*class="[^"]*article-card__title[^"]*"[\s\S]*?<a[^>]*>([\s\S]*?)</a>', "Singleline")
        $cardTitle = if ($titleMatch.Success) { Convert-HtmlText -Value $titleMatch.Groups[1].Value } else { "" }

        $status = "VERIFIED"
        $notes = "Semantic related card passed source/card cluster QA."

        if ($result.Status -ne 200) {
            $status = "REVIEW"
            $notes = "Source page did not return HTTP 200."
        } elseif ($sourceCluster -ne $sample.expected) {
            $status = "REVIEW"
            $notes = "Source cluster does not match expected cluster."
        } elseif ($cardMatch -eq "mismatch" -or $cardMatch -eq "unknown" -or -not $cardMatch) {
            $status = "REVIEW"
            $notes = "Related card cluster is not confirmed as a match."
        }

        $rows += [pscustomobject]@{
            checked_at = (Get-Date).ToString("s")
            status = $status
            source_key = $sample.key
            source_url = $requestUrl
            http_status = $result.Status
            final_url = $result.FinalUrl
            source_title = $result.Title
            related_mode = if ($relatedMode) { $relatedMode } else { "missing" }
            expected_source_cluster = $sample.expected
            detected_source_cluster = if ($sourceCluster) { $sourceCluster } else { "missing" }
            related_card_count = $cardCount
            card_index = $index
            card_match = if ($cardMatch) { $cardMatch } else { "missing" }
            card_cluster = $cardCluster
            card_title = $cardTitle
            card_url = $cardUrl
            notes = $notes
        }
    }
}

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$rows | Export-Csv -Path $OutputPath -NoTypeInformation -Encoding UTF8

Write-Host "LIVE RELATED CONTENT QA"
Write-Host "Output: $OutputPath"
$rows |
    Select-Object status,source_key,related_mode,expected_source_cluster,detected_source_cluster,card_match,card_cluster,card_title,card_url,notes |
    Format-Table -AutoSize

if ($rows | Where-Object { $_.status -eq "REVIEW" }) {
    exit 1
}

exit 0
