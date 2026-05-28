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
	paymentCompliance     = Join-Path $rootPath "inc\payment-compliance-routes.php"
	crm                   = Join-Path $rootPath "inc\lead-crm.php"
	lawyerOnboarding      = Join-Path $rootPath "inc\lawyer-onboarding.php"
	lawyerDashboard       = Join-Path $rootPath "page-lawyer-dashboard.php"
	lawyerDashboardLogic  = Join-Path $rootPath "inc\lawyer-dashboard.php"
	paymentProofTool      = Join-Path $rootPath "tools\check-payment-proof-drill.mjs"
	growComplianceTool    = Join-Path $rootPath "tools\check-grow-payment-compliance.mjs"
	oneTimeGrowEvidence   = Join-Path $rootPath ".project-control\grow-real-payment-link-smoke-test-2026-05-24.md"
	recurringGrowEvidence = Join-Path $rootPath ".project-control\grow-recurring-debit-live-attempt-2026-05-24.md"
	growComplianceReport  = Join-Path $rootPath ".project-control\grow-payment-compliance-live-2026-05-27.md"
	paymentProofReport    = Join-Path $rootPath ".project-control\payment-proof-drill-2026-05-25.md"
	manualFallbackReport  = Join-Path $rootPath ".project-control\manual-invoice-revenue-fallback-packet-2026-05-27.md"
}

$texts = [ordered]@{}
foreach ($key in $files.Keys) {
	$texts[$key] = Read-FileText -Path $files[$key]
}

$checks = New-Object System.Collections.ArrayList

foreach ($key in $files.Keys) {
	Add-Check $checks "file_present_$key" ($texts[$key].Length -gt 0) "Required source or evidence file exists." $files[$key]
}

Add-Check $checks "checkout_manual_invoice_fallback" (Contains-All -Text $texts.paymentCompliance -Tokens @(
	"plan_interest",
	"pre_checkout",
	"payment_path",
	"manual_invoice",
	"/lawyer-registration/",
	"/sample-terms-and-conditions-template/",
	"/cancellation/",
	"/privacy/"
)) "Checkout fallback preserves lawyer plan intent, manual-invoice path, registration continuation, and legal-policy links." $files.paymentCompliance

Add-Check $checks "checkout_woocommerce_compliance_consent" (Contains-All -Text $texts.paymentCompliance -Tokens @(
	"justice_theme_render_checkout_compliance_notice",
	"woocommerce_before_checkout_form",
	"woocommerce_checkout_create_order",
	"justice_visible_terms_approval",
	"_justice_checkout_terms_approved_at",
	"_justice_checkout_cancellation_url",
	"_justice_checkout_privacy_url"
)) "WooCommerce checkout has visible terms approval and order-level policy evidence fields." $files.paymentCompliance

Add-Check $checks "lawyer_onboarding_payment_queue" (Contains-All -Text $texts.lawyerOnboarding -Tokens @(
	"payment_followup_status",
	"invoice_requested",
	"invoice_sent",
	"payment_confirmed",
	"manual_payment_link_url",
	"manual_invoice_reference",
	"manual_payment_evidence_url",
	"payment_followup_due_at",
	"justice_theme_lawyer_has_manual_payment_evidence",
	"justice_theme_set_lawyer_payment_followup_status"
)) "Lawyer onboarding can hold manual invoice/payment-link queues with timestamps and references." $files.lawyerOnboarding

Add-Check $checks "lawyer_onboarding_payment_exports" (Contains-All -Text $texts.lawyerOnboarding -Tokens @(
	"Export invoice queue CSV",
	"Export sent invoices CSV",
	"Open invoice-requested queue",
	"payment_queue",
	"payment_followup_status",
	"manual_payment_link_url",
	"manual_invoice_reference",
	"manual_payment_evidence_url"
)) "Owner/admin has payment queues and exports for invoice-requested and invoice-sent stages." $files.lawyerOnboarding

Add-Check $checks "lawyer_onboarding_paid_evidence_guard" (Contains-All -Text $texts.lawyerOnboarding -Tokens @(
	"manual_payment_evidence_url",
	"Payment confirmed was blocked because manual_payment_evidence_url is missing",
	"Paid action blocked until a private payment evidence URL is saved",
	"Legacy paid status is not revenue proof until payment evidence URL is saved",
	"justice_theme_lawyer_has_manual_payment_evidence",
	"Payment proof recorded"
)) "Lawyer onboarding prevents paid-status claims and paid quick actions unless private payment evidence exists." $files.lawyerOnboarding

Add-Check $checks "lawyer_onboarding_owner_payment_test_drill" (Contains-All -Text $texts.lawyerOnboarding -Tokens @(
	"owner_payment_test_drill",
	"Owner payment test drill",
	"No payment proof, no paid status",
	"manual_payment_evidence_url",
	"Open payment-proof-required queue",
	"Export sent invoices CSV",
	"This drill is admin guidance only"
)) "Lawyer onboarding exposes an admin-only owner test drill for the first real paid-lawyer run." $files.lawyerOnboarding

