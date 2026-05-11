param(
    [string] $BaseUrl = "https://jus-tice.co.il",
    [string] $Plugin = "ultra-justice-engine/ultra-justice-engine.php",
    [string] $OutputJson = "project-control/live-active-plugin-manifest.json",
    [string] $OutputCsv = "project-control/live-active-plugin-manifest.csv",
    [string] $Username = $env:JUSTICE_WP_USER,
    [string] $ApplicationPassword = $env:JUSTICE_WP_APP_PASSWORD
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Username) -or [string]::IsNullOrWhiteSpace($ApplicationPassword)) {
    Write-Host "BLOCKED: set JUSTICE_WP_USER and JUSTICE_WP_APP_PASSWORD, or pass -Username and -ApplicationPassword."
    Write-Host "Use a WordPress Application Password, not the normal account password."
    exit 2
}

$encodedPlugin = [System.Uri]::EscapeDataString($Plugin)
$endpoint = ($BaseUrl.TrimEnd('/')) + "/wp-json/justice-theme/v1/active-plugin-manifest?plugin=$encodedPlugin"
$token = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${Username}:${ApplicationPassword}"))
$headers = @{ Authorization = "Basic $token" }

Write-Host "PLUGIN MANIFEST DIAGNOSTIC AUTHENTICATED EXPORT"
Write-Host "Endpoint: $endpoint"
Write-Host "Output JSON: $OutputJson"
Write-Host "Output CSV: $OutputCsv"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $endpoint -UseBasicParsing -Method GET -Headers $headers -TimeoutSec 60
    $status = [int] $response.StatusCode
    $body = [string] $response.Content
} catch {
    if ($_.Exception.Response) {
        $status = [int] $_.Exception.Response.StatusCode
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        $reader.Close()

        Write-Host "HTTP status: $status"
        Write-Host $body.Substring(0, [Math]::Min(500, $body.Length))
        exit 1
    }

    throw
}

if ($status -ne 200) {
    Write-Host "HTTP status: $status"
    Write-Host "BLOCKED: expected HTTP 200 from authenticated route."
    exit 1
}

$jsonDirectory = Split-Path -Parent $OutputJson
if ($jsonDirectory -and -not (Test-Path -LiteralPath $jsonDirectory)) {
    New-Item -ItemType Directory -Path $jsonDirectory | Out-Null
}

$csvDirectory = Split-Path -Parent $OutputCsv
if ($csvDirectory -and -not (Test-Path -LiteralPath $csvDirectory)) {
    New-Item -ItemType Directory -Path $csvDirectory | Out-Null
}

$body | Set-Content -LiteralPath $OutputJson -Encoding UTF8

$payload = $body | ConvertFrom-Json
if (-not $payload.ok -or -not $payload.files) {
    Write-Host "BLOCKED: route response did not include a files array."
    exit 1
}

$payload.files | ForEach-Object {
    [pscustomobject]@{
        path = $_.path
        bytes = $_.bytes
        sha256 = ($_.sha256).ToUpperInvariant()
        last_modified_live = $_.last_modified
    }
} | Export-Csv -LiteralPath $OutputCsv -NoTypeInformation -Encoding UTF8

Write-Host "RESULT: VERIFIED - exported live active plugin manifest."
Write-Host "Plugin: $($payload.plugin)"
Write-Host "File count: $($payload.file_count)"
Write-Host "Total bytes: $($payload.total_bytes)"
