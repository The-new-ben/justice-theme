param(
	[string] $Root = "."
)

$ErrorActionPreference = "Stop"

function Add-Check {
	param(
		[System.Collections.ArrayList] $Checks,
		[string] $Name,
		[bool] $Pass,
		[string] $Detail,
		[string] $File = ""
	)

	[void] $Checks.Add([ordered]@{
		name   = $Name
		pass   = $Pass
		detail = $Detail
		file   = $File
	})
}

function Read-FileText {
	param(
		[string] $Path
	)

	if (-not (Test-Path -LiteralPath $Path)) {
		return ""
	}

	return Get-Content -LiteralPath $Path -Raw
}

function Contains-All {
	param(
		[string] $Text,
		[string[]] $Tokens
	)

	foreach ($token in $Tokens) {
		if (-not $Text.Contains($token)) {
			return $false
		}
	}

	return $true
}

$rootPath = (Resolve-Path -LiteralPath $Root).Path
$files = [ordered]@{
	navigation = Join-Path $rootPath "assets\js\navigation.js"
	premiumCss = Join-Path $rootPath "assets\css\premium-pass-4.css"
	header     = Join-Path $rootPath "template-parts\layout\site-header.php"
	functions  = Join-Path $rootPath "functions.php"
	enqueue    = Join-Path $rootPath "inc\enqueue.php"
}

$texts = [ordered]@{}
foreach ($key in $files.Keys) {
	$texts[$key] = Read-FileText -Path $files[$key]
}

$checks = New-Object System.Collections.ArrayList

foreach ($key in $files.Keys) {
	Add-Check $checks "file_present_$key" ($texts[$key].Length -gt 0) "Required mobile-menu source file exists." $files[$key]
}

Add-Check $checks "no_dynamic_toggle_positioning_js" ($texts.navigation -notmatch "getBoundingClientRect|--jt-menu-toggle|setProperty\(\s*['""]--jt-menu-toggle|removeProperty\(\s*['""]--jt-menu-toggle") "Navigation JS must not measure or write dynamic hamburger-position variables." $files.navigation

Add-Check $checks "no_dynamic_toggle_positioning_css" ($texts.premiumCss -notmatch "--jt-menu-toggle|var\(\s*--jt-menu-toggle") "Mobile menu CSS must not depend on dynamic hamburger-position variables." $files.premiumCss

Add-Check $checks "stable_mobile_close_target_css" (Contains-All -Text $texts.premiumCss -Tokens @(
	"body.nav-is-open .menu-toggle",
	"position: fixed",
	"top: max(0.75rem, env(safe-area-inset-top))",
	"inset-inline-end: max(1rem, env(safe-area-inset-right))",
	"width: 44px",
	"height: 44px",
	"content: ""\00d7"""
)) "Open mobile menu must keep a stable 44px close button with safe-area-aware placement." $files.premiumCss

Add-Check $checks "base_toggle_touch_target_css" (Contains-All -Text $texts.premiumCss -Tokens @(
	".menu-toggle",
	"flex: 0 0 44px",
	"width: 44px",
	"height: 44px",
	"border-radius: 999px"
)) "Closed hamburger button must keep a stable 44px touch target." $files.premiumCss

Add-Check $checks "responsive_mobile_query_runtime" (Contains-All -Text $texts.navigation -Tokens @(
	"window.matchMedia( '(max-width: 1220px)' )",
	"mobileQuery.matches",
	"mobileQuery.addEventListener( 'change'"
)) "Navigation JS must use a responsive media query and update state when viewport mode changes." $files.navigation

Add-Check $checks "no_one_time_inner_width_gate" ($texts.navigation -notmatch "window\.innerWidth\s*<=\s*1220") "Submenu logic must not be bound to a one-time page-load width check." $files.navigation

Add-Check $checks "desktop_accessibility_preserved" (Contains-All -Text $texts.navigation -Tokens @(
	"nav.setAttribute( 'aria-hidden'",
	"nav.removeAttribute( 'aria-hidden' )"
)) "Desktop navigation must not remain aria-hidden after crossing out of mobile layout." $files.navigation

Add-Check $checks "menu_closes_on_real_link" (Contains-All -Text $texts.navigation -Tokens @(
	"closest( 'a[href]' )",
	"link.getAttribute( 'href' ) !== '#'",
	"setMenuOpen( false )"
)) "Mobile menu should close after the visitor taps a real navigation link." $files.navigation

Add-Check $checks "mobile_revenue_actions_present" (Contains-All -Text $texts.header -Tokens @(
	"primary-navigation__mobile-actions",
	"primary-navigation__mobile-action--whatsapp",
	"data-whatsapp-surface=""mobile_menu""",
	"data-lead-utm-source=""mobile_menu""",
	"home_url( '/lawyer-plans/' )"
)) "Mobile menu must expose WhatsApp, phone, and lawyer-plan revenue actions." $files.header

Add-Check $checks "deploy_marker_current" (Contains-All -Text $texts.functions -Tokens @(
	"1.1.71",
	"2026-05-28-lawyer-plans-payment-proof-v1"
)) "Theme version and deployment marker must point to the current lawyer-plans payment-proof release." $files.functions

Add-Check $checks "premium_css_cache_bumped" ($texts.enqueue.Contains("'4.5.7'")) "Premium stylesheet cache version must be bumped for deployment." $files.enqueue

$failed = @($checks | Where-Object { -not $_.pass })

$summary = [ordered]@{
	checkedAt = (Get-Date).ToUniversalTime().ToString("o")
	root      = $rootPath
	pass      = $failed.Count -eq 0
	failed    = $failed
	checks    = $checks
	standard  = [ordered]@{
		stableToggle     = "Mobile open/close target must be CSS-stable, 44px minimum, and safe-area-aware."
		noDynamicMeasure = "Do not measure hamburger position with getBoundingClientRect or write CSS variables for fixed placement."
		accessibility    = "aria-hidden may hide the off-canvas mobile panel, but desktop navigation must remain exposed."
		revenueActions   = "Mobile menu must keep WhatsApp, phone, and lawyer-plan actions reachable."
	}
	note      = "Repo-local source gate only. It does not open a browser, change WordPress content, deploy uPress, submit leads, send WhatsApp messages, create CRM records, or charge money."
}

$summary | ConvertTo-Json -Depth 10

if (-not $summary.pass) {
	exit 1
}