Add-Check $checks "lawyer_onboarding_paid_first_value_queue" (Contains-All -Text $texts.lawyerOnboarding -Tokens @(
	"justice_theme_lawyer_onboarding_paid_needs_first_value_meta_query",
	"paid_needs_first_value",
	"Paid, first value missing",
	"Open first-value queue",
	"Deliver first value to paid lawyers",
	"Paid: deliver first value before repeating this source",
	"first useful service outcome"
)) "Lawyer onboarding exposes a paid-but-first-value-missing queue before repeating paid acquisition." $files.lawyerOnboarding

Add-Check $checks "lawyer_onboarding_first_value_delivery_action" (Contains-All -Text $texts.lawyerOnboarding -Tokens @(
	"justice_theme_lawyer_first_value_quick_action_url",
	"justice_mark_lawyer_first_value_delivered",
	"Mark first value delivered",
	"payment_confirmed and manual_payment_evidence_url are required first",
	"paid_first_value_admin_action",
	"lead handoff, profile activation or useful service outcome"
)) "Lawyer onboarding lets the owner close the paid-first-value queue only after private payment proof exists." $files.lawyerOnboarding

Add-Check $checks "lawyer_onboarding_first_value_evidence_guard" (Contains-All -Text $texts.lawyerOnboarding -Tokens @(
	"justice_theme_lawyer_has_first_value_evidence",
	"first_value_evidence_url",
	"first_value_outcome_note",
	"proof_missing",
	"First-value action blocked until an outcome note or private proof URL is saved",
	"first-value evidence URL or outcome note is required"
)) "Lawyer onboarding prevents first-value closure unless an owner-only outcome note or private proof URL exists." $files.lawyerOnboarding

Add-Check $checks "lawyer_dashboard_payment_context" (Contains-All -Text $texts.lawyerDashboard -Tokens @(
	"manual_payment_link_url",
	"manual_invoice_reference",
	"payment_followup_status",
	"invoice_requested",
	"invoice_sent",
	"payment_confirmed",
	"payment_path",
	"manual_invoice",
	"service_request_message"
)) "Lawyer dashboard exposes manual payment/invoice status and service-request context to the logged-in lawyer." $files.lawyerDashboard

Add-Check $checks "lawyer_dashboard_service_request_handlers" (Contains-All -Text $texts.lawyerDashboardLogic -Tokens @(
	"refund",
	"cancel",
	"downgrade",
	"invoice",
	"complaint",
	"service_request",
	"justice_theme_handle_lawyer_service_request"
)) "Dashboard handler stores billing, invoice, refund, cancellation, downgrade, and complaint requests for owner review." $files.lawyerDashboardLogic

Add-Check $checks "crm_qualified_lead_billing_queue" (Contains-All -Text $texts.crm -Tokens @(
	"qualified_lead_billing_status",
	"ready_to_bill",
	"invoice_sent",
	"paid",
	"qualified_lead_invoice_reference",
	"qualified_lead_payment_evidence_url",
	"qualified_lead_billed_at",
	"qualified_lead_paid_at",
	"justice_theme_crm_render_qualified_lead_billing_queue",
	"justice_theme_crm_qualified_lead_invoice_packet"
)) "CRM has a qualified-lead billing queue, invoice packet, status fields, and timestamps." $files.crm

Add-Check $checks "crm_paid_status_evidence_guard" (Contains-All -Text $texts.crm -Tokens @(
	"'paid' === `$billing_status && '' === `$payment_evidence_url",
	"`$billing_status = '' === `$invoice_reference ? 'ready_to_bill' : 'invoice_sent';",
	"Payment status was not marked Paid because Paid requires a payment evidence URL",
	"justice_theme_crm_lead_has_payment_evidence",
	"payment_proof_missing",
	"Invoice/reference alone can support Invoice sent, not paid revenue"
)) "CRM prevents paid-status claims unless private payment evidence exists; invoice/reference alone stays invoice-stage evidence." $files.crm

Add-Check $checks "crm_manual_invoice_bridge_panel" (Contains-All -Text $texts.crm -Tokens @(
	"justice_theme_crm_render_manual_invoice_bridge_panel",
	"Manual invoice bridge while Grow/Meshulam is blocked",
	"Open invoice queue",
	"Open link-needed queue",
	"Open ready links",
	"Open plan payments",
	"Grow/Meshulam online checkout is still provider-gated"
)) "Owner CRM includes a manual invoice bridge that keeps provider-gated checkout separate from real payment proof." $files.crm

