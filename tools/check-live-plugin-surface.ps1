param(
    [string]$BaseUrl = "https://jus-tice.co.il"
)

$ErrorActionPreference = "Stop"

function Invoke-LiveJson {
    param(
        [string]$Url
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 25 -MaximumRedirection 0
        $content = ([string]$response.Content).TrimStart([char]0xFEFF)
        $json = $null

        try {
            $json = $content | ConvertFrom-Json
        } catch {
            $json = $null
        }

        return [pscustomobject]@{
            Url = $Url
            Status = [int]$response.StatusCode
            Json = $json
            BodyStart = $content.Substring(0, [Math]::Min(240, $content.Length)).Replace("`r", " ").Replace("`n", " ")
            Error = ""
        }
    } catch {
        $statusCode = 0
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
        }

        return [pscustomobject]@{
            Url = $Url
            Status = $statusCode
            Json = $null
            BodyStart = ""
            Error = $_.Exception.Message
        }
    }
}

$base = $BaseUrl.TrimEnd("/")

$root = Invoke-LiveJson -Url "$base/wp-json/"
$types = Invoke-LiveJson -Url "$base/wp-json/wp/v2/types"
$ultraJusticeEngine = Invoke-LiveJson -Url "$base/wp-json/ultra-justice-engine/v1"
$ultraJusticeEngineHealth = Invoke-LiveJson -Url "$base/wp-json/ultra-justice-engine/v1/health"
$justiceCore = Invoke-LiveJson -Url "$base/wp-json/justice-core/v1"
$ultraJustice = Invoke-LiveJson -Url "$base/wp-json/ultra-justice/v1"

$namespaces = @()
if ($root.Json -and $root.Json.namespaces) {
    $namespaces = @($root.Json.namespaces)
}

$justiceNamespaces = $namespaces | Where-Object {
    $_ -in @("ultra-justice-engine/v1", "justice-core/v1", "ultra-justice/v1")
}

Write-Host "LIVE PLUGIN SURFACE CHECK"
Write-Host "Base URL: $base"
Write-Host ""

Write-Host "REST namespace exposure:"
foreach ($namespace in @("ultra-justice-engine/v1", "justice-core/v1", "ultra-justice/v1")) {
    $status = if ($justiceNamespaces -contains $namespace) { "VERIFIED" } else { "NOT_EXPOSED" }
    Write-Host "  $status $namespace"
}
Write-Host ""

Write-Host "Namespace endpoint status:"
Write-Host "  ultra-justice-engine/v1 status=$($ultraJusticeEngine.Status)"
Write-Host "  ultra-justice-engine/v1/health status=$($ultraJusticeEngineHealth.Status)"
Write-Host "  justice-core/v1 status=$($justiceCore.Status)"
Write-Host "  ultra-justice/v1 status=$($ultraJustice.Status)"
Write-Host ""

Write-Host "Registered public content types:"
if ($types.Json) {
	$typeNames = @()
	$types.Json.PSObject.Properties | ForEach-Object {
		$typeNames += $_.Name
	}
	foreach ($name in @("articles", "justice_lawyer", "justice_lead")) {
		$status = if ($typeNames -contains $name) { "VERIFIED" } else { "NOT_EXPOSED" }
		Write-Host "  $status $name"
	}
	Write-Host ""
	Write-Host "LegalTech content types:"
	foreach ($name in @("justice_legal_tool", "justice_legal_request")) {
		$status = if ($typeNames -contains $name) { "VERIFIED" } else { "NOT_EXPOSED" }
		Write-Host "  $status $name"
	}
	Write-Host ""
	Write-Host "Legacy content types still exposed:"
	foreach ($name in @("labor_law", "small_claims", "corona_virus", "supreme_court", "tort", "goverment-gazette", "yada_wiki")) {
		if ($typeNames -contains $name) {
			Write-Host "  VERIFIED $name"
		}
	}
} else {
	Write-Host "  NOT VERIFIED: could not read wp/v2/types"
}
Write-Host ""

if ($justiceNamespaces -contains "ultra-justice-engine/v1" -and
    -not ($justiceNamespaces -contains "justice-core/v1") -and
    -not ($justiceNamespaces -contains "ultra-justice/v1")) {
    Write-Host "RESULT: VERIFIED - live REST surface points to ultra-justice-engine as the active Justice plugin namespace."
    exit 0
}

Write-Host "RESULT: REVIEW - unexpected Justice plugin namespace combination."
exit 1
