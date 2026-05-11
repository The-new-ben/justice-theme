param(
    [string]$BaseUrl = "https://jus-tice.co.il",
    [string]$OutputPath = "project-control/public-http-internal-link-scan-2026-05-11.csv",
    [int]$MaxSitemapPageUrls = 40,
    [int]$MaxSitemapChildren = 8,
    [int]$MaxFindingsPerResource = 60,
    [string[]]$SeedPaths = @(
        "/",
        "/articles/",
        "/lawyers/",
        "/family-law/",
        "/find-lawyer-how-to-find-good-attorney/",
        "/drug-offenses-criminal-lawyer/",
        "/real-estate-lawyer-cost-2025/",
        "/mutual-divorce-agreement-2025/",
        "/sitemap_index.xml",
        "/robots.txt"
    )
)

$ErrorActionPreference = "Stop"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Net.Http
Add-Type -AssemblyName System.Web

function Add-QaParam {
    param(
        [string]$Url
    )

    if ($Url -match "\.(xml|txt)(\?|$)") {
        return $Url
    }

    $separator = if ($Url.Contains("?")) { "&" } else { "?" }
    return $Url + $separator + "qa=http-internal-scan-" + (Get-Date -Format "yyyyMMddHHmmss")
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

function Get-PageTitle {
    param(
        [string]$Body
    )

    $titleMatch = [regex]::Match($Body, "<title>(.*?)</title>", "Singleline")
    if ($titleMatch.Success) {
        return Convert-HtmlText -Value $titleMatch.Groups[1].Value
    }

    return ""
}

function Get-ContextSnippet {
    param(
        [string]$Body,
        [int]$Index,
        [int]$Length = 140
    )

    if ([string]::IsNullOrEmpty($Body)) {
        return ""
    }

    $start = [Math]::Max(0, $Index - 70)
    $end = [Math]::Min($Body.Length, $Index + $Length)
    $snippet = $Body.Substring($start, $end - $start)
    $snippet = [regex]::Replace($snippet, "\s+", " ").Trim()
    return [System.Web.HttpUtility]::HtmlDecode($snippet)
}

function Invoke-LiveResource {
    param(
        [System.Net.Http.HttpClient]$Client,
        [string]$Url
    )

    try {
        $response = $Client.GetAsync($Url).GetAwaiter().GetResult()
        $content = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
        $finalUrl = $response.RequestMessage.RequestUri.AbsoluteUri

        return [pscustomobject]@{
            RequestUrl = $Url
            Status = [int]$response.StatusCode
            FinalUrl = $finalUrl
            Body = $content
            Title = Get-PageTitle -Body $content
            Error = ""
        }
    } catch {
        return [pscustomobject]@{
            RequestUrl = $Url
            Status = 0
            FinalUrl = ""
            Body = ""
            Title = ""
            Error = $_.Exception.Message
        }
    }
}

function Add-FindingRows {
    param(
        [System.Collections.Generic.List[object]]$Rows,
        [object]$Result,
        [string]$SourceType
    )

    $body = [string]$Result.Body
    $pattern = "http://(?:www\.)?jus-tice\.co\.il[^\s`"'<>)]+"
    $allMatches = [regex]::Matches($body, $pattern, "IgnoreCase")
    $matches = @($allMatches | Select-Object -First $MaxFindingsPerResource)

    if ($allMatches.Count -eq 0) {
        $Rows.Add([pscustomobject]@{
            checked_at = (Get-Date).ToString("s")
            status = "VERIFIED"
            source_type = $SourceType
            request_url = $Result.RequestUrl
            http_status = $Result.Status
            final_url = $Result.FinalUrl
            title = $Result.Title
            occurrence_type = "none"
            occurrence_url = ""
            attribute = ""
            context = ""
            notes = if ($Result.Error) { $Result.Error } else { "No first-party http://jus-tice.co.il references found." }
        })
        return
    }

    foreach ($match in $matches) {
        $snippet = Get-ContextSnippet -Body $body -Index $match.Index
        $attribute = ""
        $attrMatch = [regex]::Match($snippet, "(href|src|action|content|data-url|data-src)=['`"][^'`"]*" + [regex]::Escape($match.Value), "IgnoreCase")
        if ($attrMatch.Success) {
            $attribute = $attrMatch.Groups[1].Value.ToLowerInvariant()
        }

        $occurrenceType = if ($SourceType -like "sitemap*") {
            "sitemap_loc_or_xml"
        } elseif ($attribute) {
            "html_attribute"
        } else {
            "raw_body"
        }

        $Rows.Add([pscustomobject]@{
            checked_at = (Get-Date).ToString("s")
            status = "REVIEW"
            source_type = $SourceType
            request_url = $Result.RequestUrl
            http_status = $Result.Status
            final_url = $Result.FinalUrl
            title = $Result.Title
            occurrence_type = $occurrenceType
            occurrence_url = $match.Value
            attribute = $attribute
            context = $snippet
            notes = "First-party HTTP URL remains in public output; classify as theme-owned, plugin-owned, content-owned, or sitemap/cache-owned before changing anything."
        })
    }

    if ($allMatches.Count -gt $MaxFindingsPerResource) {
        $Rows.Add([pscustomobject]@{
            checked_at = (Get-Date).ToString("s")
            status = "REVIEW"
            source_type = $SourceType
            request_url = $Result.RequestUrl
            http_status = $Result.Status
            final_url = $Result.FinalUrl
            title = $Result.Title
            occurrence_type = "truncated_resource"
            occurrence_url = ""
            attribute = ""
            context = ""
            notes = "Resource contains $($allMatches.Count) first-party HTTP references; CSV records first $MaxFindingsPerResource for bounded runtime."
        })
    }
}

function Get-SitemapUrls {
    param(
        [string]$Body
    )

    $urls = New-Object System.Collections.Generic.List[string]
    $locMatches = [regex]::Matches($Body, "<loc>\s*([^<]+?)\s*</loc>", "IgnoreCase")
    foreach ($loc in $locMatches) {
        $decoded = [System.Web.HttpUtility]::HtmlDecode($loc.Groups[1].Value.Trim())
        if ($decoded -and $decoded -match "^https?://(?:www\.)?jus-tice\.co\.il/") {
            $urls.Add($decoded)
        }
    }

    return $urls
}

$base = $BaseUrl.TrimEnd("/")
$handler = New-Object System.Net.Http.HttpClientHandler
$handler.AllowAutoRedirect = $true
$client = New-Object System.Net.Http.HttpClient($handler)
$client.Timeout = [TimeSpan]::FromSeconds(30)
$client.DefaultRequestHeaders.UserAgent.ParseAdd("Jus-Tice public internal HTTP scanner")

$rows = New-Object System.Collections.Generic.List[object]
$urlsToScan = New-Object System.Collections.Generic.List[string]
$seenUrls = @{}

try {
    foreach ($path in $SeedPaths) {
        $url = if ($path -match "^https?://") { $path } else { $base + "/" + $path.TrimStart("/") }
        if (-not $seenUrls.ContainsKey($url)) {
            $seenUrls[$url] = $true
            $urlsToScan.Add($url)
        }
    }

    $sitemapIndexUrl = "$base/sitemap_index.xml"
    $sitemapIndex = Invoke-LiveResource -Client $client -Url $sitemapIndexUrl
    Add-FindingRows -Rows $rows -Result $sitemapIndex -SourceType "sitemap_index"

    $sitemapChildren = Get-SitemapUrls -Body $sitemapIndex.Body
    foreach ($sitemapUrl in @($sitemapChildren | Select-Object -First $MaxSitemapChildren)) {
        $sitemapResult = Invoke-LiveResource -Client $client -Url $sitemapUrl
        Add-FindingRows -Rows $rows -Result $sitemapResult -SourceType "sitemap_child"

        $pageUrls = Get-SitemapUrls -Body $sitemapResult.Body
        foreach ($pageUrl in $pageUrls) {
            if ($urlsToScan.Count -ge ($SeedPaths.Count + $MaxSitemapPageUrls)) {
                break
            }

            if (-not $seenUrls.ContainsKey($pageUrl)) {
                $seenUrls[$pageUrl] = $true
                $urlsToScan.Add($pageUrl)
            }
        }
    }

    foreach ($url in $urlsToScan) {
        $requestUrl = Add-QaParam -Url $url
        $sourceType = if ($url -match "\.xml(\?|$)") { "sitemap_seed" } elseif ($url -match "\.txt(\?|$)") { "text_seed" } else { "html_page" }
        $result = Invoke-LiveResource -Client $client -Url $requestUrl
        Add-FindingRows -Rows $rows -Result $result -SourceType $sourceType
    }
} finally {
    $client.Dispose()
    $handler.Dispose()
}

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$rows | Export-Csv -Path $OutputPath -NoTypeInformation -Encoding UTF8

$reviewRows = @($rows | Where-Object { $_.status -eq "REVIEW" })
$verifiedRows = @($rows | Where-Object { $_.status -eq "VERIFIED" })

Write-Host "PUBLIC FIRST-PARTY HTTP LINK SCAN"
Write-Host "Output: $OutputPath"
Write-Host ("Checked rows: {0}; REVIEW: {1}; VERIFIED: {2}" -f $rows.Count, $reviewRows.Count, $verifiedRows.Count)

if ($reviewRows.Count -gt 0) {
    $reviewRows |
        Select-Object status,source_type,request_url,occurrence_type,attribute,occurrence_url,notes |
        Format-Table -AutoSize
    exit 1
}

exit 0