Add-Check $checks "one_time_grow_link_evidence_preserved" (Contains-All -Text $texts.oneTimeGrowEvidence -Tokens @(
	"Payment Link created in Grow dashboard",
	"Link sent to owner by Gmail",
	"Provider payment page opens",
	"Receipt/invoice visible after payment | NOT YET",
	"No public WordPress CMS/database content"
)) "Historical evidence says a one-time Grow link exists, but receipt/invoice proof is still not complete." $files.oneTimeGrowEvidence

Add-Check $checks "recurring_grow_blocker_preserved" (Contains-All -Text $texts.recurringGrowEvidence -Tokens @(
	"Grow did not create the recurring setup link",
	"recurring billing is the next provider enablement step",
	"No recurring agreement was created",
	"No money moved",
	"Pay the existing",
	"one-time Grow link and verify transaction/receipt"
)) "Recurring billing remains provider-blocked; the evidence file does not claim recurring revenue readiness." $files.recurringGrowEvidence

Add-Check $checks "grow_live_compliance_report" (Contains-All -Text $texts.growComplianceReport -Tokens @(
	"Status: PASS",
	"Checkout exposes Grow-required customer fields",
	"Checkout exposes terms checkbox and terms link",
	"Terms page remains available",
	"Cancellation and supply policy remains available",
	"Privacy policy remains available",
	"no CMS record, payment, invoice, product"
)) "Latest Grow compliance report proves public policy/checkout readiness only, not money movement." $files.growComplianceReport

Add-Check $checks "payment_proof_drill_honesty" (Contains-All -Text $texts.paymentProofReport -Tokens @(
	"Status: PASS",
	"remaining proof step is for the owner to pay that link",
	"verify the transaction plus receipt/invoice",
	"Do not claim automatic recurring billing is live",
	"Still blocked: paying the real link, verifying receipt/invoice"
)) "Payment proof drill keeps the one-time link, receipt/invoice, and recurring blockers explicit." $files.paymentProofReport

Add-Check $checks "manual_invoice_fallback_packet_current" (Contains-All -Text $texts.manualFallbackReport -Tokens @(
	"MANUAL_INVOICE_FALLBACK_READY_NO_LIVE_PAYMENT_ACTION",
	"Live actions taken: 0 records, 0 invoices, 0 payments, 0 paid statuses, 0 emails",
	"manual_invoice_checkout_fallback",
	"qualified_lead_billing_queue",
	"paid_status_proof_guard",
	"Do not mark paid at this stage"
)) "Manual invoice fallback packet is present and explicitly non-live/non-payment." $files.manualFallbackReport

$failed = @($checks | Where-Object { -not $_.pass })

$summary = [ordered]@{
	checkedAt        = (Get-Date).ToUniversalTime().ToString("o")
	root             = $rootPath
	pass             = $failed.Count -eq 0
	failed           = $failed
	checks           = $checks
	operatorStandard = [ordered]@{
		checkoutFallback = "Paid-lawyer intent must preserve plan, billing, terms, cancellation, privacy, and manual-invoice continuation until provider checkout is verified."
		lawyerBilling   = "Lawyer onboarding and dashboard must show payment follow-up, manual payment link, invoice reference, and service-request states."
		ownerTestDrill  = "The onboarding admin must show the exact owner-controlled drill for one real paid-lawyer run without creating false revenue."
		firstValue      = "Paid lawyers with payment evidence must be visible as a first-value queue until activation, lead handoff, or service outcome is recorded."
		firstValueClose = "The paid first-value queue can be closed from admin only when payment_confirmed and private payment evidence are present."
		firstValueProof = "The first-value close action must also require an owner-only outcome note or private proof URL."
		leadBilling     = "Qualified CRM leads may move to ready_to_bill or invoice_sent only after consent, accepted lawyer/supplier terms, and owner release."
		paidProof       = "Paid status requires private payment evidence URL in both CRM lead billing and lawyer onboarding; invoice/reference alone is not revenue proof."
		providerReality = "One-time Grow link evidence is historical support, not current revenue proof; recurring Grow/Meshulam remains provider-gated until a controlled transaction passes."
	}
	knownBlockers    = @(
		"No real payment, receipt, invoice, WooCommerce order, subscription, refund, or provider settlement was created or verified by this checker.",
		"Grow/Meshulam recurring debit and full payment lifecycle remain provider/KYC-gated until live owner/provider evidence exists.",
		"No public CMS/database records, leads, lawyer profiles, products, gateway settings, emails, WhatsApp messages, or uPress deployments are changed by this checker."
	)
	note             = "Repo-local operator/payment proof gate only. Passing it proves the code and evidence controls separate checkout, invoice, and paid-proof stages; it does not prove revenue."
}

$summary | ConvertTo-Json -Depth 10

if (-not $summary.pass) {
	exit 1
}
