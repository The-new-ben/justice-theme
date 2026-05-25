param(
	[switch] $OpenLaunchpad
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

$checks = @(
	'tools\check-live-lawyer-revenue-funnel.mjs',
	'tools\check-investor-demo-readiness.mjs',
	'tools\check-lawyer-signup-conversion-standard.mjs',
	'tools\check-first-paid-lawyer-sales-pack.mjs',
	'tools\check-payment-proof-drill.mjs',
	'tools\check-investor-launchpad-pack.mjs',
	'tools\check-investor-payment-overclaim.mjs',
	'tools\check-investor-morning-go-no-go.mjs'
)

Write-Host 'Jus-Tice investor morning pack refresh'
Write-Host "Repo: $repoRoot"
Write-Host ''

foreach ( $check in $checks ) {
	Write-Host "[RUN] $check"
	& node $check

	if ( $LASTEXITCODE -ne 0 ) {
		throw "Check failed: $check"
	}

	Write-Host ''
}

$today = Get-Date -Format 'yyyy-MM-dd'
$launchpad = Join-Path $repoRoot 'project-control\investor-demo-launchpad-2026-05-25.html'
$goNoGo = Join-Path $repoRoot "project-control\investor-morning-go-no-go-$today.md"

Write-Host 'Morning pack refreshed.'
Write-Host "Launchpad: $launchpad"
Write-Host "Go/no-go:  $goNoGo"
Write-Host ''
Write-Host 'Investor line: acquisition, onboarding, checkout fallback, dashboard, lead CRM and service requests are live; payment automation is provider-gated, with manual Grow/Morning payment link as the current bridge.'
Write-Host 'Sales line: first-cohort lawyer outreach pack is checked for prices, manual payment bridge, no-guarantee language, cadence and tracker before calls.'
Write-Host 'Payment line: one-time Grow payment-link proof is separated from recurring-debit approval, so the demo can stay honest.'

if ( $OpenLaunchpad ) {
	Start-Process $launchpad
	Start-Process $goNoGo
}
