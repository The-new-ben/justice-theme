param(
	[string] $BaseUrl = "https://jus-tice.co.il"
)

$ErrorActionPreference = "Stop"

function Get-PageFacts {
	param(
		[string] $Name,
		[string] $Url
	)

	$separator = if ($Url.Contains("?")) { "&" } else { "?" }
	$checkUrl = "$Url${separator}cachebust=about-route-live-$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"
	$response = Invoke-WebRequest -UseBasicParsing -Uri $checkUrl -MaximumRedirection 0
	$html = [string] $response.Content

	$title = ([regex]::Match($html, "<title[^>]*>(.*?)</title>", "Singleline").Groups[1].Value -replace "\s+", " ").Trim()
	$h1 = (([regex]::Match($html, "<h1[^>]*>(.*?)</h1>", "Singleline").Groups[1].Value -replace "<[^>]+>", "") -replace "\s+", " ").Trim()
	$canonical = [regex]::Match($html, "<link[^>]+rel=[""']canonical[""'][^>]+href=[""']([^""']+)", "IgnoreCase").Groups[1].Value
	$robots = [regex]::Match($html, "<meta[^>]+name=[""']robots[""'][^>]+content=[""']([^""']+)", "IgnoreCase").Groups[1].Value

	return [ordered]@{
		name          = $Name
		requestedUrl  = $Url
		checkedUrl    = $checkUrl
		status        = [int] $response.StatusCode
		location      = $response.Headers.Location
		title         = $title
		h1            = $h1
		canonical     = $canonical
		robots        = if ($robots) { $robots } else { "-" }
		routeGuard    = $response.Headers["X-Justice-Route-Guard"]
		routeAlias    = $response.Headers["X-Justice-Route-Alias"]
		bodyLength    = $html.Length
		hasHeader     = $html.Contains("primary-navigation")
		hasFooter     = $html.Contains("site-footer")
		hasContactCta = $html.Contains("/contact/")
		hasLawyersCta = $html.Contains("/lawyers/")
		hasNoindex    = $robots -match "noindex"
	}
}

$base = $BaseUrl.TrimEnd("/")
$legacy = Get-PageFacts -Name "about_legacy_page_id_315" -Url "$base/?page_id=315"
$canonical = Get-PageFacts -Name "about_canonical" -Url "$base/about/"

$checks = @(
	[ordered]@{
		name = "legacy_status_200"
		pass = $legacy.status -eq 200
		detail = "Legacy owner-reported page_id URL must return HTTP 200."
	},
	[ordered]@{
		name = "canonical_status_200"
		pass = $canonical.status -eq 200
		detail = "Canonical /about/ route must return HTTP 200."
	},
	[ordered]@{
		name = "legacy_alias_header"
		pass = $legacy.routeAlias -eq "page_id-315-about"
		detail = "Legacy page_id route must expose the controlled About alias header."
	},
	[ordered]@{
		name = "trust_route_guard"
		pass = $legacy.routeGuard -eq "trust-route-early-render" -and $canonical.routeGuard -eq "trust-route-early-render"
		detail = "Both routes must be served by the controlled trust route guard."
	},
	[ordered]@{
		name = "canonical_signal"
		pass = $legacy.canonical -eq "$base/about/" -and $canonical.canonical -eq "$base/about/"
		detail = "Both routes must declare /about/ as canonical."
	},
	[ordered]@{
		name = "title_and_h1"
		pass = $legacy.title.Contains("Jus-Tice") -and $legacy.h1.Contains("Jus-Tice") -and $canonical.title.Contains("Jus-Tice") -and $canonical.h1.Contains("Jus-Tice")
		detail = "Both routes must expose About page title/H1 content."
	},
	[ordered]@{
		name = "not_noindex"
		pass = -not $legacy.hasNoindex -and -not $canonical.hasNoindex
		detail = "About route must not emit noindex."
	},
	[ordered]@{
		name = "layout_and_cta_signals"
		pass = $legacy.hasHeader -and $legacy.hasFooter -and $legacy.hasContactCta -and $legacy.hasLawyersCta -and $canonical.hasHeader -and $canonical.hasFooter -and $canonical.hasContactCta -and $canonical.hasLawyersCta
		detail = "About route must keep header, footer, contact CTA and lawyers CTA signals."
	}
)

$failed = @($checks | Where-Object { -not $_.pass })

$summary = [ordered]@{
	checkedAt        = (Get-Date).ToUniversalTime().ToString("o")
	baseUrl          = $base
	pass             = $failed.Count -eq 0
	failed           = $failed
	checks           = $checks
	legacy           = $legacy
	canonical        = $canonical
	classification   = if ($failed.Count -eq 0) { "LIVE_OK_LEGACY_ALIAS_CANONICAL_OK" } else { "ABOUT_ROUTE_RISK" }
	note             = "Read-only live About route check. It does not change CMS content, redirects, canonicals, noindex, sitemap, taxonomies, menus, leads, CRM records, invoices, payments, or provider settings."
	honestyStatement = "Passing this gate proves the owner-reported About URL and canonical route respond with expected technical signals. It does not prove Google indexing, rankings, Search Console state, or revenue."
}

$summary | ConvertTo-Json -Depth 10

if (-not $summary.pass) {
	exit 1
}
