param(
	[string] $BaseUrl = "https://jus-tice.co.il",
	[string] $ExpectedDeployMarker = "2026-05-28-homepage-status-path-v1",
	[string] $ExpectedThemeVersion = "1.1.70",
	[string] $Root = ".",
	[string] $OutputDir = "output\playwright"
)

$ErrorActionPreference = "Stop"

function Add-Check {
	param(
		[System.Collections.ArrayList] $Checks,
		[string] $Name,
		[bool] $Pass,
		[string] $Detail
	)

	[void] $Checks.Add([ordered]@{
		name   = $Name
		pass   = $Pass
		detail = $Detail
	})
}

function Invoke-PlaywrightCli {
	param(
		[string] $Session,
		[string[]] $Arguments
	)

	$output = & npx --yes --package "@playwright/cli" playwright-cli --session $Session @Arguments --json 2>&1
	$exitCode = $LASTEXITCODE
	$text = ($output | Out-String).Trim()

	return [ordered]@{
		exitCode = $exitCode
		text     = $text
		json     = if ($text) {
			try { $text | ConvertFrom-Json } catch { $null }
		} else {
			$null
		}
	}
}

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
	[ordered]@{
		checkedAt = (Get-Date).ToUniversalTime().ToString("o")
		pass      = $false
		error     = "npx is required to run @playwright/cli."
		note      = "Read-only live browser QA. It does not change CMS content, menus, redirects, leads, CRM records, WhatsApp messages, payments, invoices, or uPress settings."
	} | ConvertTo-Json -Depth 6
	exit 2
}

$rootPath = (Resolve-Path -LiteralPath $Root).Path
$outputPath = Join-Path $rootPath $OutputDir
New-Item -ItemType Directory -Force -Path $outputPath | Out-Null

$cacheBust = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$base = $BaseUrl.TrimEnd("/")
$url = "$base/?cachebust=mobile-menu-browser-qa-$cacheBust"
$session = "justice-mobile-menu-live-$cacheBust"
$screenshotPath = Join-Path $outputPath "live-mobile-menu-open-$cacheBust.png"
$tempScript = New-TemporaryFile

$config = [ordered]@{
	expectedDeployMarker = $ExpectedDeployMarker
	expectedThemeVersion = $ExpectedThemeVersion
	screenshotPath       = $screenshotPath
}
$configJson = $config | ConvertTo-Json -Compress

Set-Content -LiteralPath $tempScript -Encoding UTF8 -Value @"
async page => {
	const config = $configJson;
	await page.waitForLoadState('domcontentloaded');
	await page.waitForTimeout(250);

	const toggle = page.locator('.menu-toggle').first();
	const nav = page.locator('.primary-navigation').first();
	const beforeBox = await toggle.boundingBox();
	const initialExpanded = await toggle.getAttribute('aria-expanded');

	await toggle.click();
	await page.waitForTimeout(300);

	const afterBox = await toggle.boundingBox();
	const expanded = await toggle.getAttribute('aria-expanded');
	const navVisible = await nav.isVisible();
	const navAriaHidden = await nav.getAttribute('aria-hidden');
	const mobileActionsVisible = await page.locator('.primary-navigation__mobile-actions').first().isVisible();
	const whatsappCount = await page.locator('[data-whatsapp-surface="mobile_menu"]').count();
	const lawyerPlanCount = await page.locator('.primary-navigation__mobile-action--lawyer').count();
	const primaryHrefs = await page.locator('.primary-navigation a[href]').evaluateAll(links => links.map(link => link.href));
	const hasLegacyPageId = primaryHrefs.some(href => href.includes('page_id='));
	const html = await page.content();
	const viewport = page.viewportSize();

	await page.screenshot({ path: config.screenshotPath, fullPage: false });

	const closeButtonIsTouchSized = Boolean(afterBox && afterBox.width >= 42 && afterBox.height >= 42);
	const closeButtonIsInViewport = Boolean(
		afterBox &&
		viewport &&
		afterBox.x >= 0 &&
		afterBox.y >= 0 &&
		(afterBox.x + afterBox.width) <= viewport.width &&
		(afterBox.y + afterBox.height) <= viewport.height
	);
	const closeButtonTopStable = Boolean(afterBox && afterBox.y <= 96);

	return {
		url: page.url(),
		title: await page.title(),
		viewport,
		initialExpanded,
		expanded,
		navVisible,
		navAriaHidden,
		mobileActionsVisible,
		whatsappCount,
		lawyerPlanCount,
		hasLegacyPageId,
		markerPresent: html.includes(config.expectedDeployMarker),
		versionPresent: html.includes(config.expectedThemeVersion),
		beforeBox,
		afterBox,
		closeButtonIsTouchSized,
		closeButtonIsInViewport,
		closeButtonTopStable,
		screenshotPath: config.screenshotPath
	};
}
"@

