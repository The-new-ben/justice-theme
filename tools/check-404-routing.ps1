param(
    [string]$BaseUrl = "https://jus-tice.co.il"
)

$ErrorActionPreference = "Stop"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Net.Http

function Invoke-NoRedirectRequest {
    param(
        [string]$Url
    )

    $handler = New-Object System.Net.Http.HttpClientHandler
    $handler.AllowAutoRedirect = $false

    $client = New-Object System.Net.Http.HttpClient($handler)
    $client.Timeout = [TimeSpan]::FromSeconds(25)

    try {
        $response = $client.GetAsync($Url).GetAwaiter().GetResult()
        $content = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
        $location = ""

        if ($response.Headers.Location) {
            $location = $response.Headers.Location.ToString()
        }

        $title = ""
        $titleMatch = [regex]::Match($content, "<title>(.*?)</title>", "Singleline")
        if ($titleMatch.Success) {
            $title = $titleMatch.Groups[1].Value.Trim()
        }

        return [pscustomobject]@{
            Url = $Url
            Status = [int]$response.StatusCode
            Location = $location
            Title = $title
            Has404Template = $content.Contains("error-404")
            HasThemeMarker = $content.Contains("justice-deployment-marker")
            HasSitemap = $content.Contains("sitemap_index.xml")
            LooksXml = $content.TrimStart().StartsWith("<?xml")
            Error = ""
        }
    } catch {
        return [pscustomobject]@{
            Url = $Url
            Status = 0
            Location = ""
            Title = ""
            Has404Template = $false
            HasThemeMarker = $false
            HasSitemap = $false
            LooksXml = $false
            Error = $_.Exception.Message
        }
    } finally {
        $client.Dispose()
        $handler.Dispose()
    }
}

function Write-Check {
    param(
        [string]$Name,
        [bool]$Passed,
        [object]$Result,
        [string]$Expected
    )

    $status = if ($Passed) { "PASS" } else { "FAIL" }
    Write-Host "$status $Name"
    Write-Host "  expected=$Expected"
    Write-Host "  status=$($Result.Status) location=$($Result.Location)"
    if ($Result.Title) {
        Write-Host "  title=$($Result.Title)"
    }
    if ($Result.Error) {
        Write-Host "  error=$($Result.Error)"
    }
    Write-Host ""
}

$base = $BaseUrl.TrimEnd("/")
$stamp = Get-Date -Format "yyyyMMddHHmmss"
$results = @()

$fake = Invoke-NoRedirectRequest -Url "$base/not-a-real-page-justice-routing-check-$stamp/"
$invalidPost = Invoke-NoRedirectRequest -Url "$base/?p=99999999"
$homeResult = Invoke-NoRedirectRequest -Url "$base/"
$articles = Invoke-NoRedirectRequest -Url "$base/articles/"
$lawyers = Invoke-NoRedirectRequest -Url "$base/lawyers/"
$robots = Invoke-NoRedirectRequest -Url "$base/robots.txt?routing_check=$stamp"
$sitemap = Invoke-NoRedirectRequest -Url "$base/sitemap_index.xml?routing_check=$stamp"

$checks = @(
    [pscustomobject]@{
        Name = "Fake URL returns real 404"
        Passed = ($fake.Status -eq 404 -and $fake.Location -eq "" -and $fake.Has404Template)
        Result = $fake
        Expected = "HTTP 404, no Location header, theme 404 template marker present"
    },
    [pscustomobject]@{
        Name = "Invalid post query returns real 404"
        Passed = ($invalidPost.Status -eq 404 -and $invalidPost.Location -eq "" -and $invalidPost.Has404Template)
        Result = $invalidPost
        Expected = "HTTP 404, no Location header, theme 404 template marker present"
    },
    [pscustomobject]@{
        Name = "Homepage remains healthy"
        Passed = ($homeResult.Status -eq 200 -and $homeResult.Location -eq "" -and $homeResult.HasThemeMarker)
        Result = $homeResult
        Expected = "HTTP 200, no Location header, theme marker present"
    },
    [pscustomobject]@{
        Name = "Articles archive remains healthy"
        Passed = ($articles.Status -eq 200 -and $articles.Location -eq "")
        Result = $articles
        Expected = "HTTP 200, no Location header"
    },
    [pscustomobject]@{
        Name = "Lawyers archive remains healthy"
        Passed = ($lawyers.Status -eq 200 -and $lawyers.Location -eq "")
        Result = $lawyers
        Expected = "HTTP 200, no Location header"
    },
    [pscustomobject]@{
        Name = "Robots advertises sitemap"
        Passed = ($robots.Status -eq 200 -and $robots.HasSitemap)
        Result = $robots
        Expected = "HTTP 200 and sitemap_index.xml present"
    },
    [pscustomobject]@{
        Name = "Sitemap index remains XML"
        Passed = ($sitemap.Status -eq 200 -and $sitemap.LooksXml)
        Result = $sitemap
        Expected = "HTTP 200 XML"
    }
)

Write-Host "404 ROUTING CHECK"
Write-Host "Base URL: $base"
Write-Host ""

$failed = 0
foreach ($check in $checks) {
    Write-Check -Name $check.Name -Passed $check.Passed -Result $check.Result -Expected $check.Expected
    if (-not $check.Passed) {
        $failed++
    }
}

if ($failed -gt 0) {
    Write-Host "RESULT: BLOCKED - $failed check(s) failed."
    exit 1
}

Write-Host "RESULT: VERIFIED - all routing checks passed."
