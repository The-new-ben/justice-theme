param(
	[string] $Url = "https://jus-tice.co.il/"
)

$ErrorActionPreference = "Stop"

function Get-Attr {
	param(
		[string] $Tag,
		[string] $Name
	)

	$pattern = "\b" + [regex]::Escape($Name) + "\s*=\s*([`"'])(.*?)\1"
	$match = [regex]::Match($Tag, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)
	if ($match.Success) {
		return [System.Net.WebUtility]::HtmlDecode($match.Groups[2].Value.Trim())
	}

	return $null
}

$cacheBust = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$separator = if ($Url.Contains("?")) { "&" } else { "?" }
$checkUrl = "$Url${separator}cachebust=homepage-visual-assets-$cacheBust"

try {
	$response = Invoke-WebRequest -UseBasicParsing -Uri $checkUrl -MaximumRedirection 5 -TimeoutSec 30 -Headers @{
		"User-Agent" = "Jus-Tice homepage visual assets checker/1.0"
	}
	$html = [string] $response.Content
} catch {
	[ordered]@{
		checkedAt = (Get-Date).ToUniversalTime().ToString("o")
		url = $checkUrl
		pass = $false
		error = $_.Exception.Message
	} | ConvertTo-Json -Depth 6
	exit 2
}

$imageTags = [regex]::Matches($html, "<img\b[^>]*>", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$images = foreach ($match in $imageTags) {
	$tag = $match.Value
	$src = Get-Attr -Tag $tag -Name "src"
	$alt = Get-Attr -Tag $tag -Name "alt"
	$width = Get-Attr -Tag $tag -Name "width"
	$height = Get-Attr -Tag $tag -Name "height"
	$loading = Get-Attr -Tag $tag -Name "loading"
	$decoding = Get-Attr -Tag $tag -Name "decoding"
	$fetchpriority = Get-Attr -Tag $tag -Name "fetchpriority"
	$isDecorative = ($src -match "favicon|logo|brand" -and $alt -eq "")

	[ordered]@{
		src = $src
		alt = $alt
		width = $width
		height = $height
		loading = $loading
		decoding = $decoding
		fetchpriority = $fetchpriority
		isDecorative = $isDecorative
		hasAltAttribute = ($null -ne $alt)
		hasDimensions = (-not [string]::IsNullOrWhiteSpace($width) -and -not [string]::IsNullOrWhiteSpace($height))
		hasLoading = (-not [string]::IsNullOrWhiteSpace($loading))
		hasDecoding = (-not [string]::IsNullOrWhiteSpace($decoding))
	}
}

$missingAltAttribute = @($images | Where-Object { -not $_.hasAltAttribute })
$emptyNonDecorativeAlt = @($images | Where-Object { $_.hasAltAttribute -and $_.alt -eq "" -and -not $_.isDecorative })
$missingDimensions = @($images | Where-Object { -not $_.hasDimensions })
$missingLoading = @($images | Where-Object { -not $_.hasLoading })
$missingDecoding = @($images | Where-Object { -not $_.hasDecoding })
$heroImages = @($images | Where-Object { $_.src -match "homepage-legal-help-hero" })
$heroReady = ($heroImages.Count -gt 0 -and (@($heroImages | Where-Object {
	$_.hasDimensions -and
	$_.loading -eq "eager" -and
	$_.fetchpriority -eq "high" -and
	-not [string]::IsNullOrWhiteSpace($_.alt)
}).Count -gt 0))

$failures = @()
if ($images.Count -eq 0) { $failures += "No img elements found on homepage." }
if ($missingAltAttribute.Count -gt 0) { $failures += "One or more images are missing an alt attribute." }
if ($emptyNonDecorativeAlt.Count -gt 0) { $failures += "One or more non-decorative images have empty alt text." }
if ($missingDimensions.Count -gt 0) { $failures += "One or more images are missing width/height attributes." }
if ($missingLoading.Count -gt 0) { $failures += "One or more images are missing loading attributes." }
if ($missingDecoding.Count -gt 0) { $failures += "One or more images are missing decoding attributes." }
if (-not $heroReady) { $failures += "Homepage hero image is missing or is not marked eager/high-priority with dimensions and alt text." }

$summary = [ordered]@{
	checkedAt = (Get-Date).ToUniversalTime().ToString("o")
	url = $checkUrl
	status = [int] $response.StatusCode
	pass = ($failures.Count -eq 0)
	imageCount = $images.Count
	heroImageCount = $heroImages.Count
	heroReady = $heroReady
	missingAltAttributeCount = $missingAltAttribute.Count
	emptyNonDecorativeAltCount = $emptyNonDecorativeAlt.Count
	missingDimensionsCount = $missingDimensions.Count
	missingLoadingCount = $missingLoading.Count
	missingDecodingCount = $missingDecoding.Count
	failures = $failures
	images = $images
	honestyStatement = "This read-only check verifies rendered image markup basics for homepage UX, accessibility, and layout stability. It does not prove image licensing, Search Console image indexing, Lighthouse LCP, or final visual quality."
}

$summary | ConvertTo-Json -Depth 10

if (-not $summary.pass) {
	exit 1
}
