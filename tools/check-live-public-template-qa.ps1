param(
    [string]$BaseUrl = "https://jus-tice.co.il",
    [string]$OutputPath = "project-control/live-public-template-qa-2026-05-11.csv"
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
    return $Url + $separator + "qa=public-template-" + (Get-Date -Format "yyyyMMddHHmmss")
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

function Invoke-LivePage {
    param(
        [string]$Url
    )

    $handler = New-Object System.Net.Http.HttpClientHandler
    $handler.AllowAutoRedirect = $true

    $client = New-Object System.Net.Http.HttpClient($handler)
    $client.Timeout = [TimeSpan]::FromSeconds(30)
    $client.DefaultRequestHeaders.UserAgent.ParseAdd("Jus-Tice public template QA")

    try {
        $response = $client.GetAsync($Url).GetAwaiter().GetResult()
        $content = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
        $finalUrl = $response.RequestMessage.RequestUri.AbsoluteUri

        $title = ""
        $titleMatch = [regex]::Match($content, "<title>(.*?)</title>", "Singleline")
        if ($titleMatch.Success) {
            $title = Convert-HtmlText -Value $titleMatch.Groups[1].Value
        }

        $h1 = ""
        $h1Match = [regex]::Match($content, "<h1[^>]*>(.*?)</h1>", "Singleline")
        if ($h1Match.Success) {
            $h1 = Convert-HtmlText -Value $h1Match.Groups[1].Value
        }

        return [pscustomobject]@{
            Url = $Url
            Status = [int]$response.StatusCode
            FinalUrl = $finalUrl
            Body = $content
            Title = $title
            H1 = $h1
            Error = ""
        }
    } catch {
        return [pscustomobject]@{
            Url = $Url
            Status = 0
            FinalUrl = ""
            Body = ""
            Title = ""
            H1 = ""
            Error = $_.Exception.Message
        }
    } finally {
        $client.Dispose()
        $handler.Dispose()
    }
}

function New-QaRow {
    param(
        [string]$PageKey,
        [string]$Url,
        [object]$Result,
        [string]$Notes = ""
    )

    $body = [string]$Result.Body
    $title = [string]$Result.Title
    $finalUrl = [string]$Result.FinalUrl

    $manifestCount = ([regex]::Matches($body, "rel=[`"']manifest")).Count
    $relatedClusterAttrCount = ([regex]::Matches($body, "data-related-cluster-match")).Count
    $titleEnglishLeak = ($title -match "Archive|You searched for|Search results for")
    $searchEnglishUiLeak = ($body.Contains("Search results for:") -or $body.Contains(">Previous<") -or $body.Contains(">Next<"))
    $filterStayedOnLawyers = if ($PageKey -like "lawyers_filter_*") { $finalUrl.Contains("/lawyers/") } else { $true }
    $genericLawyerFilterTitle = if ($PageKey -like "lawyers_filter_*" -and $Result.H1) {
        -not $title.Contains([string]$Result.H1)
    } else {
        $false
    }

    $statusLabel = "VERIFIED"
    if ($Result.Status -ne 200 -or $titleEnglishLeak -or $searchEnglishUiLeak -or -not $filterStayedOnLawyers -or $genericLawyerFilterTitle -or $Result.Error) {
        $statusLabel = "REVIEW"
    }

    if ($PageKey -eq "theme_marker" -and -not $body.Contains("justice-theme-deployment-marker=")) {
        $statusLabel = "REVIEW"
    }

    [pscustomobject]@{
        checked_at = (Get-Date).ToString("s")
        status = $statusLabel
        page_key = $PageKey
        request_url = $Url
        http_status = $Result.Status
        final_url = $Result.FinalUrl
        title = $Result.Title
        h1 = $Result.H1
        has_theme_marker = $body.Contains("justice-deployment-marker") -or $body.Contains("justice-theme-deployment-marker=")
        manifest_count = $manifestCount
        has_media_favicon = $body.Contains("/wp-content/uploads/fbrfg/") -or $body.Contains("cropped-favicon")
        has_theme_favicon_fallback = $body.Contains("/wp-content/themes/justice-theme/") -and $body.Contains("favicon")
        home_traffic_fallback_ok = if ($PageKey -eq "home") { $body.Contains("/lawyers/?area=traffic-law") } else { "" }
        home_ai_fallback_ok = if ($PageKey -eq "home") { $body.Contains("#ask-lawyer") } else { "" }
        breadcrumb_markup_seen = $body.Contains("breadcrumb") -or $body.Contains("BreadcrumbList")
        breadcrumb_schema_seen = $body.Contains("BreadcrumbList")
        related_semantic_attrs_seen = $body.Contains("data-related-mode=`"semantic`"") -or $body.Contains("data-related-source-cluster")
        related_cluster_attr_count = $relatedClusterAttrCount
        title_english_leak = $titleEnglishLeak
        search_english_ui_leak = $searchEnglishUiLeak
        filter_stayed_on_lawyers = $filterStayedOnLawyers
        generic_lawyer_filter_title = $genericLawyerFilterTitle
        notes = if ($Result.Error) { $Result.Error } else { $Notes }
    }
}

$base = $BaseUrl.TrimEnd("/")

$checks = @(
    @{ key = "theme_marker"; url = "$base/wp-content/themes/justice-theme/deployment-marker.txt"; notes = "Static marker verifies uPress theme sync." },
    @{ key = "home"; url = "$base/"; notes = "Homepage source checks branding, favicon manifests and fallback links." },
    @{ key = "lawyers"; url = "$base/lawyers/"; notes = "Main lawyer directory." },
    @{ key = "lawyers_filter_personal_injury"; url = "$base/lawyers/?area=personal-injury-law"; notes = "Clean alias should stay on lawyers and use a specific title." },
    @{ key = "lawyers_filter_medical_malpractice"; url = "$base/lawyers/?area=medical-malpractice-law"; notes = "Clean alias should stay on lawyers and use a specific title." },
    @{ key = "lawyers_filter_employment"; url = "$base/lawyers/?area=employment-law"; notes = "Clean alias should stay on lawyers and use a specific title." },
    @{ key = "lawyers_filter_labor"; url = "$base/lawyers/?area=labor-law"; notes = "Canonical labor filter should remain specific." },
    @{ key = "lawyers_filter_traffic"; url = "$base/lawyers/?area=traffic-law"; notes = "Traffic filter should remain specific." },
    @{ key = "articles"; url = "$base/articles/"; notes = "Articles archive title and breadcrumb/schema source check." },
    @{ key = "article_sample"; url = "$base/find-lawyer-how-to-find-good-attorney/"; notes = "Single article related-content QA attributes." },
    @{ key = "search_hebrew"; url = "$base/?s=%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F"; notes = "Search page should not leak English default labels." }
)

$rows = @()

foreach ($check in $checks) {
    $requestUrl = Add-QaParam -Url $check.url
    $result = Invoke-LivePage -Url $requestUrl
    $rows += New-QaRow -PageKey $check.key -Url $requestUrl -Result $result -Notes $check.notes
}

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$rows | Export-Csv -Path $OutputPath -NoTypeInformation -Encoding UTF8

Write-Host "LIVE PUBLIC TEMPLATE QA"
Write-Host "Output: $OutputPath"
$rows | Select-Object status,page_key,http_status,title,h1,final_url,notes | Format-Table -AutoSize

if ($rows | Where-Object { $_.status -eq "REVIEW" }) {
    exit 1
}

exit 0
