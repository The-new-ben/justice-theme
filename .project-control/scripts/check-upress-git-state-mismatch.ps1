param(
	[string] $ObservedUpressHead = "ce695fc9",
	[string] $ObservedUpressSubject = "Record mobile menu stable in place deployment",
	[string] $ExpectedGithubHead = "",
	[string] $ExpectedMenuCommit = "bc78bf69",
	[string] $ExpectedRuntimeMarker = "2026-06-06-mobile-menu-a11y-overlay-clearance-v2",
	[string] $ExpectedCssToken = "html.nav-is-open body #pojo-a11y-toolbar",
	[string] $BaseUrl = "https://jus-tice.co.il"
)

$ErrorActionPreference = "Stop"

function Get-TextOrEmpty {
	param(
		[string] $Url
	)

	try {
		$response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 20
		return [string] $response.Content
	} catch {
		return ""
	}
}

$remoteMain = (git ls-remote --heads origin main) -join "`n"
$remoteRelease = (git ls-remote --heads origin codex/live-homepage-conversion-release) -join "`n"

if ([string]::IsNullOrWhiteSpace($ExpectedGithubHead)) {
	$ExpectedGithubHead = ($remoteMain -split "\s+")[0]
}

$localContainsObserved = $false
$localContainsExpected = $false

git cat-file -e "$ObservedUpressHead^{commit}" 2>$null
if ($LASTEXITCODE -eq 0) {
	$localContainsObserved = $true
}

git cat-file -e "$ExpectedGithubHead^{commit}" 2>$null
if ($LASTEXITCODE -eq 0) {
	$localContainsExpected = $true
}

$normalizedBase = $BaseUrl.TrimEnd("/")
$markerUrl = "$normalizedBase/wp-content/themes/justice-theme/deployment-marker.txt?upress_state_check=$ExpectedGithubHead"
$navigationUrl = "$normalizedBase/wp-content/themes/justice-theme/assets/js/navigation.js?upress_state_check=$ExpectedGithubHead"
$cssUrl = "$normalizedBase/wp-content/themes/justice-theme/assets/css/premium-pass-4.css?upress_state_check=$ExpectedGithubHead"
$markerBody = Get-TextOrEmpty -Url $markerUrl
$navigationBody = Get-TextOrEmpty -Url $navigationUrl
$cssBody = Get-TextOrEmpty -Url $cssUrl

$githubMainHasExpected = $remoteMain.Contains($ExpectedGithubHead)
$githubReleaseHasExpected = $remoteRelease.Contains($ExpectedGithubHead)
$liveHasMenuFix = $navigationBody.Contains("lockPageScroll")
$liveHasCssFix = $cssBody.Contains($ExpectedCssToken)
$liveMarkerCurrent = $markerBody.Contains($ExpectedRuntimeMarker)
$observedServerCommitKnownLocally = $localContainsObserved
$observedIsAncestorOfExpected = $false
$expectedIsAncestorOfObserved = $false

if ($localContainsObserved -and $localContainsExpected) {
	git merge-base --is-ancestor $ObservedUpressHead $ExpectedGithubHead 2>$null
	$observedIsAncestorOfExpected = ($LASTEXITCODE -eq 0)

	git merge-base --is-ancestor $ExpectedGithubHead $ObservedUpressHead 2>$null
	$expectedIsAncestorOfObserved = ($LASTEXITCODE -eq 0)
}

$classification = "UNKNOWN"
if ($githubMainHasExpected -and $observedIsAncestorOfExpected -and -not ($liveHasMenuFix -and $liveHasCssFix -and $liveMarkerCurrent)) {
	$classification = "UPRESS_LOG_BEHIND_GITHUB_AND_LIVE_THEME_STALE"
} elseif ($githubMainHasExpected -and -not $observedServerCommitKnownLocally -and -not ($liveHasMenuFix -and $liveHasCssFix -and $liveMarkerCurrent)) {
	$classification = "SERVER_GIT_CHAIN_NOT_IN_LOCAL_GITHUB_REMOTE"
} elseif ($githubMainHasExpected -and $expectedIsAncestorOfObserved -and -not ($liveHasMenuFix -and $liveHasCssFix -and $liveMarkerCurrent)) {
	$classification = "SERVER_GIT_AHEAD_OR_STALE_WORKTREE"
} elseif ($githubMainHasExpected -and $liveHasMenuFix -and $liveHasCssFix -and $liveMarkerCurrent) {
	$classification = "LIVE_MATCHES_EXPECTED"
}

$safeAction = "Do not force-push or upload files manually. uPress appears behind GitHub or the live theme path/cache is stale; verify uPress fetch/pull result and live document root before claiming deployment."
if ($classification -eq "LIVE_MATCHES_EXPECTED") {
	$safeAction = "No deployment action needed for the mobile menu marker. Live public theme files match the expected fix; proceed to browser QA and revenue-flow work."
}

$result = [ordered]@{
	checkedAt                       = (Get-Date).ToUniversalTime().ToString("o")
	observedUpressHead              = $ObservedUpressHead
	observedUpressSubject           = $ObservedUpressSubject
	expectedGithubHead              = $ExpectedGithubHead
	expectedMenuCommit              = $ExpectedMenuCommit
	expectedRuntimeMarker           = $ExpectedRuntimeMarker
	expectedCssToken                = $ExpectedCssToken
	githubMainHasExpected           = $githubMainHasExpected
	githubReleaseHasExpected        = $githubReleaseHasExpected
	localContainsExpectedGithubHead = $localContainsExpected
	localContainsObservedUpressHead = $observedServerCommitKnownLocally
	observedIsAncestorOfExpected    = $observedIsAncestorOfExpected
	expectedIsAncestorOfObserved    = $expectedIsAncestorOfObserved
	liveHasMenuFix                  = $liveHasMenuFix
	liveHasCssFix                   = $liveHasCssFix
	liveMarkerCurrent               = $liveMarkerCurrent
	classification                  = $classification
	safeAction                      = $safeAction
	remoteMain                     = $remoteMain.Trim()
	remoteRelease                  = $remoteRelease.Trim()
	liveMarkerBody                 = $markerBody.Trim()
	liveCssLength                  = $cssBody.Length
	note                           = "Read-only diagnostic. No CMS, files, redirects, SEO settings, payments, invoices, leads, or database state are changed."
}

$result | ConvertTo-Json -Depth 5

if ($classification -ne "LIVE_MATCHES_EXPECTED") {
	exit 1
}

exit 0
