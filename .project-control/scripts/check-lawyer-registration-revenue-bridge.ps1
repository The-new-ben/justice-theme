param(
	[string] $BaseUrl = "https://jus-tice.co.il"
)

$ErrorActionPreference = "Stop"

$base = $BaseUrl.TrimEnd("/")
$cacheBust = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$url = "$base/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice&cachebust=lawyer-registration-revenue-bridge-$cacheBust"

$requiredTokens = @(
	'data-revenue-surface="lawyer_registration_revenue_bridge"',
	'data-funnel-step="lawyer_registration_to_invoice_followup"',
	'data-registration-state="lead_response_commitment"',
	'data-registration-state="practice_city_match"',
	'data-registration-state="billing_details_ready"',
	'data-registration-state="paid_requires_evidence"',
	'name="lead_response_commitment"',
	'name="plan_interest"',
	'value="lead_partner"',
	'name="payment_path"',
	'value="manual_invoice"',
	'data-manual-billing-fields',
	'name="billing_invoice_email"',
	'invoice_sent',
	'1.1.79',
	'2026-05-28-lawyer-retention-review-action-v1'
)

try {
	$response = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 30
	$html = [string] $response.Content
	$missing = @()

	foreach ($token in $requiredTokens) {
		if (-not $html.Contains($token)) {
			$missing += $token
		}
	}

	$result = [ordered]@{
		checkedAt     = (Get-Date).ToUniversalTime().ToString("o")
		url           = $url
		status        = [int] $response.StatusCode
		pass          = ([int] $response.StatusCode -eq 200 -and $missing.Count -eq 0)
		missingTokens = $missing
		bodyLength    = $html.Length
		note          = "Read-only public lawyer-registration revenue bridge checker. It does not submit registration, create users, create lawyer profiles, create invoices, payments, CRM records, or gateway settings."
	}

	$result | ConvertTo-Json -Depth 4

	if (-not $result.pass) {
		exit 1
	}
} catch {
	[ordered]@{
		checkedAt = (Get-Date).ToUniversalTime().ToString("o")
		url       = $url
		pass      = $false
		error     = $_.Exception.Message
	} | ConvertTo-Json -Depth 4
	exit 2
}
