param(
	[string] $BaseUrl = "https://jus-tice.co.il"
)

$ErrorActionPreference = "Stop"

$base = $BaseUrl.TrimEnd("/")
$cacheBust = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$url = "$base/lawyer-plans/?cachebust=lawyer-plans-payment-proof-$cacheBust"

$requiredTokens = @(
	'data-revenue-surface="lawyer_plans_payment_proof_path"',
	'data-payment-readiness="manual_invoice_paid_only_with_evidence"',
	'data-payment-state="terms_before_invoice"',
	'data-payment-state="billing_contact"',
	'data-payment-state="invoice_not_paid"',
	'data-payment-state="paid_requires_evidence"',
	'payment_path=manual_invoice',
	'plan_interest=lead_partner',
	'plan_interest=pro',
	'invoice_sent',
	'1.1.75',
	'2026-05-28-lawyer-owner-payment-test-drill-v1'
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
		note          = "Read-only public lawyer-plans payment-proof checker. It does not create invoices, payments, CRM records, users, orders, or gateway settings."
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
