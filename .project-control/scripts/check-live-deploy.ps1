param(
	[string] $Url = 'https://jus-tice.co.il/',
	[string] $ExpectedMarker = '2026-05-28-lawyer-retention-followup-queue-v1',
	[string] $ExpectedVersion = '1.1.81',
	[string] $ExpectedComponent = 'primary-navigation__mobile-actions',
	[string] $ExpectedWhatsAppSurface = 'mobile_menu',
	[string] $OldMarker = '2026-05-28-lawyer-retention-outcome-action-v1'
)

$cacheBust = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$separator = if ($Url.Contains('?')) { '&' } else { '?' }
$checkUrl = "$Url${separator}cachebust=deploy-check-$cacheBust"

try {
	$response = Invoke-WebRequest -UseBasicParsing -Uri $checkUrl
	$html = [string] $response.Content
	$result = [ordered]@{
		checkedAt = (Get-Date).ToUniversalTime().ToString('o')
		url = $checkUrl
		status = [int] $response.StatusCode
		expectedMarker = $ExpectedMarker
		markerPresent = $html.Contains($ExpectedMarker)
		expectedVersion = $ExpectedVersion
		versionPresent = $html.Contains($ExpectedVersion)
		expectedComponent = $ExpectedComponent
		componentPresent = $html.Contains($ExpectedComponent)
		expectedWhatsAppSurface = $ExpectedWhatsAppSurface
		whatsAppSurfacePresent = $html.Contains($ExpectedWhatsAppSurface)
		oldMarker = $OldMarker
		oldMarkerPresent = $html.Contains($OldMarker)
		liveReady = $false
	}

	$result.liveReady = (
		$result.status -eq 200 -and
		$result.markerPresent -and
		$result.versionPresent -and
		$result.componentPresent -and
		$result.whatsAppSurfacePresent -and
		-not $result.oldMarkerPresent
	)

	$result | ConvertTo-Json -Depth 4

	if (-not $result.liveReady) {
		exit 1
	}
} catch {
	[ordered]@{
		checkedAt = (Get-Date).ToUniversalTime().ToString('o')
		url = $checkUrl
		error = $_.Exception.Message
		liveReady = $false
	} | ConvertTo-Json -Depth 4
	exit 2
}
