param(
	[string] $BaseUrl = "https://jus-tice.co.il",
	[string] $Root = ".",
	[switch] $Strict
)

$ErrorActionPreference = "Stop"

$rootPath = (Resolve-Path -LiteralPath $Root).Path
$checkerPath = Join-Path $rootPath "scripts\check-url.mjs"
$base = $BaseUrl.TrimEnd("/")

function New-RouteUrl {
	param([string] $Path)

	if ($Path.StartsWith("?")) {
		return "$base/$Path"
	}

	return "$base$Path"
}

function Invoke-RouteCheck {
	param(
		[string] $Name,
		[string] $Url,
		[string] $ExpectedUrl,
		[string[]] $RequiredTokens = @()
	)

	$arguments = @(
		$checkerPath,
		"--url", $Url,
		"--expected", $ExpectedUrl
	)

	foreach ($token in $RequiredTokens) {
		$arguments += @("--require", $token)
	}

	$output = & node @arguments 2>&1
	$exitCode = $LASTEXITCODE
	$text = ($output | Out-String).Trim()
	$parsed = $null
	$parseError = $null

	try {
		if ($text.Length -gt 0) {
			$parsed = $text | ConvertFrom-Json
		}
	} catch {
		$parseError = $_.Exception.Message
	}

	$pass = $false
	if ($null -ne $parsed -and $null -ne $parsed.pass) {
		$pass = [bool] $parsed.pass
	} elseif ($exitCode -eq 0 -and $null -eq $parseError) {
		$pass = $true
	}

	$warnings = @()
	if ($null -ne $parsed -and $parsed.classification -eq "LEGACY_URL_CANONICAL_OK") {
		$warnings += "Legacy URL resolves without redirect but declares the expected canonical."
	}

	return [ordered]@{
		name           = $Name
		url            = $Url
		expectedUrl    = $ExpectedUrl
		exitCode       = $exitCode
		pass           = $pass
		classification = if ($null -ne $parsed) { $parsed.classification } else { $null }
		status         = if ($null -ne $parsed) { $parsed.followed.status } else { $null }
		finalUrl       = if ($null -ne $parsed) { $parsed.followed.finalUrl } else { $null }
		canonical      = if ($null -ne $parsed) { $parsed.analysis.canonical } else { $null }
		robots         = if ($null -ne $parsed) { $parsed.analysis.robots } else { $null }
		title          = if ($null -ne $parsed) { $parsed.analysis.title } else { $null }
		h1             = if ($null -ne $parsed) { $parsed.analysis.h1 } else { $null }
		signals        = if ($null -ne $parsed) { $parsed.analysis.signals } else { $null }
		missingTokens  = if ($null -ne $parsed) { @($parsed.analysis.missingRequired) } else { @() }
		warnings       = $warnings
		parseError     = $parseError
		rawOutput      = if ($parseError) { $text } else { $null }
	}
}

if (-not (Test-Path -LiteralPath $checkerPath)) {
	$result = [ordered]@{
		checkedAt = (Get-Date).ToUniversalTime().ToString("o")
		baseUrl   = $base
		pass      = $false
		error     = "Missing scripts/check-url.mjs"
		note      = "Read-only route matrix. It does not change redirects, canonicals, noindex, sitemap, CMS content, leads, CRM records, invoices, or payments."
	}
	$result | ConvertTo-Json -Depth 8
	exit 1
}

$routes = @(
	@{
		Name = "homepage"
		Url = (New-RouteUrl -Path "/")
		ExpectedUrl = (New-RouteUrl -Path "/")
		RequiredTokens = @("ask-lawyer")
	},
	@{
		Name = "about_canonical"
		Url = (New-RouteUrl -Path "/about/")
		ExpectedUrl = (New-RouteUrl -Path "/about/")
		RequiredTokens = @()
	},
	@{
		Name = "about_legacy_page_id_315"
		Url = (New-RouteUrl -Path "?page_id=315")
		ExpectedUrl = (New-RouteUrl -Path "/about/")
		RequiredTokens = @()
	},
	@{
		Name = "contact"
		Url = (New-RouteUrl -Path "/contact/")
		ExpectedUrl = (New-RouteUrl -Path "/contact/")
		RequiredTokens = @()
	},
	@{
		Name = "lawyers_directory"
		Url = (New-RouteUrl -Path "/lawyers/")
		ExpectedUrl = (New-RouteUrl -Path "/lawyers/")
		RequiredTokens = @()
	},
	@{
		Name = "lawyer_registration"
		Url = (New-RouteUrl -Path "/lawyer-registration/")
		ExpectedUrl = (New-RouteUrl -Path "/lawyer-registration/")
		RequiredTokens = @("justice_lawyer_registration")
	},
	@{
		Name = "lawyer_plans"
		Url = (New-RouteUrl -Path "/lawyer-plans/")
		ExpectedUrl = (New-RouteUrl -Path "/lawyer-plans/")
		RequiredTokens = @()
	}
)

$results = foreach ($route in $routes) {
	Invoke-RouteCheck `
		-Name $route.Name `
		-Url $route.Url `
		-ExpectedUrl $route.ExpectedUrl `
		-RequiredTokens $route.RequiredTokens
}

$failures = @($results | Where-Object { -not $_.pass })
$warnings = @($results | Where-Object { $_.warnings.Count -gt 0 })

$summary = [ordered]@{
	checkedAt        = (Get-Date).ToUniversalTime().ToString("o")
	baseUrl          = $base
	pass             = $failures.Count -eq 0
	routeCount       = $results.Count
	failureCount     = $failures.Count
	warningCount     = $warnings.Count
	failures         = $failures
	warnings         = $warnings
	results          = $results
	note             = "Read-only route matrix. It does not change redirects, canonicals, noindex, sitemap, CMS content, leads, CRM records, invoices, or payments."
	honestyStatement = "Passing this gate proves selected public trust/revenue routes respond with acceptable technical signals. It does not prove Google indexing, ranking, Search Console state, CRM routing, lawyer handoff, invoice issuance, payment settlement, or revenue."
}

$summary | ConvertTo-Json -Depth 12

if ($Strict -and $failures.Count -gt 0) {
	exit 1
}

if ($failures.Count -gt 0) {
	exit 1
}
