param(
	[string] $BaseUrl = "https://jus-tice.co.il"
)

$ErrorActionPreference = "Stop"

function Get-UrlStatus {
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
			"User-Agent" = "Jus-Tice revenue route checker/1.0"
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

$checks = @(
	@{
		Name = "homepage_public_lead_surface"
		Url = "$base/?cachebust=homepage-revenue-path-$cacheBust"
		RequiredTokens = @(
			"justice-theme-version",
			"ask-lawyer",
			"data-whatsapp-surface=""homepage_hero""",
			"data-whatsapp-surface=""mobile_menu""",
			"/lawyer-registration/",
			"/lawyer-plans/"
		)
	},
	@{
		Name = "lawyers_directory"
		Url = "$base/lawyers/?cachebust=homepage-revenue-path-$cacheBust"
		RequiredTokens = @("justice-theme-version")
	},
	@{
		Name = "lawyer_registration"
		Url = "$base/lawyer-registration/?cachebust=homepage-revenue-path-$cacheBust"
		RequiredTokens = @("justice-theme-version", "justice_lawyer_registration")
	},
	@{
		Name = "lawyer_plans"
		Url = "$base/lawyer-plans/?cachebust=homepage-revenue-path-$cacheBust"
		RequiredTokens = @("justice-theme-version")
	},
	@{
		Name = "about_trust_route"
		Url = "$base/about/?cachebust=homepage-revenue-path-$cacheBust"
		RequiredTokens = @("justice-theme-version")
	},
	@{
		Name = "contact_route"
		Url = "$base/contact/?cachebust=homepage-revenue-path-$cacheBust"
		RequiredTokens = @("justice-theme-version")
	}
)

$results = foreach ($check in $checks) {
	Get-UrlStatus -Name $check.Name -Url $check.Url -RequiredTokens $check.RequiredTokens
}

$summary = [ordered]@{
	checkedAt = (Get-Date).ToUniversalTime().ToString("o")
	baseUrl   = $base
	pass      = ($results | Where-Object { -not $_.ok }).Count -eq 0
	results   = $results
}

$summary | ConvertTo-Json -Depth 8

if (-not $summary.pass) {
	exit 1
}
