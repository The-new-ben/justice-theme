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
	crm             = Join-Path $rootPath "inc\lead-crm.php"
	routing         = Join-Path $rootPath "inc\lead-routing.php"
	dashboard       = Join-Path $rootPath "page-lawyer-dashboard.php"
	dashboardLogic  = Join-Path $rootPath "inc\lawyer-dashboard.php"
	spamGuard       = Join-Path $rootPath "inc\lead-spam-guard.php"
	functions       = Join-Path $rootPath "functions.php"
}

$texts = [ordered]@{}
foreach ($key in $files.Keys) {
	$texts[$key] = Read-FileText -Path $files[$key]
}

$checks = New-Object System.Collections.ArrayList

foreach ($key in $files.Keys) {
	Add-Check $checks "file_present_$key" ($texts[$key].Length -gt 0) "Required source file exists." $files[$key]
}

Add-Check $checks "crm_loaded_by_theme" (Contains-All -Text $texts.functions -Tokens @("'inc/lead-crm.php'", "'inc/lead-routing.php'", "'inc/lead-spam-guard.php'")) "Theme loads CRM, routing, and lead spam/attribution modules." $files.functions
Add-Check $checks "lead_admin_menu" (Contains-All -Text $texts.crm -Tokens @("add_menu_page", "Justice CRM", "justice_theme_render_crm_admin_page")) "Owner/admin CRM page is registered." $files.crm
Add-Check $checks "lead_meta_registered" (Contains-All -Text $texts.crm -Tokens @("follow_up_status", "first_contact_at", "qualified_lead_billing_status", "qualified_lead_invoice_reference", "qualified_lead_payment_evidence_url", "lead_source_surface", "source_channel", "handoff_path")) "Lead metadata covers follow-up, source attribution, handoff path, and billing evidence." $files.crm
Add-Check $checks "public_form_action_guarded" (Contains-All -Text $texts.spamGuard -Tokens @("admin_post_justice_submit_lead", "admin_post_nopriv_justice_submit_lead", "justice_lead_company", "lead_source_surface", "utm_source", "justice_lead_started_at")) "Public lead form path has attribution helpers and anti-spam guard fields." $files.spamGuard
Add-Check $checks "manual_whatsapp_bridge" (Contains-All -Text $texts.crm -Tokens @("justice_theme_crm_render_whatsapp_lead_bridge", "justice_theme_create_whatsapp_lead", "source_channel", "consent_status", "suggested_lead_price_ils")) "Owner can manually turn WhatsApp/email/phone inquiries into private CRM leads with consent and price context." $files.crm
Add-Check $checks "manual_lead_dedupe" (Contains-All -Text $texts.crm -Tokens @("justice_theme_crm_external_lead_fingerprint", "justice_theme_crm_find_lead_by_import_fingerprint", "import_fingerprint")) "Manual/imported leads have fingerprinting to reduce duplicate CRM records." $files.crm
Add-Check $checks "manual_permission_gate" (Contains-All -Text $texts.crm -Tokens @("justice_theme_crm_manual_lead_consent_options", "justice_theme_crm_manual_lead_routeable_consent_statuses", "client_permission_next_step", "owner_handoff_release_status")) "Manual leads include consent and handoff-release gates before lawyer/supplier routing." $files.crm
Add-Check $checks "routing_defaults" (Contains-All -Text $texts.routing -Tokens @("follow_up_status", "not_started", "qualified_lead_billing_status", "not_ready", "owner_revenue_next_step", "lead_source_surface")) "Lead routing primes follow-up and billing status defaults." $files.routing
Add-Check $checks "qualified_lead_billing_ready" (Contains-All -Text $texts.routing -Tokens @("justice_theme_mark_qualified_lead_ready_to_bill", "ready_to_bill", "qualified_lead_ready_at", "qualified_lead_billable_lawyer_ids")) "Assigned qualified leads can become billable with lawyer IDs and ready timestamp." $files.routing
Add-Check $checks "admin_first_attempt_action" (Contains-All -Text $texts.crm -Tokens @("justice_theme_crm_handle_mark_lead_first_attempt", "follow_up_status", "first_attempt", "first_contact_at", "lead_status", "contacted")) "Admin can record first attempt and first-contact timestamp." $files.crm
Add-Check $checks "admin_billing_evidence_guard" (Contains-All -Text $texts.crm -Tokens @("'paid' === `$billing_status", "qualified_lead_payment_evidence_url", "qualified_lead_paid_at", "qualified_lead_billed_at")) "Admin billing disposition prevents paid-state claims without payment evidence URL and timestamps bill/paid states." $files.crm
Add-Check $checks "admin_billing_queue" (Contains-All -Text $texts.crm -Tokens @("justice_theme_crm_render_qualified_lead_billing_queue", "justice_theme_crm_query_qualified_lead_billing_queue", "justice_theme_crm_qualified_lead_invoice_packet", "qualified_lead_invoice_reference")) "CRM exposes a qualified lead billing queue and invoice packet." $files.crm
Add-Check $checks "btl_payment_proof_lock" (Contains-All -Text $texts.crm -Tokens @("justice_theme_crm_render_btl_payment_proof_lock", "justice_theme_crm_btl_payment_proof_lock_copy", "Do not report BTL paid revenue yet", "qualified_lead_paid_at exists")) "BTL first-paid-lead panel keeps revenue reporting locked to private payment evidence." $files.crm
Add-Check $checks "lead_audit_export" (Contains-All -Text $texts.crm -Tokens @("justice_theme_crm_render_lead_audit_export_panel", "justice_theme_crm_handle_lead_audit_export", "payment_evidence_url_present")) "Owner can export lead audit evidence without exposing payment proof inline." $files.crm
Add-Check $checks "lawyer_dashboard_stage_options" (Contains-All -Text $texts.dashboardLogic -Tokens @("justice_theme_lawyer_dashboard_lead_stage_options", "not_started", "first_attempt", "contacted", "consult_scheduled", "won", "lost")) "Lawyer dashboard has defined lead stage options." $files.dashboardLogic
Add-Check $checks "lawyer_dashboard_stage_update" (Contains-All -Text $texts.dashboardLogic -Tokens @("justice_theme_handle_lawyer_lead_stage_update", "update_post_meta( `$lead_id, 'follow_up_status'", "first_contact_at", "consultation_scheduled_at", "retained_at")) "Lawyer dashboard can update lead stage and value timestamps." $files.dashboardLogic
Add-Check $checks "lawyer_dashboard_sla" (Contains-All -Text $texts.dashboard -Tokens @("lead_response_needed_count", "lead_response_overdue_count", "Call within 15 minutes", "Call now - overdue")) "Lawyer dashboard surfaces first-response SLA and overdue leads." $files.dashboard
Add-Check $checks "lawyer_dashboard_contact_actions" (Contains-All -Text $texts.dashboard -Tokens @("phone_link", "whatsapp_link", "email_link", "lead_whatsapp_link")) "Assigned leads expose call, WhatsApp, and email actions in the lawyer dashboard." $files.dashboard
Add-Check $checks "lawyer_dashboard_value_metrics" (Contains-All -Text $texts.dashboard -Tokens @("lead_value_metrics", "first_response", "consultations", "retained", "closed")) "Dashboard tracks lead value metrics beyond raw lead count." $files.dashboard
Add-Check $checks "homepage_router_queue" (Contains-All -Text $texts.crm -Tokens @("justice_theme_crm_query_homepage_router_leads", "justice_theme_crm_render_homepage_router_lead_queue", "Homepage lead actions")) "CRM exposes a homepage-router lead queue for unworked public leads." $files.crm
Add-Check $checks "lawyer_outreach_from_lead" (Contains-All -Text $texts.crm -Tokens @("justice_theme_crm_lawyer_outreach_from_lead_url", "plan_interest", "lead_partner", "source_lead_id", "outreach_personal_note")) "CRM can create lawyer outreach links from a source lead." $files.crm

$failed = @($checks | Where-Object { -not $_.pass })

$summary = [ordered]@{
	checkedAt        = (Get-Date).ToUniversalTime().ToString("o")
	root             = $rootPath
	pass             = $failed.Count -eq 0
	failed           = $failed
	checks           = $checks
	operatorStandard = [ordered]@{
		newLead       = "New WhatsApp/form/manual lead enters CRM with source, consent, legal area, and handoff path."
		firstResponse = "First attempt should be recorded within 15 minutes when the lead is assigned/open."
		qualification = "Qualified lead requires legal area, client permission, routeable lawyer/supplier fit, and billing readiness."
		lawyerHandoff = "Assigned lawyer dashboard must expose call, WhatsApp, email, stage update, and first-response metrics."
		billing        = "Ready-to-bill leads require billable lawyer IDs, invoice reference, and payment evidence before paid status."
	}
	note             = "Repo-local readiness check only. It does not create leads, update CRM, contact anyone, send WhatsApp/email, create invoices, change CMS, change payments, or deploy."
}

$summary | ConvertTo-Json -Depth 10

if (-not $summary.pass) {
	exit 1
}
