param(
	[string] $BaseUrl = "https://jus-tice.co.il",
	[string] $ExpectedDeployMarker = "2026-05-28-lawyer-retention-followup-queue-v1",
	[string] $ExpectedThemeVersion = "1.1.81",
	[string] $ExpectedComponent = "primary-navigation__mobile-actions",
	[string] $ExpectedWhatsAppSurface = "mobile_menu",
	[string] $OldMarker = "2026-05-28-lawyer-retention-outcome-action-v1",
	[switch] $Strict
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Invoke-JsonChecker {
	param(
		[string] $Name,
		[string] $ScriptPath,
		[string[]] $Arguments = @(),
		[bool] $BlocksProfit = $true
	)

	$output = & powershell -NoProfile -ExecutionPolicy Bypass -File $ScriptPath @Arguments 2>&1
	$exitCode = $LASTEXITCODE
	$text = ($output | Out-String).Trim()
	$parsed = $null
	$parseError = $null

	try {
		if ($text.Length -gt 0) {
			$parsed = $text | ConvertFrom-Json
		}
	} catch {
		$parseError = $_.Exception.Message
	}

	$pass = $false

	if ($null -ne $parsed) {
		if ($null -ne $parsed.pass) {
			$pass = [bool] $parsed.pass
		} elseif ($null -ne $parsed.liveReady) {
			$pass = [bool] $parsed.liveReady
		} elseif ($exitCode -eq 0) {
			$pass = $true
		}
	} elseif ($exitCode -eq 0) {
		$pass = $true
	}

	return [ordered]@{
		name         = $Name
		script       = $ScriptPath
		exitCode     = $exitCode
		pass         = $pass
		blocksProfit = $BlocksProfit
		parseError   = $parseError
		rawOutput    = if ($parseError) { $text } else { $null }
		result       = $parsed
	}
}

$checks = @(
	(Invoke-JsonChecker `
		-Name "homepage_revenue_paths" `
		-ScriptPath (Join-Path $scriptRoot "check-homepage-revenue-paths.ps1") `
		-Arguments @("-BaseUrl", $BaseUrl) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "lead_intake_smoke" `
		-ScriptPath (Join-Path $scriptRoot "check-lead-intake-smoke.ps1") `
		-Arguments @("-BaseUrl", $BaseUrl) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "whatsapp_intake_router" `
		-ScriptPath (Join-Path $scriptRoot "check-whatsapp-intake-router.ps1") `
		-Arguments @("-BaseUrl", $BaseUrl) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "whatsapp_to_paid_lead_acceptance" `
		-ScriptPath (Join-Path $scriptRoot "check-whatsapp-to-paid-lead-acceptance.ps1") `
		-Arguments @("-Root", (Resolve-Path -LiteralPath (Join-Path $scriptRoot "..\..")).Path) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "lead_crm_operator_readiness" `
		-ScriptPath (Join-Path $scriptRoot "check-lead-crm-operator-readiness.ps1") `
		-Arguments @("-Root", (Resolve-Path -LiteralPath (Join-Path $scriptRoot "..\..")).Path) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "payment_proof_operator_readiness" `
		-ScriptPath (Join-Path $scriptRoot "check-payment-proof-operator-readiness.ps1") `
		-Arguments @("-Root", (Resolve-Path -LiteralPath (Join-Path $scriptRoot "..\..")).Path) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "first_paid_lawyer_manual_invoice_acceptance" `
		-ScriptPath (Join-Path $scriptRoot "check-first-paid-lawyer-manual-invoice-packet.ps1") `
		-Arguments @("-Root", (Resolve-Path -LiteralPath (Join-Path $scriptRoot "..\..")).Path) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "lawyer_money_path" `
		-ScriptPath (Join-Path $scriptRoot "check-lawyer-money-path.ps1") `
		-Arguments @("-BaseUrl", $BaseUrl) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "lawyer_plans_payment_proof_path" `
		-ScriptPath (Join-Path $scriptRoot "check-lawyer-plans-payment-proof-path.ps1") `
		-Arguments @("-BaseUrl", $BaseUrl) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "lawyer_registration_revenue_bridge" `
		-ScriptPath (Join-Path $scriptRoot "check-lawyer-registration-revenue-bridge.ps1") `
		-Arguments @("-BaseUrl", $BaseUrl) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "lawyer_dashboard_payment_proof_preview" `
		-ScriptPath (Join-Path $scriptRoot "check-lawyer-dashboard-payment-proof-preview.ps1") `
		-Arguments @("-BaseUrl", $BaseUrl) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "mobile_menu_source_stability" `
		-ScriptPath (Join-Path $scriptRoot "check-mobile-menu-stability.ps1") `
		-Arguments @("-Root", (Resolve-Path -LiteralPath (Join-Path $scriptRoot "..\..")).Path) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "mobile_menu_live_deploy_marker" `
		-ScriptPath (Join-Path $scriptRoot "check-live-deploy.ps1") `
		-Arguments @(
			"-ExpectedMarker", $ExpectedDeployMarker,
			"-ExpectedVersion", $ExpectedThemeVersion,
			"-ExpectedComponent", $ExpectedComponent,
			"-ExpectedWhatsAppSurface", $ExpectedWhatsAppSurface,
			"-OldMarker", $OldMarker
		) `
		-BlocksProfit $false),
	(Invoke-JsonChecker `
		-Name "live_route_matrix" `
		-ScriptPath (Join-Path $scriptRoot "check-live-route-matrix.ps1") `
		-Arguments @(
			"-BaseUrl", $BaseUrl,
			"-Root", (Resolve-Path -LiteralPath (Join-Path $scriptRoot "..\..")).Path
		) `
		-BlocksProfit $true),
	(Invoke-JsonChecker `
		-Name "live_link_hygiene_deploy_check" `
		-ScriptPath (Join-Path $scriptRoot "check-live-link-hygiene.ps1") `
		-Arguments @(
			"-BaseUrl", $BaseUrl,
			"-Root", (Resolve-Path -LiteralPath (Join-Path $scriptRoot "..\..")).Path
		) `
		-BlocksProfit $false)
)

$failedChecks = @($checks | Where-Object { -not $_.pass })
$profitBlockingFailures = @($failedChecks | Where-Object { $_.blocksProfit })
$deploymentBlockers = @($failedChecks | Where-Object { $_.name -like "*deploy*" -or $_.name -like "*marker*" -or $_.name -like "*hygiene*" })

$readiness = if ($profitBlockingFailures.Count -eq 0 -and $deploymentBlockers.Count -eq 0) {
	"ready_for_owner_payment_admin_test"
} elseif ($profitBlockingFailures.Count -eq 0) {
	"partial_live_funnel_deploy_blocked"
} else {
	"blocked_funnel_failure"
}

$knownBusinessBlockers = @(
	"Grow/Meshulam KYC/payment and real invoice proof are not verified by this read-only gate.",
	"This gate does not submit leads, create CRM records, create users, create WooCommerce orders, send invoices, verify payment evidence, or charge money."
)

if ($deploymentBlockers.Count -gt 0) {
	$knownBusinessBlockers += "Deployment remains blocked until the failed deployment checks pass after uPress Pull Git/cache clear."
}

$summary = [ordered]@{
	checkedAt               = (Get-Date).ToUniversalTime().ToString("o")
	baseUrl                 = $BaseUrl.TrimEnd("/")
	pass                    = $profitBlockingFailures.Count -eq 0
	readiness               = $readiness
	failedChecks            = $failedChecks
	profitBlockingFailures  = $profitBlockingFailures
	deploymentBlockers      = $deploymentBlockers
	knownBusinessBlockers   = $knownBusinessBlockers
	checks                  = $checks
	honestyStatement        = "This is a read-only production gate. Passing it proves public route and funnel surfaces exist; it does not prove real revenue, payment settlement, invoice issuance, CRM routing, or lawyer handoff."
}

$summary | ConvertTo-Json -Depth 12

if ($Strict -and ($failedChecks.Count -gt 0)) {
	exit 1
}

if ($profitBlockingFailures.Count -gt 0) {
	exit 1
}
