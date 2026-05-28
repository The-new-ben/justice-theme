param(
	[string] $BaseUrl = "https://jus-tice.co.il"
)

$ErrorActionPreference = "Stop"

$base = $BaseUrl.TrimEnd("/")
$cacheBust = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$url = "$base/lawyer-dashboard/?cachebust=lawyer-dashboard-payment-proof-preview-$cacheBust"

$requiredTokens = @(
	'lawyer-dashboard-payment-proof-preview',
	'data-revenue-surface="lawyer_dashboard_payment_proof_preview"',
	'data-dashboard-step="manual_invoice_to_paid_dashboard"',
	'data-dashboard-state="invoice_requested"',
	'data-dashboard-state="invoice_sent"',
	'data-dashboard-state="payment_evidence_required"',
	'data-dashboard-state="lead_routing_after_paid"',
	'lawyer-dashboard-login-preview',
	'/lawyer-registration/',
	'/lawyer-plans/',
	'1.1.78',
	'2026-05-28-lawyer-first-value-evidence-guard-v1'
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
		note          = "Read-only public lawyer-dashboard payment-proof preview checker. It does not log in, submit service requests, create invoices, create payments, route leads, update CRM records, or change gateway settings."
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
