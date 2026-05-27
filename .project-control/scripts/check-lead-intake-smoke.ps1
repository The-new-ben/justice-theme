param(
	[string] $BaseUrl = "https://jus-tice.co.il"
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

$base = $BaseUrl.TrimEnd("/")
$cacheBust = [int][double]::Parse((Get-Date -UFormat %s))
$url = "$base/?cachebust=lead-intake-smoke-$cacheBust"

$response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 25 -Headers @{
	"User-Agent" = "Jus-Tice lead intake smoke checker/1.0"
}

$html = [string] $response.Content
$checks = New-Object System.Collections.ArrayList

Add-Check $checks "homepage_status_200" ([int] $response.StatusCode -eq 200) "Homepage returned HTTP $([int] $response.StatusCode)."
Add-Check $checks "ask_lawyer_section_present" ($html.Contains('id="ask-lawyer"')) "Lead form section should be available on the homepage."
Add-Check $checks "form_posts_to_admin_post" ($html.Contains('action="https://jus-tice.co.il/wp-admin/admin-post.php"') -or $html.Contains("admin-post.php")) "Lead form should post to WordPress admin-post handler."
Add-Check $checks "lead_action_present" ($html.Contains('name="action" value="justice_submit_lead"')) "Lead form should submit action justice_submit_lead."
Add-Check $checks "lead_nonce_present" ($html.Contains('name="justice_lead_nonce"')) "Lead form should include nonce field."
Add-Check $checks "lead_source_surface_present" ($html.Contains('name="lead_source_surface"')) "Lead source surface should be captured for CRM attribution."
Add-Check $checks "required_name_phone_area_message" (
	$html.Contains('name="lead_name"') -and
	$html.Contains('name="lead_phone"') -and
	$html.Contains('name="lead_area"') -and
	$html.Contains('name="lead_message"')
) "Lead form should capture name, phone, area, and message."
Add-Check $checks "optional_email_city_urgency" (
	$html.Contains('name="lead_email"') -and
	$html.Contains('name="lead_city"') -and
	$html.Contains('name="lead_urgency"')
) "Lead form should capture email, city, and urgency when available."
Add-Check $checks "consent_required" ($html.Contains('name="lead_consent"') -and $html.Contains('required')) "Lead form should require user consent."
Add-Check $checks "spam_fields_present" ($html.Contains('justice_lead_started_at') -or $html.Contains('lead_website') -or $html.Contains('justice_lead_trap')) "Lead form should include anti-spam fields."
Add-Check $checks "ask_lawyer_whatsapp_surface" ($html.Contains('data-whatsapp-surface="ask_lawyer_form"')) "Ask-lawyer WhatsApp CTA should be source-aware."
Add-Check $checks "homepage_hero_whatsapp_surface" ($html.Contains('data-whatsapp-surface="homepage_hero"')) "Hero WhatsApp CTA should be source-aware."
Add-Check $checks "footer_trust_whatsapp_surface" ($html.Contains('data-whatsapp-surface="footer_trust_path"')) "Footer WhatsApp CTA should be source-aware."
Add-Check $checks "lawyer_registration_link" ($html.Contains('/lawyer-registration/')) "Lawyer registration path should be visible."
Add-Check $checks "lawyer_plans_link" ($html.Contains('/lawyer-plans/')) "Lawyer plans path should be visible."

$failed = @($checks | Where-Object { -not $_.pass })

$result = [ordered]@{
	checkedAt = (Get-Date).ToUniversalTime().ToString("o")
	url       = $url
	status    = [int] $response.StatusCode
	pass      = $failed.Count -eq 0
	failed    = $failed
	checks    = $checks
	note      = "Read-only smoke test. It does not submit the form, create a lead, contact WhatsApp, or charge money."
}

$result | ConvertTo-Json -Depth 8

if (-not $result.pass) {
	exit 1
}
