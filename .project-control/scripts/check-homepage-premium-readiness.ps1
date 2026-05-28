param(
	[string] $BaseUrl = "https://jus-tice.co.il",
	[string] $ExpectedMarker = "2026-05-28-mobile-menu-stable-in-place-v1",
	[string] $ExpectedVersion = "1.1.85"
)

$ErrorActionPreference = "Stop"

function Get-MatchValue {
	param(
		[string] $Text,
		[string] $Pattern
	)

	$match = [regex]::Match($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)
	if ($match.Success -and $match.Groups.Count -gt 1) {
		return [System.Net.WebUtility]::HtmlDecode($match.Groups[1].Value.Trim())
	}

	return $null
}

function Test-AnyToken {
	param(
		[string] $Text,
		[string[]] $Tokens
	)

	foreach ($token in $Tokens) {
		if ($Text.Contains($token)) {
			return $true
		}
	}

	return $false
}

function New-TokenCheck {
	param(
		[string] $Name,
		[string[]] $Tokens,
		[string] $Reason
	)

	[ordered]@{
		name = $Name
		pass = (Test-AnyToken -Text $html -Tokens $Tokens)
		tokens = $Tokens
		reason = $Reason
	}
}

$base = $BaseUrl.TrimEnd("/")
$cacheBust = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$url = "$base/?cachebust=homepage-premium-readiness-$cacheBust"

try {
	$response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 30 -Headers @{
		"User-Agent" = "Jus-Tice homepage premium readiness checker/1.0"
	}
	$html = [string] $response.Content
} catch {
	[ordered]@{
		checkedAt = (Get-Date).ToUniversalTime().ToString("o")
		url = $url
		pass = $false
		error = $_.Exception.Message
	} | ConvertTo-Json -Depth 6
	exit 2
}

$title = Get-MatchValue -Text $html -Pattern "<title[^>]*>(.*?)</title>"
$h1 = Get-MatchValue -Text $html -Pattern "<h1[^>]*>(.*?)</h1>"
$canonical = Get-MatchValue -Text $html -Pattern "<link[^>]+rel=[`"']canonical[`"'][^>]+href=[`"']([^`"']+)[`"'][^>]*>"
$robots = Get-MatchValue -Text $html -Pattern "<meta[^>]+name=[`"']robots[`"'][^>]+content=[`"']([^`"']+)[`"'][^>]*>"
$navMatches = [regex]::Matches($html, "<nav\b[\s\S]*?</nav>", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$navHtml = ($navMatches | ForEach-Object { $_.Value }) -join "`n"
$pageIdLinksInNav = [regex]::Matches($navHtml, "href=[`"'][^`"']*\?page_id=", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Count
$imageCount = [regex]::Matches($html, "<img\b", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Count
$imagesWithExplicitSize = [regex]::Matches($html, "<img\b(?=[^>]*\bwidth=)(?=[^>]*\bheight=)", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Count
$hasHebrewTitle = ($title -match "\p{IsHebrew}")
$hasHebrewH1 = ($h1 -match "\p{IsHebrew}")

$checks = @(
	[ordered]@{
		name = "http_success"
		pass = ([int] $response.StatusCode -ge 200 -and [int] $response.StatusCode -lt 300)
		reason = "Homepage must fetch successfully before design, SEO, or revenue claims."
	},
	[ordered]@{
		name = "canonical_homepage"
		pass = ($canonical -eq "$base/")
		actual = $canonical
		reason = "Homepage canonical must point to the homepage and not to a legacy page_id URL."
	},
	[ordered]@{
		name = "robots_indexable"
		pass = ($null -eq $robots -or -not $robots.ToLowerInvariant().Contains("noindex"))
		actual = $robots
		reason = "Homepage must not accidentally block indexing."
	},
	[ordered]@{
		name = "lawyer_search_intent"
		pass = ($hasHebrewTitle -and $hasHebrewH1 -and $title.Length -ge 20 -and $h1.Length -ge 15)
		title = $title
		h1 = $h1
		reason = "Homepage must still present meaningful Hebrew title/H1 copy for the broad lawyer/legal-help index intent."
	},
	(New-TokenCheck -Name "deployment_marker" -Tokens @($ExpectedMarker) -Reason "Protects the latest verified mobile-menu deployment from regression."),
	(New-TokenCheck -Name "theme_version" -Tokens @($ExpectedVersion) -Reason "Confirms the expected live theme version is present."),
	(New-TokenCheck -Name "public_lead_cta" -Tokens @("data-whatsapp-surface=`"homepage_hero`"", "ask-lawyer") -Reason "Public users need an immediate contact or intake path."),
	(New-TokenCheck -Name "mobile_menu_conversion" -Tokens @("primary-navigation__mobile-actions", "data-whatsapp-surface=`"mobile_menu`"") -Reason "Mobile menu must expose stable conversion actions."),
	(New-TokenCheck -Name "lawyer_revenue_path" -Tokens @("/lawyer-registration/", "/lawyer-plans/", "data-revenue-surface=`"homepage_customer_status_path`"") -Reason "Lawyer supply and subscription paths must remain discoverable."),
	(New-TokenCheck -Name "service_flow" -Tokens @("homepage-service-flow", "find-guide") -Reason "Competitor research requires process clarity and lawyer-selection education."),
	[ordered]@{
		name = "nav_no_page_id_links"
		pass = ($pageIdLinksInNav -eq 0)
		actual = $pageIdLinksInNav
		reason = "Primary navigation should not send users to legacy page_id URLs."
	},
	[ordered]@{
		name = "image_dimension_signal"
		pass = ($imageCount -eq 0 -or $imagesWithExplicitSize -gt 0)
		imageCount = $imageCount
		imagesWithExplicitSize = $imagesWithExplicitSize
		reason = "At least some rendered images should reserve dimensions; full Lighthouse still required for LCP/CLS proof."
	}
)

$failures = @($checks | Where-Object { -not $_.pass })
$warnings = @()
if ($imageCount -gt 0 -and $imagesWithExplicitSize -lt $imageCount) {
	$warnings += "Some images may still rely on CSS/aspect-ratio instead of explicit width and height; verify with Lighthouse/visual QA before calling the rebuild complete."
}
if ($html.Contains("?page_id=")) {
	$warnings += "A legacy page_id string exists somewhere in the homepage HTML; primary nav is clean, but full link hygiene should still be monitored."
}

$summary = [ordered]@{
	checkedAt = (Get-Date).ToUniversalTime().ToString("o")
	url = $url
	status = [int] $response.StatusCode
	pass = ($failures.Count -eq 0)
	failureCount = $failures.Count
	warningCount = $warnings.Count
	title = $title
	h1 = $h1
	canonical = $canonical
	robots = $robots
	checks = $checks
	failures = $failures
	warnings = $warnings
	researchSources = @(
		"https://www.din.co.il/",
		"https://www.lawreviews.co.il/",
		"https://lawhive.com/",
		"https://developers.google.com/search/docs/appearance/core-web-vitals",
		"https://developer.chrome.com/docs/lighthouse",
		"https://developer.wordpress.org/themes/basics/template-hierarchy/",
		"https://woocommerce.com/document/subscriptions/payment-gateways/"
	)
	honestyStatement = "This read-only gate proves homepage route, SEO-intent, CTA, mobile-menu, and revenue-surface signals. It does not prove Search Console indexing, Lighthouse scores, CRM handoff, invoice issuance, payment settlement, or real revenue."
}

$summary | ConvertTo-Json -Depth 10

if (-not $summary.pass) {
	exit 1
}
