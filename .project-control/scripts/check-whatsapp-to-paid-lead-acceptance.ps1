param(
	[string] $Root = "."
)

$ErrorActionPreference = "Stop"

$rootPath = (Resolve-Path -LiteralPath $Root).Path
$mdPath = Join-Path $rootPath ".project-control\whatsapp-to-paid-lead-acceptance-test-2026-05-28.md"
$csvPath = Join-Path $rootPath ".project-control\whatsapp-to-paid-lead-acceptance-test-2026-05-28.csv"
$crmPath = Join-Path $rootPath "inc\lead-crm.php"
$whatsappCheckerPath = Join-Path $rootPath ".project-control\scripts\check-whatsapp-intake-router.ps1"
$crmCheckerPath = Join-Path $rootPath ".project-control\scripts\check-lead-crm-operator-readiness.ps1"

function Read-Text {
	param([string] $Path)

	if (-not (Test-Path -LiteralPath $Path)) {
		return ""
	}

	return Get-Content -LiteralPath $Path -Raw
}

function Test-ContainsAll {
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

$md = Read-Text -Path $mdPath
$csv = Read-Text -Path $csvPath
$crm = Read-Text -Path $crmPath

$checks = @(
	[ordered]@{
		name = "acceptance_markdown_present"
		pass = $md.Length -gt 0
		file = $mdPath
		detail = "WhatsApp-to-paid-lead acceptance markdown exists."
	},
	[ordered]@{
		name = "acceptance_csv_present"
		pass = $csv.Length -gt 0
		file = $csvPath
		detail = "WhatsApp-to-paid-lead acceptance CSV exists."
	},
	[ordered]@{
		name = "no_live_action_scope"
		pass = (Test-ContainsAll -Text $md -Tokens @(
			"NO_LIVE_MESSAGE_OR_CRM_ACTION",
			"does not click WhatsApp",
			"send messages",
			"create CRM records",
			"send invoices",
			"charge payments"
		))
		file = $mdPath
		detail = "Packet explicitly prevents live outreach, CRM, invoice, and payment claims."
	},
	[ordered]@{
		name = "operator_stage_chain"
		pass = (Test-ContainsAll -Text $md -Tokens @(
			"public WhatsApp intent",
			"owner manual CRM capture",
			"first attempt",
			"qualification",
			"ready_to_bill",
			"invoice_sent",
			"private payment evidence URL"
		))
		file = $mdPath
		detail = "Packet connects source, CRM capture, follow-up, qualification, billing, and paid proof."
	},
	[ordered]@{
		name = "csv_has_required_stages"
		pass = (Test-ContainsAll -Text $csv -Tokens @(
			"public_source",
			"consent",
			"first_attempt",
			"qualification",
			"lawyer_supplier_fit",
			"ready_to_bill",
			"invoice_sent",
			"paid"
		))
		file = $csvPath
		detail = "CSV contains runnable operator stages."
	},
	[ordered]@{
		name = "source_checkers_exist"
		pass = ((Test-Path -LiteralPath $whatsappCheckerPath) -and (Test-Path -LiteralPath $crmCheckerPath))
		file = $rootPath
		detail = "Underlying WhatsApp and CRM readiness checkers exist."
	},
	[ordered]@{
		name = "crm_manual_whatsapp_bridge_exists"
		pass = (Test-ContainsAll -Text $crm -Tokens @(
			"justice_theme_crm_render_whatsapp_lead_bridge",
			"justice_theme_create_whatsapp_lead",
			"source_channel",
			"consent_status",
			"suggested_lead_price_ils",
			"owner_handoff_release_status",
			"qualified_lead_billing_status",
			"qualified_lead_payment_evidence_url"
		))
		file = $crmPath
		detail = "CRM source supports manual WhatsApp capture, consent, owner release, billing status, and payment proof."
	}
)

$failed = @($checks | Where-Object { -not $_.pass })

$summary = [ordered]@{
	checkedAt = (Get-Date).ToUniversalTime().ToString("o")
	root = $rootPath
	pass = $failed.Count -eq 0
	failed = $failed
	checks = $checks
	readinessImpact = "WhatsApp-to-paid-lead flow is now acceptance-testable without creating a live message, CRM record, invoice, or payment."
	blockers = @(
		"No real WhatsApp inquiry, consent, CRM record, lawyer/supplier terms, invoice, or payment proof was created or verified by this checker.",
		"Paid status still requires private payment evidence URL.",
		"Grow/Meshulam payment proof remains blocked until owner/provider evidence exists."
	)
	note = "Repo-local operator acceptance gate only. It does not click WhatsApp, create leads, contact anyone, send invoices, change CMS, change payments, or deploy."
}

$summary | ConvertTo-Json -Depth 8

if (-not $summary.pass) {
	exit 1
}
