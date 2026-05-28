param(
	[string] $BaseUrl = "https://jus-tice.co.il",
	[string] $ExpectedCommit = "bc78bf692f6bb9539b22fc25e39169bc7bc7410d",
	[string] $ExpectedMarker = "2026-05-28-mobile-menu-stable-fixed-drawer-v2",
	[string] $ExpectedNavigationToken = "lockPageScroll"
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
$markerUrl = "$normalizedBase/wp-content/themes/justice-theme/deployment-marker.txt?codex_check=$ExpectedCommit"
$navigationUrl = "$normalizedBase/wp-content/themes/justice-theme/assets/js/navigation.js?codex_check=$ExpectedCommit"

$marker = Get-LiveText -Url $markerUrl
$navigation = Get-LiveText -Url $navigationUrl

$markerHasExpected = $marker.body.Contains($ExpectedMarker)
$navigationHasExpected = $navigation.body.Contains($ExpectedNavigationToken)
$navigationHasHtmlLock = $navigation.body.Contains("document.documentElement.classList.add")

$result = [ordered]@{
	checkedAt                  = (Get-Date).ToUniversalTime().ToString("o")
	baseUrl                    = $normalizedBase
	expectedCommit             = $ExpectedCommit
	expectedMarker             = $ExpectedMarker
	expectedNavigationToken    = $ExpectedNavigationToken
	markerUrl                  = $markerUrl
	navigationUrl              = $navigationUrl
	markerStatusCode           = $marker.statusCode
	navigationStatusCode       = $navigation.statusCode
	markerHasExpected          = $markerHasExpected
	navigationHasExpected      = $navigationHasExpected
	navigationHasHtmlLock      = $navigationHasHtmlLock
	liveDeploymentMatchesCode  = ($markerHasExpected -and $navigationHasExpected -and $navigationHasHtmlLock)
	liveMarkerBody             = $marker.body.Trim()
	navigationLength           = $navigation.body.Length
	note                       = "Read-only live theme deployment check. Does not change CMS, files, SEO, payment, invoices, leads, or database state."
}

$result | ConvertTo-Json -Depth 5

if (-not $result.liveDeploymentMatchesCode) {
	exit 1
}
