param(
	[string] $BaseUrl = "https://jus-tice.co.il",
	[string] $ExpectedCommit = "",
	[string] $ExpectedMarker = "2026-06-06-mobile-menu-a11y-overlay-clearance-v2",
	[string] $ExpectedNavigationToken = "lockPageScroll",
	[string] $ExpectedCssToken = "html.nav-is-open body #pojo-a11y-toolbar"
)

$ErrorActionPreference = "Stop"

function Get-LiveText {
	param(
		[string] $Url
	)

	$response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 20

	return [ordered]@{
		statusCode = [int] $response.StatusCode
		finalUri   = $response.BaseResponse.ResponseUri.AbsoluteUri
		body       = [string] $response.Content
	}
}

$normalizedBase = $BaseUrl.TrimEnd("/")

if ([string]::IsNullOrWhiteSpace($ExpectedCommit)) {
	$ExpectedCommit = (git ls-remote --heads origin main) -join "`n"
	$ExpectedCommit = ($ExpectedCommit -split "\s+")[0]
}

$markerUrl = "$normalizedBase/wp-content/themes/justice-theme/deployment-marker.txt?codex_check=$ExpectedCommit"
$navigationUrl = "$normalizedBase/wp-content/themes/justice-theme/assets/js/navigation.js?codex_check=$ExpectedCommit"
$cssUrl = "$normalizedBase/wp-content/themes/justice-theme/assets/css/premium-pass-4.css?codex_check=$ExpectedCommit"

$marker = Get-LiveText -Url $markerUrl
$navigation = Get-LiveText -Url $navigationUrl
$css = Get-LiveText -Url $cssUrl

$markerHasExpected = $marker.body.Contains($ExpectedMarker)
$navigationHasExpected = $navigation.body.Contains($ExpectedNavigationToken)
$navigationHasHtmlLock = $navigation.body.Contains("document.documentElement.classList.add")
$cssHasExpected = $css.body.Contains($ExpectedCssToken)

$result = [ordered]@{
	checkedAt                  = (Get-Date).ToUniversalTime().ToString("o")
	baseUrl                    = $normalizedBase
	expectedCommit             = $ExpectedCommit
	expectedMarker             = $ExpectedMarker
	expectedNavigationToken    = $ExpectedNavigationToken
	expectedCssToken           = $ExpectedCssToken
	markerUrl                  = $markerUrl
	navigationUrl              = $navigationUrl
	cssUrl                     = $cssUrl
	markerStatusCode           = $marker.statusCode
	navigationStatusCode       = $navigation.statusCode
	cssStatusCode              = $css.statusCode
	markerHasExpected          = $markerHasExpected
	navigationHasExpected      = $navigationHasExpected
	navigationHasHtmlLock      = $navigationHasHtmlLock
	cssHasExpected             = $cssHasExpected
	liveDeploymentMatchesCode  = ($markerHasExpected -and $navigationHasExpected -and $navigationHasHtmlLock -and $cssHasExpected)
	liveMarkerBody             = $marker.body.Trim()
	navigationLength           = $navigation.body.Length
	cssLength                  = $css.body.Length
	note                       = "Read-only live theme deployment check. Does not change CMS, files, SEO, payment, invoices, leads, or database state."
}

$result | ConvertTo-Json -Depth 5

if (-not $result.liveDeploymentMatchesCode) {
	exit 1
}

exit 0
