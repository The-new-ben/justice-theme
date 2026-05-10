param(
    [string]$BaseUrl = "https://jus-tice.co.il",
    [string]$ThemeFolder = "justice-theme",
    [string]$Marker = "2026-05-10-runtime-guard-v5"
)

$ErrorActionPreference = "Stop"

function Test-Page {
    param(
        [string]$Url,
        [string[]]$Contains = @()
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -MaximumRedirection 5 -UseBasicParsing -TimeoutSec 25
        $content = [string]$response.Content
        $found = @()

        foreach ($needle in $Contains) {
            if ($content -like "*$needle*") {
                $found += $needle
            }
        }

        return [pscustomobject]@{
            Url = $Url
            Status = [int]$response.StatusCode
            Found = ($found -join "|")
            FinalUrl = $response.BaseResponse.ResponseUri.AbsoluteUri
            Error = ""
        }
    } catch {
        return [pscustomobject]@{
            Url = $Url
            Status = 0
            Found = ""
            FinalUrl = ""
            Error = $_.Exception.Message
        }
    }
}

$base = $BaseUrl.TrimEnd("/")
$staticMarkerUrl = "$base/wp-content/themes/$ThemeFolder/deployment-marker.txt"
$badMarkers = @("NOT VERIFIED", "PARTIAL:", "READY NEXT", "project-control", "Source audit", "GSC", "CRM", "CMS", "Tools > Jus-Tice", "FAQ schema", "source audit")
$familyPaths = @(
    "/divorce-lawyer/",
    "/consensual-divorce/",
    "/divorce-mediation/",
    "/child-support/",
    "/child-custody/",
    "/divorce-property-division/",
    "/family-dispute-resolution/"
)

Write-Host "DEPLOYMENT CHECK"
Write-Host "Base URL: $base"
Write-Host ""

$homepage = Test-Page -Url "$base/" -Contains @("justice-deployment-marker", $Marker)
$static = Test-Page -Url $staticMarkerUrl -Contains @($Marker)

Write-Host "Homepage PHP marker:"
if ($homepage.Found -like "*$Marker*") {
    Write-Host "VERIFIED: latest theme PHP marker is rendering."
} else {
    Write-Host "NOT VERIFIED: latest theme PHP marker is absent."
}
Write-Host "  status=$($homepage.Status) found=$($homepage.Found) final=$($homepage.FinalUrl) error=$($homepage.Error)"
Write-Host ""

Write-Host "Static theme-file marker:"
if ($static.Found -like "*$Marker*") {
    Write-Host "VERIFIED: latest theme files appear to be present at the expected theme path."
} else {
    Write-Host "NOT VERIFIED: static deployment marker is absent at the expected theme path."
}
Write-Host "  status=$($static.Status) found=$($static.Found) final=$($static.FinalUrl) error=$($static.Error)"
Write-Host ""

Write-Host "Family-law public marker scan:"
foreach ($path in $familyPaths) {
    $result = Test-Page -Url "$base$path" -Contains $badMarkers
    if ([string]::IsNullOrWhiteSpace($result.Found)) {
        Write-Host "VERIFIED CLEAN: $path status=$($result.Status)"
    } else {
        Write-Host "STILL DIRTY: $path status=$($result.Status) markers=$($result.Found)"
    }
}
