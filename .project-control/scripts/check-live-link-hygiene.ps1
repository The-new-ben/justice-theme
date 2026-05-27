param(
	[string] $BaseUrl = "https://jus-tice.co.il",
	[string] $Root = ".",
	[switch] $SkipLive
)

$ErrorActionPreference = "Stop"

$rootPath = (Resolve-Path -LiteralPath $Root).Path
$scriptPath = Join-Path $rootPath "scripts\check-link-hygiene.mjs"

if (-not (Test-Path -LiteralPath $scriptPath)) {
	$result = [ordered]@{
		checkedAt = (Get-Date).ToUniversalTime().ToString("o")
		baseUrl   = $BaseUrl.TrimEnd("/")
		pass      = $false
		error     = "Missing scripts/check-link-hygiene.mjs"
		note      = "Read-only wrapper. It does not change links, menus, redirects, canonicals, CMS content, leads, or payments."
	}
	$result | ConvertTo-Json -Depth 8
	exit 1
}

$arguments = @(
	$scriptPath,
	"--base-url", $BaseUrl,
	"--root", $rootPath
)

if ($SkipLive) {
	$arguments += "--skip-live"
}

$output = & node @arguments 2>&1
$exitCode = $LASTEXITCODE
$text = ($output | Out-String).Trim()

try {
	$parsed = $text | ConvertFrom-Json
	$parsed | ConvertTo-Json -Depth 12
} catch {
	$result = [ordered]@{
		checkedAt  = (Get-Date).ToUniversalTime().ToString("o")
		baseUrl    = $BaseUrl.TrimEnd("/")
		pass       = $false
		parseError = $_.Exception.Message
		rawOutput  = $text
		note       = "Read-only wrapper. It does not change links, menus, redirects, canonicals, CMS content, leads, or payments."
	}
	$result | ConvertTo-Json -Depth 8
	exit 1
}

if ($exitCode -ne 0) {
	exit $exitCode
}
