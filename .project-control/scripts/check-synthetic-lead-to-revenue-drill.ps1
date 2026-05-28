param(
	[string] $BaseUrl = "https://jus-tice.co.il",
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
		name = $Name
		pass = $Pass
		detail = $Detail
		file = $File
	})
}

function Read-Text {
	param([string] $Path)

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
$base = $BaseUrl.TrimEnd("/")
$cacheBust = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$homepageUrl = "$base/?cachebust=synthetic-lead-drill-$cacheBust"

$files = [ordered]@{
	leadForm = Join-Path $rootPath "template-parts\forms\lead-form.php"
	leadSubmissions = Join-Path $rootPath "ultra-justice-engine\includes\lead-submissions.php"
	crm = Join-Path $rootPath "inc\lead-crm.php"
	leadRouting = Join-Path $rootPath "inc\lead-routing.php"
	lawyerDashboard = Join-Path $rootPath "page-lawyer-dashboard.php"
	lawyerDashboardLogic = Join-Path $rootPath "inc\lawyer-dashboard.php"
	lawyerRegistrationWizard = Join-Path $rootPath "assets\js\lawyer-registration-wizard.js"
	lawyerOnboarding = Join-Path $rootPath "inc\lawyer-onboarding.php"
	paymentCompliance = Join-Path $rootPath "inc\payment-compliance-routes.php"
	firstPaidPacket = Join-Path $rootPath ".project-control\first-paid-lawyer-manual-invoice-acceptance-test-2026-05-28.md"
}

$texts = [ordered]@{}
foreach ($key in $files.Keys) {
	$texts[$key] = Read-Text -Path $files[$key]
}

$checks = New-Object System.Collections.ArrayList

foreach ($key in $files.Keys) {
	Add-Check $checks "file_present_$key" ($texts[$key].Length -gt 0) "Required source/evidence file exists." $files[$key]
}

try {
	$response = Invoke-WebRequest -Uri $homepageUrl -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 30 -Headers @{
		"User-Agent" = "Jus-Tice synthetic lead-to-revenue drill/1.0"
	}
	$html = [string] $response.Content
	Add-Check $checks "live_homepage_200" ([int] $response.StatusCode -eq 200) "Live homepage returned HTTP $([int] $response.StatusCode)." $homepageUrl
	Add-Check $checks "live_public_form_present" (Contains-All -Text $html -Tokens @(
		'id="ask-lawyer"',
		'name="action" value="justice_submit_lead"',
		'name="lead_name"',
		'name="lead_phone"',
		'name="lead_area"',
		'name="lead_message"',
		'name="lead_consent"',
		'name="lead_source_surface"'
	)) "Live homepage exposes the public legal-help lead form with required lead and source fields." $homepageUrl
	Add-Check $checks "live_whatsapp_surfaces_present" (Contains-All -Text $html -Tokens @(
		'data-whatsapp-surface="homepage_hero"',
		'data-whatsapp-surface="ask_lawyer_form"',
		'data-whatsapp-surface="mobile_menu"'
	)) "Live homepage exposes source-aware WhatsApp surfaces for hero, form, and mobile menu." $homepageUrl
	Add-Check $checks "live_lawyer_revenue_paths_present" (Contains-All -Text $html -Tokens @(
		'/lawyer-registration/',
		'/lawyer-plans/',
		'data-revenue-surface="homepage_customer_status_path"'
	)) "Live homepage keeps lawyer registration, plans, and customer status revenue paths visible." $homepageUrl
} catch {
	Add-Check $checks "live_homepage_fetch" $false $_.Exception.Message $homepageUrl
}

Add-Check $checks "lead_form_fields_and_consent" (Contains-All -Text $texts.leadForm -Tokens @(
	'justice_submit_lead',
	'lead_source_surface',
	'justice_lead_nonce',
	'justice_theme_render_lead_spam_fields',
	'justice_theme_render_lead_attribution_fields',
	'lead_name',
	'lead_phone',
	'lead_email',
	'lead_area',
	'lead_city',
	'lead_urgency',
	'lead_message',
	'lead_consent'
)) "Lead form captures identity, contact, area, city, urgency, source, consent, nonce, and anti-spam/attribution fields." $files.leadForm

Add-Check $checks "lead_submission_creates_crm_record" (Contains-All -Text $texts.leadSubmissions -Tokens @(
	'admin_post_justice_submit_lead',
	'admin_post_nopriv_justice_submit_lead',
	'wp_insert_post',
	'justice_lead',
	'visitor_name',
	'visitor_phone',
	'legal_area',
	'lead_status',
	'follow_up_status',
	'not_started',
	'coverage_status',
	'coverage_review',
	'consent_status',
	'source_channel',
	'lead_source_surface',
	'qualified_lead_billing_status',
	'not_ready',
	'owner_revenue_next_step'
)) "Public form handler creates a private CRM lead with source, consent, follow-up, coverage, and billing-not-ready defaults." $files.leadSubmissions

Add-Check $checks "crm_operator_bridge_and_first_attempt" (Contains-All -Text $texts.crm -Tokens @(
	'justice_theme_crm_render_whatsapp_lead_bridge',
	'justice_theme_create_whatsapp_lead',
	'justice_theme_crm_handle_mark_lead_first_attempt',
	'first_contact_at',
	'follow_up_status',
	'Homepage lead actions',
	'justice_theme_crm_render_homepage_router_lead_queue'
)) "CRM supports manual WhatsApp lead intake, homepage lead queue, and first-attempt logging." $files.crm

Add-Check $checks "crm_handoff_and_billing_proof_guard" (Contains-All -Text $texts.crm -Tokens @(
	'owner_handoff_release_status',
	'client_permission_next_step',
	'justice_theme_crm_render_qualified_lead_billing_queue',
	'qualified_lead_invoice_reference',
	'qualified_lead_payment_evidence_url',
	'qualified_lead_paid_at',
	'Payment status was not marked Paid because Paid requires a payment evidence URL',
	'justice_theme_crm_render_manual_invoice_bridge_panel'
)) "CRM separates permission/handoff release, billing queue, invoice reference, and paid proof evidence." $files.crm

Add-Check $checks "routing_sets_revenue_defaults" (Contains-All -Text $texts.leadRouting -Tokens @(
	'follow_up_status',
	'not_started',
	'qualified_lead_billing_status',
	'not_ready',
	'owner_revenue_next_step',
	'lead_source_surface',
	'justice_theme_mark_qualified_lead_ready_to_bill',
	'ready_to_bill',
	'qualified_lead_billable_lawyer_ids'
)) "Routing primes leads for follow-up and keeps billing blocked until qualified/billable lawyer IDs exist." $files.leadRouting

Add-Check $checks "lawyer_dashboard_receives_and_updates_leads" (Contains-All -Text $texts.lawyerDashboard -Tokens @(
	'lawyer-dashboard-payment-proof-preview',
	'lead_whatsapp_link',
	'lead_email_link',
	'phone_link',
	'justice_lawyer_lead_stage_update',
	'lead_follow_up_note',
	'Call within 15 minutes',
	'manual_invoice'
)) "Lawyer dashboard exposes contact actions, first-response expectations, lead stage update, follow-up notes, and payment context." $files.lawyerDashboard

Add-Check $checks "lawyer_dashboard_service_and_payment_requests" (Contains-All -Text $texts.lawyerDashboardLogic -Tokens @(
	'payment_link_request',
	'invoice_copy',
	'refund',
	'cancel',
	'downgrade',
	'lead_quality',
	'justice_theme_handle_lawyer_service_request',
	'justice_theme_lawyer_dashboard_lead_stage_options',
	'justice_theme_handle_lawyer_lead_stage_update'
)) "Lawyer dashboard logic supports billing/service requests and lead-stage updates after handoff." $files.lawyerDashboardLogic

Add-Check $checks "lawyer_registration_manual_invoice_path" (Contains-All -Text $texts.lawyerRegistrationWizard -Tokens @(
	'plan_interest',
	'payment_path',
	'manual_invoice',
	'data-manual-billing-fields',
	'lead_response_commitment',
	'registration_landing_url',
	'registration_referrer_url'
)) "Lawyer registration preserves plan intent, manual invoice path, billing fields, response commitment, and attribution." $files.lawyerRegistrationWizard

Add-Check $checks "lawyer_onboarding_payment_evidence_guard" (Contains-All -Text $texts.lawyerOnboarding -Tokens @(
	'payment_followup_status',
	'invoice_requested',
	'invoice_sent',
	'payment_confirmed',
	'manual_payment_link_url',
	'manual_invoice_reference',
	'manual_payment_evidence_url',
	'Payment confirmed was blocked because manual_payment_evidence_url is missing',
	'First paid lawyer proof packet'
)) "Lawyer onboarding blocks payment-confirmed claims without private evidence and exposes the proof packet." $files.lawyerOnboarding

Add-Check $checks "checkout_manual_invoice_compliance_path" (Contains-All -Text $texts.paymentCompliance -Tokens @(
	'payment_path',
	'manual_invoice',
	'woocommerce_before_checkout_form',
	'woocommerce_checkout_create_order',
	'_justice_checkout_terms_approved_at',
	'_justice_checkout_cancellation_url',
	'_justice_checkout_privacy_url'
)) "Checkout/manual-invoice compliance keeps terms, cancellation, privacy, and order evidence fields available." $files.paymentCompliance

Add-Check $checks "first_paid_manual_invoice_packet_present" (Contains-All -Text $texts.firstPaidPacket -Tokens @(
	'NO_LIVE_PAYMENT_ACTION',
	'controlled_lawyer',
	'accepted_terms',
	'billing_contact',
	'manual_invoice_request',
	'crm_status_paid',
	'private_payment_evidence_url',
	'do_not_mark_paid_without_evidence'
)) "First paid lawyer manual invoice packet exists and keeps paid status blocked until evidence exists." $files.firstPaidPacket

$failed = @($checks | Where-Object { -not $_.pass })

$summary = [ordered]@{
	checkedAt = (Get-Date).ToUniversalTime().ToString("o")
	baseUrl = $base
	root = $rootPath
	pass = $failed.Count -eq 0
	failureCount = $failed.Count
	failed = $failed
	syntheticEntity = [ordered]@{
		name = "Synthetic legal-help visitor - dry run only"
		phone = "050-000-0000"
		email = "synthetic-lead@example.invalid"
		legalArea = "bituach_leumi"
		city = "Tel Aviv"
		urgency = "high"
		sourceSurface = "homepage_ask_lawyer"
		revenuePath = "qualified lead -> paid lawyer handoff -> manual invoice -> private payment evidence"
	}
	operatorFlow = @(
		"Public user submits homepage lead or opens source-aware WhatsApp.",
		"Private justice_lead CRM record is created with source, consent, follow-up, coverage, and billing-not-ready defaults.",
		"Owner logs first attempt and qualifies area, city, urgency, permission, and coverage.",
		"Owner releases to lawyer/supplier only after client permission and commercial terms are clear.",
		"Assigned lawyer sees contact actions and updates lead stage in the dashboard.",
		"Qualified/billable lead or paid lawyer plan moves to manual invoice path while Grow/Meshulam remains blocked.",
		"Paid status is allowed only after private payment evidence URL and timestamp exist."
	)
	checks = $checks
	blockers = @(
		"No live lead was submitted and no CRM record was created by this drill.",
		"No WhatsApp message, email outreach, invoice, WooCommerce order, payment, refund, subscription, gateway setting, or CMS content was created or changed.",
		"Grow/Meshulam KYC/payment settlement remains the real payment blocker.",
		"Revenue remains unproven until a real controlled lawyer/payment/invoice proof exists."
	)
	honestyStatement = "This is a dry-run readiness gate. It proves the live page and code expose the expected lead-to-revenue controls, but it does not prove end-to-end CRM data creation, lawyer response, invoice issuance, payment settlement, or profit."
}

$summary | ConvertTo-Json -Depth 10

if (-not $summary.pass) {
	exit 1
}