$checks = New-Object System.Collections.ArrayList
$browserResult = $null
$rawRun = $null

try {
	$open = Invoke-PlaywrightCli -Session $session -Arguments @("open", $url)
	Add-Check $checks "browser_opened" ($open.exitCode -eq 0) "Opened live homepage in an anonymous Playwright browser session."

	$resize = Invoke-PlaywrightCli -Session $session -Arguments @("resize", "390", "844")
	Add-Check $checks "mobile_viewport_set" ($resize.exitCode -eq 0) "Set browser viewport to 390x844 for mobile menu QA."

	$run = Invoke-PlaywrightCli -Session $session -Arguments @("run-code", "--filename", $tempScript.FullName)
	$rawRun = $run.text

	if ($run.exitCode -eq 0 -and $null -ne $run.json -and $run.json.result) {
		$browserResult = $run.json.result | ConvertFrom-Json
	}

	Add-Check $checks "browser_script_completed" ($null -ne $browserResult) "Executed mobile menu click QA script."

	if ($null -ne $browserResult) {
		Add-Check $checks "live_marker_present" ([bool] $browserResult.markerPresent) "Live page should expose deployment marker $ExpectedDeployMarker."
		Add-Check $checks "live_version_present" ([bool] $browserResult.versionPresent) "Live page should expose theme version $ExpectedThemeVersion."
		Add-Check $checks "menu_expands" ($browserResult.expanded -eq "true") "Hamburger click should set aria-expanded=true."
		Add-Check $checks "nav_panel_visible" ([bool] $browserResult.navVisible) "Primary navigation panel should be visible after opening."
		Add-Check $checks "mobile_actions_visible" ([bool] $browserResult.mobileActionsVisible) "Mobile menu revenue actions should be visible after opening."
		Add-Check $checks "mobile_whatsapp_visible" ([int] $browserResult.whatsappCount -gt 0) "Mobile menu should expose a WhatsApp lead action."
		Add-Check $checks "lawyer_plan_action_visible" ([int] $browserResult.lawyerPlanCount -gt 0) "Mobile menu should expose a lawyer-plan action."
		Add-Check $checks "no_legacy_page_id_in_menu" (-not [bool] $browserResult.hasLegacyPageId) "Primary navigation should not expose legacy page_id links."
		Add-Check $checks "close_button_touch_sized" ([bool] $browserResult.closeButtonIsTouchSized) "Close button should remain at least 42px wide and high."
		Add-Check $checks "close_button_in_viewport" ([bool] $browserResult.closeButtonIsInViewport) "Close button should remain inside the mobile viewport."
		Add-Check $checks "close_button_top_stable" ([bool] $browserResult.closeButtonTopStable) "Close button should remain near the top after menu opens."
		Add-Check $checks "screenshot_created" (Test-Path -LiteralPath $screenshotPath) "Open mobile menu screenshot should be saved for visual evidence."
	}
} finally {
	Invoke-PlaywrightCli -Session $session -Arguments @("close") | Out-Null
	Remove-Item -LiteralPath $tempScript -Force -ErrorAction SilentlyContinue
}

$failed = @($checks | Where-Object { -not $_.pass })

$summary = [ordered]@{
	checkedAt       = (Get-Date).ToUniversalTime().ToString("o")
	baseUrl         = $base
	checkedUrl      = $url
	pass            = $failed.Count -eq 0
	failed          = $failed
	checks          = $checks
	browserResult   = $browserResult
	rawRun          = if ($browserResult) { $null } else { $rawRun }
	standard        = [ordered]@{
		deploymentMarker = "Live mobile QA is valid only after the expected theme marker/version are present."
		menuFunction     = "Tap hamburger, verify panel and mobile revenue actions are visible."
		linkHygiene      = "Primary navigation should use canonical links, not page_id URLs."
		visualEvidence   = "Save an open-menu screenshot under output/playwright for review."
	}
	note            = "Read-only live browser QA. It does not change CMS content, menus, redirects, canonicals, noindex, sitemaps, leads, CRM records, WhatsApp messages, payments, invoices, or uPress settings."
}

$summary | ConvertTo-Json -Depth 12

if (-not $summary.pass) {
	exit 1
}
