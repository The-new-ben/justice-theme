param(
    [string]$BaseUrl = "https://jus-tice.co.il",
    [string]$OutputPath = "project-control/live-lawyer-rest-public-guard-2026-05-11.csv"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Web

function Invoke-LiveRequest {
    param(
        [string]$Url,
        [int]$MaxRedirection = 5
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -MaximumRedirection $MaxRedirection -UseBasicParsing -Headers @{
            "User-Agent" = "Jus-Tice lawyer REST public guard QA"
        }

        return [pscustomobject]@{
            Url = $Url
            Status = [int]$response.StatusCode
            FinalUrl = if ($response.BaseResponse.ResponseUri) { $response.BaseResponse.ResponseUri.AbsoluteUri } else { $Url }
            Headers = $response.Headers
            Body = [string]$response.Content
            Error = ""
        }
    } catch {
        $status = 0
        $headers = @{}
        if ($_.Exception.Response) {
            $status = [int]$_.Exception.Response.StatusCode
            $headers = $_.Exception.Response.Headers
        }

        return [pscustomobject]@{
            Url = $Url
            Status = $status
            FinalUrl = ""
            Headers = $headers
            Body = ""
            Error = $_.Exception.Message
        }
    }
}

function Get-MatchCount {
    param(
        [string]$Body,
        [string]$Pattern
    )

    return ([regex]::Matches($Body, $Pattern, "IgnoreCase")).Count
}

function Get-Title {
    param(
        [string]$Body
    )

    $match = [regex]::Match($Body, "<title[^>]*>(.*?)</title>", "Singleline,IgnoreCase")
    if (-not $match.Success) {
        return ""
    }

    $text = [regex]::Replace($match.Groups[1].Value, "<[^>]+>", " ")
    $text = [regex]::Replace($text, "\s+", " ").Trim()
    return [System.Web.HttpUtility]::HtmlDecode($text)
}

function New-Row {
    param(
        [string]$Key,
        [object]$Result,
        [string]$Expectation
    )

    $body = [string]$Result.Body
    $xWpTotal = ""
    try {
        $xWpTotal = [string]$Result.Headers["X-WP-Total"]
    } catch {
        $xWpTotal = ""
    }

    $marker = ""
    $markerMatch = [regex]::Match($body, 'justice-deployment-marker" content="([^"]+)"')
    if ($markerMatch.Success) {
        $marker = $markerMatch.Groups[1].Value
    }

    $placeholderHits = Get-MatchCount -Body $body -Pattern "054555|5551234|050000|000000|123456|05[0-9][\-\s]?555"
    $sensitiveHits = Get-MatchCount -Body $body -Pattern '"(phone|email|whatsapp|profile_views|internal_notes)"\s*:'
    $lawyerCards = Get-MatchCount -Body $body -Pattern "lawyer-card"

    $status = "VERIFIED"
    if ($Key -eq "rest_collection" -and ($placeholderHits -gt 0 -or $sensitiveHits -gt 0)) {
        $status = "REVIEW"
    }
    if ($Key -eq "rest_single_seed" -and $Result.Status -ne 404) {
        $status = "REVIEW"
    }
    if ($Key -eq "old_profile_route" -and ($Result.Status -ne 404 -or $body -match "canonical.+lawyers" -or $body -match "max-snippet|follow, index")) {
        $status = "REVIEW"
    }
    if ($Key -eq "archive" -and ($Result.Status -ne 200 -or $placeholderHits -gt 0)) {
        $status = "REVIEW"
    }
    if ($Key -eq "marker" -and ($body -notmatch "2026-05-11-lawyer-rest-public-guard-v1")) {
        $status = "REVIEW"
    }
    if ($Result.Error) {
        $status = "REVIEW"
    }

    [pscustomobject]@{
        checked_at = (Get-Date).ToString("s")
        status = $status
        key = $Key
        request_url = $Result.Url
        http_status = $Result.Status
        final_url = $Result.FinalUrl
        x_wp_total = $xWpTotal
        marker = $marker
        title = Get-Title -Body $body
        body_length = $body.Length
        lawyer_card_count = $lawyerCards
        placeholder_phone_hits = $placeholderHits
        sensitive_meta_hits = $sensitiveHits
        expectation = $Expectation
        notes = $Result.Error
    }
}

$base = $BaseUrl.TrimEnd("/")
$cacheBust = "qa=lawyer-rest-guard-" + (Get-Date -Format "yyyyMMddHHmmss")

$checks = @(
    @{ key = "marker"; url = "$base/wp-content/themes/justice-theme/deployment-marker.txt?$cacheBust"; expectation = "Deployment marker should be 2026-05-11-lawyer-rest-public-guard-v1 after uPress pull." },
    @{ key = "archive"; url = "$base/lawyers/?$cacheBust"; expectation = "Archive stays public 200 and does not expose placeholder phone data." },
    @{ key = "rest_collection"; url = "$base/wp-json/wp/v2/justice_lawyer?per_page=20&$cacheBust"; expectation = "Anonymous REST collection exposes approved-only profiles and no sensitive meta." },
    @{ key = "rest_single_seed"; url = "$base/wp-json/wp/v2/justice_lawyer/19139?$cacheBust"; expectation = "Known seed profile ID returns 404 to anonymous users." },
    @{ key = "old_profile_route"; url = "$base/lawyers/%D7%A2%D7%95%D7%93-%D7%90%D7%99%D7%AA%D7%9F-%D7%9B%D7%A5/?$cacheBust"; expectation = "Old unapproved profile route returns generic noindex 404 without lawyer canonical." }
)

$rows = foreach ($check in $checks) {
    $result = Invoke-LiveRequest -Url $check.url
    New-Row -Key $check.key -Result $result -Expectation $check.expectation
}

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$rows | Export-Csv -Path $OutputPath -NoTypeInformation -Encoding UTF8

Write-Host "LIVE LAWYER REST PUBLIC GUARD QA"
Write-Host "Output: $OutputPath"
$rows | Select-Object status,key,http_status,x_wp_total,placeholder_phone_hits,sensitive_meta_hits,title,expectation | Format-Table -AutoSize

if ($rows | Where-Object { $_.status -eq "REVIEW" }) {
    exit 1
}

exit 0
