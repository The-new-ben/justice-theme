param(
	[string] $BaseUrl = "https://jus-tice.co.il",
	[string] $ExpectedPhone = "972525101555"
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

function Get-Attribute {
	param(
		[string] $Tag,
		[string] $Name
	)

	$match = [regex]::Match($Tag, "(?i)\s$([regex]::Escape($Name))\s*=\s*""([^""]*)""")
	if ($match.Success) {
		return $match.Groups[1].Value
	}

	return ""
}

function Get-WhatsAppLinks {
	param(
		[string] $Html
	)

	$tags = [regex]::Matches($Html, '(?is)<a\b[^>]*\bhref="[^"]*(?:wa\.me|whatsapp)[^"]*"[^>]*>')
	foreach ($tagMatch in $tags) {
		$tag = $tagMatch.Value
		[ordered]@{
			href        = Get-Attribute -Tag $tag -Name "href"
			surface     = Get-Attribute -Tag $tag -Name "data-whatsapp-surface"
			utmSource   = Get-Attribute -Tag $tag -Name "data-lead-utm-source"
			utmMedium   = Get-Attribute -Tag $tag -Name "data-lead-utm-medium"
			utmCampaign = Get-Attribute -Tag $tag -Name "data-lead-utm-campaign"
			target      = Get-Attribute -Tag $tag -Name "target"
			rel         = Get-Attribute -Tag $tag -Name "rel"
		}
	}
}

$base = $BaseUrl.TrimEnd("/")
$cacheBust = [int][double]::Parse((Get-Date -UFormat %s))

$pages = @(
	@{
		Name = "homepage"
		Path = "/"
		MinimumLinks = 8
		RequiredSurfaces = @(
			"mobile_menu",
			"site_header",
			"homepage_hero",
			"homepage_customer_handoff",
			"ask_lawyer_form",
			"homepage_lawyer_fast_fit",
			"site_footer",
			"footer_trust_path",
			"floating_whatsapp"
		)
	},
	@{
		Name = "contact"
		Path = "/contact/"
		MinimumLinks = 5
		RequiredSurfaces = @("mobile_menu", "site_header", "site_footer", "footer_trust_path", "floating_whatsapp")
	},
	@{
		Name = "lawyers_directory"
		Path = "/lawyers/"
		MinimumLinks = 5
		RequiredSurfaces = @("mobile_menu", "site_header", "site_footer", "footer_trust_path", "floating_whatsapp")
	},
	@{
		Name = "lawyer_plans"
		Path = "/lawyer-plans/"
		MinimumLinks = 5
		RequiredSurfaces = @("mobile_menu", "site_header", "site_footer", "footer_trust_path", "floating_whatsapp")
	},
	@{
		Name = "lawyer_registration"
		Path = "/lawyer-registration/"
		MinimumLinks = 5
		RequiredSurfaces = @("mobile_menu", "site_header", "site_footer", "footer_trust_path", "floating_whatsapp")
	}
)

$pageResults = foreach ($page in $pages) {
	$url = "$base$($page.Path)?cachebust=whatsapp-router-$cacheBust"
	$checks = New-Object System.Collections.ArrayList
	$status = $null
	$bodyLength = 0
	$errorMessage = $null
	$links = @()

	try {
		$response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 25 -Headers @{
			"User-Agent" = "Jus-Tice whatsapp intake router checker/1.0"
		}

		$status = [int] $response.StatusCode
		$html = [string] $response.Content
		$bodyLength = $html.Length
		$links = @(Get-WhatsAppLinks -Html $html)
		$surfaces = @($links | ForEach-Object { $_.surface } | Where-Object { $_ } | Sort-Object -Unique)

		Add-Check $checks "status_200" ($status -eq 200) "$($page.Name) returned HTTP $status."
		Add-Check $checks "minimum_whatsapp_links" ($links.Count -ge [int] $page.MinimumLinks) "$($page.Name) has $($links.Count) WhatsApp links; expected at least $($page.MinimumLinks)."

		foreach ($surface in $page.RequiredSurfaces) {
			Add-Check $checks "surface_$surface" ($surfaces -contains $surface) "$($page.Name) should expose WhatsApp surface $surface."
		}

		$linksWithMissingPhone = @($links | Where-Object { $_.href -notmatch "wa\.me/$ExpectedPhone" })
		$linksWithoutText = @($links | Where-Object { $_.href -notmatch "[?&]text=" })
		$linksWithoutSurface = @($links | Where-Object { -not $_.surface })
		$linksWithoutSource = @($links | Where-Object { -not $_.utmSource })
		$linksWithoutMedium = @($links | Where-Object { -not $_.utmMedium })
		$linksWithoutCampaign = @($links | Where-Object { -not $_.utmCampaign })
		$linksWithoutTarget = @($links | Where-Object { $_.target -ne "_blank" })
		$linksWithoutNoopener = @($links | Where-Object { $_.rel -notmatch "(^|\s)noopener(\s|$)" })

		Add-Check $checks "expected_owner_phone" ($linksWithMissingPhone.Count -eq 0) "All WhatsApp links should point to wa.me/$ExpectedPhone."
		Add-Check $checks "prefilled_message" ($linksWithoutText.Count -eq 0) "All WhatsApp links should include a prefilled text message."
		Add-Check $checks "surface_attribution" ($linksWithoutSurface.Count -eq 0) "All WhatsApp links should include data-whatsapp-surface."
		Add-Check $checks "utm_source_attribution" ($linksWithoutSource.Count -eq 0) "All WhatsApp links should include data-lead-utm-source."
		Add-Check $checks "utm_medium_attribution" ($linksWithoutMedium.Count -eq 0) "All WhatsApp links should include data-lead-utm-medium."
		Add-Check $checks "utm_campaign_attribution" ($linksWithoutCampaign.Count -eq 0) "All WhatsApp links should include data-lead-utm-campaign."
		Add-Check $checks "external_target" ($linksWithoutTarget.Count -eq 0) "All WhatsApp links should open in a new tab/app context."
		Add-Check $checks "noopener_rel" ($linksWithoutNoopener.Count -eq 0) "All WhatsApp links should use rel=noopener."

		if ($page.Name -eq "homepage") {
			$lawyerFastFit = @($links | Where-Object { $_.surface -eq "homepage_lawyer_fast_fit" })
			Add-Check $checks "lawyer_acquisition_surface" ($lawyerFastFit.Count -gt 0) "Homepage should expose a lawyer acquisition WhatsApp path."
			Add-Check $checks "lawyer_acquisition_campaign" (@($lawyerFastFit | Where-Object { $_.utmCampaign -eq "lawyer_acquisition" -and $_.utmMedium -eq "lawyer_whatsapp" }).Count -gt 0) "Lawyer acquisition WhatsApp should use lawyer acquisition attribution."
		}
	} catch {
		$errorMessage = $_.Exception.Message
		Add-Check $checks "request_succeeded" $false $errorMessage
	}

	$failed = @($checks | Where-Object { -not $_.pass })

	[ordered]@{
		name          = $page.Name
		url           = $url
		status        = $status
		ok            = $failed.Count -eq 0
		bodyLength    = $bodyLength
		whatsappLinks = $links.Count
		surfaces      = @($links | ForEach-Object { $_.surface } | Where-Object { $_ } | Sort-Object -Unique)
		failed        = $failed
		checks        = $checks
		error         = $errorMessage
	}
}

$failedPages = @($pageResults | Where-Object { -not $_.ok })

$summary = [ordered]@{
	checkedAt = (Get-Date).ToUniversalTime().ToString("o")
	baseUrl   = $base
	pass      = $failedPages.Count -eq 0
	failed    = $failedPages
	results   = $pageResults
	note      = "Read-only WhatsApp intake-router check. It does not click WhatsApp, send messages, create leads, contact users/lawyers, change CRM, create invoices, or charge money."
}

$summary | ConvertTo-Json -Depth 10

if (-not $summary.pass) {
	exit 1
}
