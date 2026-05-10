param(
    [string]$SiteUrl = "https://jus-tice.co.il",
    [string]$OutDir = "project-control\exports",
    [switch]$Authenticated
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function Normalize-SiteUrl {
    param([string]$Url)
    return $Url.TrimEnd("/")
}

function Strip-Html {
    param([string]$Html)
    if ([string]::IsNullOrWhiteSpace($Html)) { return "" }
    $text = [regex]::Replace($Html, "<script[\s\S]*?</script>", " ", "IgnoreCase")
    $text = [regex]::Replace($text, "<style[\s\S]*?</style>", " ", "IgnoreCase")
    $text = [regex]::Replace($text, "<[^>]+>", " ")
    $text = [System.Net.WebUtility]::HtmlDecode($text)
    return ([regex]::Replace($text, "\s+", " ")).Trim()
}

function Get-WordCount {
    param([string]$Text)
    if ([string]::IsNullOrWhiteSpace($Text)) { return 0 }
    return (($Text -split "\s+") | Where-Object { $_ -ne "" }).Count
}

function Get-ContentHash {
    param([string]$Text)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
    return ([System.BitConverter]::ToString($sha.ComputeHash($bytes))).Replace("-", "").ToLowerInvariant()
}

function Get-Rendered {
    param($Object, [string]$Name)
    if ($null -eq $Object.$Name) { return "" }
    if ($null -ne $Object.$Name.rendered) { return [string]$Object.$Name.rendered }
    return [string]$Object.$Name
}

function Get-InternalLinks {
    param([string]$Html, [string]$SiteHost)
    if ([string]::IsNullOrWhiteSpace($Html)) { return @() }
    $matches = [regex]::Matches($Html, "href\s*=\s*['""]([^'""]+)['""]", "IgnoreCase")
    $links = New-Object System.Collections.Generic.List[string]
    foreach ($m in $matches) {
        $href = $m.Groups[1].Value
        if ($href -match "^/" -or $href -like "*$SiteHost*") {
            $links.Add($href)
        }
    }
    return $links | Sort-Object -Unique
}

function Invoke-WpGet {
    param([string]$Url)
    $headers = @{}
    if ($Authenticated) {
        if (-not $env:JUSTICE_WP_USER -or -not $env:JUSTICE_WP_APP_PASSWORD) {
            throw "Authenticated export requested but JUSTICE_WP_USER or JUSTICE_WP_APP_PASSWORD is missing."
        }
        $pair = "$($env:JUSTICE_WP_USER):$($env:JUSTICE_WP_APP_PASSWORD)"
        $headers["Authorization"] = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($pair))
    }
    $response = Invoke-WebRequest -Uri $Url -Headers $headers -UseBasicParsing -TimeoutSec 60
    return $response
}

function Get-WpCollection {
    param(
        [string]$Base,
        [string]$RestBase,
        [string]$Fields
    )
    $all = New-Object System.Collections.Generic.List[object]
    $page = 1
    $perPage = 100
    while ($true) {
        $url = "$Base/wp-json/wp/v2/$RestBase`?per_page=$perPage&page=$page"
        if ($Fields) { $url += "&_fields=$Fields" }
        try {
            $response = Invoke-WpGet -Url $url
        } catch {
            Write-Warning "Failed endpoint $RestBase page $page`: $($_.Exception.Message)"
            break
        }
        $content = $response.Content.TrimStart([char]0xFEFF)
        $parsed = $content | ConvertFrom-Json
        if ($parsed -is [System.Array]) {
            $items = $parsed
        } else {
            $items = @($parsed)
        }
        foreach ($item in $items) { $all.Add($item) }
        $totalPages = 1
        if ($response.Headers["X-WP-TotalPages"]) {
            $totalPages = [int]$response.Headers["X-WP-TotalPages"]
        }
        if ($page -ge $totalPages -or $items.Count -eq 0) { break }
        $page++
    }
    return $all
}

$site = Normalize-SiteUrl $SiteUrl
$hostName = ([Uri]$site).Host
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$contentFields = "id,date,modified,slug,status,link,type,title,content,excerpt,author,featured_media,parent,categories,tags,practice-areas,city"
$termFields = "id,count,description,link,name,slug,taxonomy,parent"
$mediaFields = "id,date,modified,slug,status,link,title,caption,alt_text,media_type,mime_type,source_url"

$collections = [ordered]@{
    posts = Get-WpCollection -Base $site -RestBase "posts" -Fields $contentFields
    pages = Get-WpCollection -Base $site -RestBase "pages" -Fields $contentFields
    articles = Get-WpCollection -Base $site -RestBase "articles" -Fields $contentFields
    lawyers = Get-WpCollection -Base $site -RestBase "justice_lawyer" -Fields $contentFields
    categories = Get-WpCollection -Base $site -RestBase "categories" -Fields $termFields
    tags = Get-WpCollection -Base $site -RestBase "tags" -Fields $termFields
    practice_areas = Get-WpCollection -Base $site -RestBase "practice-areas" -Fields $termFields
    city = Get-WpCollection -Base $site -RestBase "city" -Fields $termFields
    media = Get-WpCollection -Base $site -RestBase "media" -Fields $mediaFields
    menus = Get-WpCollection -Base $site -RestBase "menu-items" -Fields ""
}

$taxonomies = @()
try {
    $taxJson = (Invoke-WpGet -Url "$site/wp-json/wp/v2/taxonomies").Content.TrimStart([char]0xFEFF) | ConvertFrom-Json
    $taxonomies = $taxJson.PSObject.Properties | ForEach-Object {
        [pscustomobject]@{
            taxonomy = $_.Name
            rest_base = $_.Value.rest_base
            types = ($_.Value.types -join "|")
            hierarchical = $_.Value.hierarchical
        }
    }
} catch {
    Write-Warning "Could not export taxonomies: $($_.Exception.Message)"
}

