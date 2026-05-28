param(
	[string] $ObservedUpressHead = "ce695fc9",
	[string] $ObservedUpressSubject = "Record mobile menu stable in place deployment",
	[string] $ExpectedGithubHead = "962ca7da",
	[string] $ExpectedMenuCommit = "bc78bf69",
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
$markerBody = Get-TextOrEmpty -Url $markerUrl
$navigationBody = Get-TextOrEmpty -Url $navigationUrl

$githubMainHasExpected = $remoteMain.Contains($ExpectedGithubHead)
$githubReleaseHasExpected = $remoteRelease.Contains($ExpectedGithubHead)
$liveHasMenuFix = $navigationBody.Contains("lockPageScroll")
$liveMarkerCurrent = $markerBody.Contains("mobile-menu-stable-fixed-drawer-v2")
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
if ($githubMainHasExpected -and $observedIsAncestorOfExpected -and -not $liveHasMenuFix) {
	$classification = "UPRESS_LOG_BEHIND_GITHUB_AND_LIVE_THEME_STALE"
} elseif ($githubMainHasExpected -and -not $observedServerCommitKnownLocally -and -not $liveHasMenuFix) {
	$classification = "SERVER_GIT_CHAIN_NOT_IN_LOCAL_GITHUB_REMOTE"
} elseif ($githubMainHasExpected -and $expectedIsAncestorOfObserved -and -not $liveHasMenuFix) {
	$classification = "SERVER_GIT_AHEAD_OR_STALE_WORKTREE"
} elseif ($githubMainHasExpected -and $liveHasMenuFix -and $liveMarkerCurrent) {
	$classification = "LIVE_MATCHES_EXPECTED"
}

$result = [ordered]@{
	checkedAt                       = (Get-Date).ToUniversalTime().ToString("o")
	observedUpressHead              = $ObservedUpressHead
	observedUpressSubject           = $ObservedUpressSubject
	expectedGithubHead              = $ExpectedGithubHead
	expectedMenuCommit              = $ExpectedMenuCommit
	githubMainHasExpected           = $githubMainHasExpected
	githubReleaseHasExpected        = $githubReleaseHasExpected
	localContainsExpectedGithubHead = $localContainsExpected
	localContainsObservedUpressHead = $observedServerCommitKnownLocally
	observedIsAncestorOfExpected    = $observedIsAncestorOfExpected
	expectedIsAncestorOfObserved    = $expectedIsAncestorOfObserved
	liveHasMenuFix                  = $liveHasMenuFix
	liveMarkerCurrent               = $liveMarkerCurrent
	classification                  = $classification
	safeAction                      = "Do not force-push or upload files manually. uPress appears behind GitHub or the live theme path/cache is stale; verify uPress fetch/pull result and live document root before claiming deployment."
	remoteMain                     = $remoteMain.Trim()
	remoteRelease                  = $remoteRelease.Trim()
	liveMarkerBody                 = $markerBody.Trim()
	note                           = "Read-only diagnostic. No CMS, files, redirects, SEO settings, payments, invoices, leads, or database state are changed."
}

$result | ConvertTo-Json -Depth 5

if ($classification -ne "LIVE_MATCHES_EXPECTED") {
	exit 1
}
