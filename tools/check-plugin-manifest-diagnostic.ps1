param(
    [string] $BaseUrl = "https://jus-tice.co.il",
    [string] $Plugin = "ultra-justice-engine/ultra-justice-engine.php"
)

$ErrorActionPreference = "Stop"

$encodedPlugin = [System.Uri]::EscapeDataString($Plugin)
$endpoint = ($BaseUrl.TrimEnd('/')) + "/wp-json/justice-theme/v1/active-plugin-manifest?plugin=$encodedPlugin"

Write-Host "PLUGIN MANIFEST DIAGNOSTIC PUBLIC ACCESS CHECK"
Write-Host "Endpoint: $endpoint"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $endpoint -UseBasicParsing -Method GET -TimeoutSec 30
    $status = [int] $response.StatusCode
    $body = [string] $response.Content
} catch {
    if ($_.Exception.Response) {
        $status = [int] $_.Exception.Response.StatusCode
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        $reader.Close()
    } else {
        throw
    }
}

Write-Host "HTTP status: $status"

if ($status -eq 401 -or $status -eq 403) {
    Write-Host "RESULT: VERIFIED - diagnostic route is protected from public unauthenticated access."
    exit 0
}

if ($status -eq 404) {
    Write-Host "RESULT: NOT VERIFIED - diagnostic route is not deployed or plugin was not found."
    exit 1
}

if ($status -eq 200) {
    Write-Host "RESULT: BLOCKED - diagnostic route returned public data without authentication."
    if ($body) {
        Write-Host $body.Substring(0, [Math]::Min(500, $body.Length))
    }
    exit 2
}

Write-Host "RESULT: REVIEW - unexpected status $status."
if ($body) {
    Write-Host $body.Substring(0, [Math]::Min(500, $body.Length))
}
exit 3
