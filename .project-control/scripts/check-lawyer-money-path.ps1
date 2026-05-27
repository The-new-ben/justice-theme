param(
	[string] $BaseUrl = "https://jus-tice.co.il"
)

$ErrorActionPreference = "Stop"

function Test-LiveHtml {
	param(
		[string] $Name,
		[string] $Url,
		[string[]] $RequiredTokens = @()
	)

	$result = [ordered]@{
		name          = $Name
		url           = $Url
		status        = $null
		ok            = $false
		bodyLength    = 0
		missingTokens = @()
		error         = $null
	}

	try {
		$response = Invoke-WebRequest -Uri $Url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 25 -Headers @{
			"User-Agent" = "Jus-Tice lawyer money path checker/1.0"
		}

		$html = [string] $response.Content
		$result.status = [int] $response.StatusCode
		$result.bodyLength = $html.Length

		foreach ($token in $RequiredTokens) {
			if (-not $html.Contains($token)) {
				$result.missingTokens += $token
			}
		}

		$result.ok = ($result.status -ge 200 -and $result.status -lt 300 -and $result.missingTokens.Count -eq 0)
	} catch {
		$result.error = $_.Exception.Message
	}

	return $result
}

$base = $BaseUrl.TrimEnd("/")
$cacheBust = [int][double]::Parse((Get-Date -UFormat %s))

$registrationQuery = "plan_interest=lead_partner&payment_path=manual_invoice&billing_first_name=Smoke&billing_last_name=Lawyer&billing_phone=0501234567&billing_email=smoke-lawyer%40example.com&billing_legal_name=Smoke+Legal+Ltd&billing_business_id=123456789&billing_invoice_email=billing-smoke%40example.com&billing_invoice_address=Tel+Aviv&utm_source=money_path_smoke&utm_medium=read_only&utm_campaign=lawyer_acquisition"

$checks = @(
	@{
		Name = "lawyer_plans_money_page"
		Url = "$base/lawyer-plans/?cachebust=lawyer-money-path-$cacheBust"
		RequiredTokens = @(
			"justice-theme-version",
			"lawyer-plans",
			"lawyer-plan-card",
			"/lawyer-registration/",
			"payment_path",
			"manual_invoice"
		)
	},
	@{
		Name = "checkout_manual_invoice_bridge"
		Url = "$base/checkout/?plan_interest=lead_partner&utm_source=money_path_smoke&utm_medium=read_only&utm_campaign=lawyer_acquisition&cachebust=lawyer-money-path-$cacheBust"
		RequiredTokens = @(
			"justice-theme-version",
			"pre_checkout",
			"payment_path",
			"manual_invoice",
			"plan_interest",
			"billing_first_name",
			"billing_email",
			"terms",
			"/lawyer-registration/"
		)
	},
	@{
		Name = "registration_manual_invoice_prefill"
		Url = "$base/lawyer-registration/?$registrationQuery&cachebust=lawyer-money-path-$cacheBust"
		RequiredTokens = @(
			"justice-theme-version",
			"justice_lawyer_registration",
			"plan_interest",
			"lead_partner",
			"payment_path",
			"manual_invoice",
			"billing_legal_name",
			"billing_invoice_email",
			"billing_invoice_address"
		)
	},
	@{
		Name = "lawyer_dashboard_route"
		Url = "$base/lawyer-dashboard/?cachebust=lawyer-money-path-$cacheBust"
		RequiredTokens = @(
			"justice-theme-version"
		)
	}
)

$results = foreach ($check in $checks) {
	Test-LiveHtml -Name $check.Name -Url $check.Url -RequiredTokens $check.RequiredTokens
}

$failed = @($results | Where-Object { -not $_.ok })

$summary = [ordered]@{
	checkedAt = (Get-Date).ToUniversalTime().ToString("o")
	baseUrl   = $base
	pass      = $failed.Count -eq 0
	failed    = $failed
	results   = $results
	note      = "Read-only money-path smoke test. It does not submit forms, create users/orders, send invoices, change WooCommerce/Grow/Meshulam settings, or charge money."
}

$summary | ConvertTo-Json -Depth 8

if (-not $summary.pass) {
	exit 1
}
