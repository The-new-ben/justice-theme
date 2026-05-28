param(
	[string] $Root = "."
)

$ErrorActionPreference = "Stop"

$rootPath = (Resolve-Path -LiteralPath $Root).Path
$mdPath = Join-Path $rootPath ".project-control\first-paid-lawyer-manual-invoice-acceptance-test-2026-05-28.md"
$csvPath = Join-Path $rootPath ".project-control\first-paid-lawyer-manual-invoice-acceptance-test-2026-05-28.csv"

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

$checks = @(
	[ordered]@{
		name = "manual_invoice_acceptance_markdown_present"
		pass = $md.Length -gt 0
		file = $mdPath
		detail = "Acceptance test markdown exists."
	},
	[ordered]@{
		name = "manual_invoice_acceptance_csv_present"
		pass = $csv.Length -gt 0
		file = $csvPath
		detail = "Acceptance test CSV exists."
	},
	[ordered]@{
		name = "no_live_payment_scope"
		pass = (Test-ContainsAll -Text $md -Tokens @(
			"NO_LIVE_PAYMENT_ACTION",
			"does not create or edit public CMS/database content",
			"gateway settings",
			"invoices",
			"payments",
			"No WhatsApp/email/customer/lawyer outreach sent"
		))
		file = $mdPath
		detail = "Packet explicitly prevents live payment, invoice, CMS, outreach, and gateway claims."
	},
	[ordered]@{
		name = "accepted_terms_and_billing_contact_gate"
		pass = (Test-ContainsAll -Text $md -Tokens @(
			"accepted_terms",
			"billing_contact",
			"manual_invoice_request",
			"Owner action required"
		))
		file = $mdPath
		detail = "Payment request is blocked until terms and billing contact are known."
	},
	[ordered]@{
		name = "crm_status_transition_guard"
		pass = (Test-ContainsAll -Text $md -Tokens @(
			"crm_status_ready_to_bill",
			"crm_status_invoice_sent",
			"crm_status_paid",
			"private_payment_evidence_url",
			"do_not_mark_paid_without_evidence"
		))
		file = $mdPath
		detail = "Ready-to-bill, invoice-sent, and paid statuses are separated."
	},
	[ordered]@{
		name = "csv_has_operator_rows"
		pass = (Test-ContainsAll -Text $csv -Tokens @(
			"controlled_lawyer",
			"accepted_terms",
			"billing_contact",
			"manual_invoice_request",
			"crm_status_invoice_sent",
			"crm_status_paid",
			"payment_followup_due"
		))
		file = $csvPath
		detail = "CSV contains runnable operator stages."
	}
)

$failed = @($checks | Where-Object { -not $_.pass })

$summary = [ordered]@{
	checkedAt = (Get-Date).ToUniversalTime().ToString("o")
	root = $rootPath
	pass = $failed.Count -eq 0
	failed = $failed
	checks = $checks
	readinessImpact = "Manual invoice fallback is now acceptance-testable for one controlled first paid lawyer, but no real payment, invoice, CRM update, or outreach occurred."
	blockers = @(
		"Grow/Meshulam real payment, receipt, invoice, recurring debit, and settlement proof are not verified.",
		"Owner/operator must approve a controlled lawyer and send any real invoice/payment request.",
		"Paid status still requires private payment evidence URL."
	)
	note = "Repo-local operator acceptance gate only. It does not create leads, invoices, payments, lawyer records, WhatsApp/email messages, CMS changes, gateway changes, or deployment."
}

$summary | ConvertTo-Json -Depth 8

if (-not $summary.pass) {
	exit 1
}