function Convert-ContentRows {
    param([array]$Items)
    $rows = New-Object System.Collections.Generic.List[object]
    foreach ($item in $Items) {
        $title = Strip-Html (Get-Rendered $item "title")
        $contentHtml = Get-Rendered $item "content"
        $contentText = Strip-Html $contentHtml
        $excerpt = Strip-Html (Get-Rendered $item "excerpt")
        $links = @(Get-InternalLinks -Html $contentHtml -SiteHost $hostName)
        $notes = "PUBLIC_REST_EXPORT"
        if ($contentText -match "NOT VERIFIED|BLOCKED|project-control|GSC|CRM|CMS|Next action|owner|dev team|source audit|publication blocker") {
            $notes += ";INTERNAL_MARKER_RISK"
        }
        $rows.Add([pscustomobject]@{
            id = $item.id
            post_type = $item.type
            status = $item.status
            current_url = $item.link
            current_slug = $item.slug
            proposed_english_slug = ""
            title = $title
            h1 = $title
            seo_title = ""
            meta_description = ""
            language = "he"
            word_count = Get-WordCount $contentText
            content_hash = Get-ContentHash $contentText
            excerpt = $excerpt
            date_published = $item.date
            date_modified = $item.modified
            author = $item.author
            categories = (($item.categories | ForEach-Object { $_ }) -join "|")
            tags = (($item.tags | ForEach-Object { $_ }) -join "|")
            practice_area = (($item.'practice-areas' | ForEach-Object { $_ }) -join "|")
            city = (($item.city | ForEach-Object { $_ }) -join "|")
            parent_page = $item.parent
            canonical_url = ""
            internal_links_out = ($links -join "|")
            internal_links_in = ""
            media_count = ([regex]::Matches($contentHtml, "<img\b", "IgnoreCase")).Count
            featured_image = $item.featured_media
            top_keyword = ""
            secondary_keywords = ""
            search_intent = ""
            topic_cluster = ""
            pillar_candidate = ""
            duplicate_title_risk = ""
            duplicate_topic_risk = ""
            cannibalization_group = ""
            gsc_clicks_3m = "UNKNOWN"
            gsc_impressions_3m = "UNKNOWN"
            gsc_ctr_3m = "UNKNOWN"
            gsc_position_3m = "UNKNOWN"
            gsc_clicks_12m = "UNKNOWN"
            gsc_impressions_12m = "UNKNOWN"
            traffic_risk = "UNKNOWN"
            content_quality_score = ""
            recommended_action = ""
            redirect_needed = ""
            notes = $notes
        })
    }
    return $rows
}

$postRows = Convert-ContentRows $collections.posts
$pageRows = Convert-ContentRows $collections.pages
$articleRows = Convert-ContentRows $collections.articles
$lawyerRows = Convert-ContentRows $collections.lawyers
$allContent = @($postRows + $pageRows + $articleRows + $lawyerRows)

$internalLinks = foreach ($row in $allContent) {
    foreach ($target in (($row.internal_links_out -split "\|") | Where-Object { $_ })) {
        [pscustomobject]@{
            source_url = $row.current_url
            target_url = $target
            anchor_text = ""
            link_type = ""
            reason = "Extracted from public rendered HTML"
            priority = ""
            status = "EXPORTED"
        }
    }
}

$urls = $allContent | Select-Object id, post_type, status, current_url, current_slug, proposed_english_slug, title, traffic_risk, redirect_needed, notes

$postRows | Export-Csv -Path (Join-Path $OutDir "all-posts-export.csv") -NoTypeInformation -Encoding UTF8
$pageRows | Export-Csv -Path (Join-Path $OutDir "all-pages-export.csv") -NoTypeInformation -Encoding UTF8
$articleRows | Export-Csv -Path (Join-Path $OutDir "all-articles-export.csv") -NoTypeInformation -Encoding UTF8
$allContent | Export-Csv -Path (Join-Path $OutDir "all-content-export.csv") -NoTypeInformation -Encoding UTF8
$collections.categories | Export-Csv -Path (Join-Path $OutDir "all-categories-export.csv") -NoTypeInformation -Encoding UTF8
$collections.tags | Export-Csv -Path (Join-Path $OutDir "all-tags-export.csv") -NoTypeInformation -Encoding UTF8
$collections.practice_areas | Export-Csv -Path (Join-Path $OutDir "all-practice-areas-export.csv") -NoTypeInformation -Encoding UTF8
$collections.city | Export-Csv -Path (Join-Path $OutDir "all-cities-export.csv") -NoTypeInformation -Encoding UTF8
$taxonomies | Export-Csv -Path (Join-Path $OutDir "all-taxonomies-export.csv") -NoTypeInformation -Encoding UTF8
$collections.menus | Export-Csv -Path (Join-Path $OutDir "all-menus-export.csv") -NoTypeInformation -Encoding UTF8
$collections.media | Export-Csv -Path (Join-Path $OutDir "all-media-export.csv") -NoTypeInformation -Encoding UTF8
$internalLinks | Export-Csv -Path (Join-Path $OutDir "all-internal-links-export.csv") -NoTypeInformation -Encoding UTF8
$urls | Export-Csv -Path (Join-Path $OutDir "all-url-export.csv") -NoTypeInformation -Encoding UTF8
$allContent | Export-Csv -Path "project-control\content-master-inventory.csv" -NoTypeInformation -Encoding UTF8

Write-Output "Export complete."
Write-Output "Content rows: $($allContent.Count)"
Write-Output "Internal links: $(@($internalLinks).Count)"
Write-Output "Output: $OutDir"
