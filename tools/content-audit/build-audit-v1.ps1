param(
    [string]$InventoryPath = "project-control\content-master-inventory.csv",
    [string]$ExportDir = "project-control\exports",
    [string]$ProjectControlDir = "project-control"
)

$ErrorActionPreference = "Stop"

function Read-CsvIfExists {
    param([string]$Path)
    if (Test-Path $Path) { return @(Import-Csv $Path) }
    return @()
}

function Normalize-TitleKey {
    param([string]$Text)
    if ([string]::IsNullOrWhiteSpace($Text)) { return "" }
    $decoded = [System.Net.WebUtility]::HtmlDecode($Text).ToLowerInvariant()
    $decoded = [regex]::Replace($decoded, "[\p{P}\p{S}\s]+", " ")
    return $decoded.Trim()
}

function Get-UrlPathSlug {
    param([string]$Url, [string]$FallbackSlug)
    if ([string]::IsNullOrWhiteSpace($Url)) { return $FallbackSlug }
    try {
        $uri = [Uri]$Url
        $path = $uri.AbsolutePath.Trim("/")
        if ([string]::IsNullOrWhiteSpace($path)) { return "home" }
        $parts = $path -split "/"
        return [System.Uri]::UnescapeDataString($parts[$parts.Count - 1])
    } catch {
        return $FallbackSlug
    }
}

function Test-CleanEnglishSlug {
    param([string]$Slug)
    if ([string]::IsNullOrWhiteSpace($Slug)) { return $false }
    return ($Slug -match "^[a-z0-9]+(-[a-z0-9]+)*$" -and $Slug.Length -le 80)
}

function Test-HebrewOrEncodedUrl {
    param([string]$Url)
    if ([string]::IsNullOrWhiteSpace($Url)) { return $false }
    $decoded = [System.Uri]::UnescapeDataString($Url)
    return ($Url -match "%d7|%D7" -or $decoded -match "[\u0590-\u05FF]")
}

function Get-ClusterForTitle {
    param([string]$Title)
    if ($Title -match "גירוש|מזונות|משמורת|זמני שהות|חלוקת רכוש|יישוב סכסוך|אפוטרופ|ידועים בציבור|כתובה") { return "family-law-divorce" }
    if ($Title -match "פלילי|חקירה|כתב אישום|מעצר|סמים|עבירות מין|צווארון לבן") { return "criminal-law" }
    if ($Title -match "מקרקעין|נדלן|דירה|חוזה מכר|טאבו|בנייה|התחדשות עירונית|תמא") { return "real-estate" }
    if ($Title -match "רשלנות רפואית|לידה|הריון|ניתוח|אבחון|רופא|בית חולים") { return "medical-malpractice" }
    if ($Title -match "נזיקין|תאונת עבודה|תאונות דרכים|פיצויים|ביטוח לאומי") { return "personal-injury" }
    if ($Title -match "תעבורה|נהיגה בשכרות|רישיון|רשיון|דוח|קנס|מהירות") { return "traffic-law" }
    if ($Title -match "דיני עבודה|פיטורין|פיטורים|שכר|עובד|מעסיק|התפטרות") { return "employment-law" }
    if ($Title -match "ירושה|צוואה|עזבון|עיזבון") { return "inheritance-wills" }
    if ($Title -match "סייבר|פרטיות|מאגר מידע|אבטחת מידע") { return "cyber-privacy" }
    if ($Title -match "קורונה|נגיף|מגפה|חירום") { return "outdated-corona-legacy" }
    return "needs-classification"
}

function Get-KnownSlugSuggestion {
    param([string]$Title, [string]$PostType)
    if ($PostType -eq "justice_lawyer" -and $Title -match "מאיה|מיה|Rotenberg|רוטנברג") { return "advocate-maya-rotenberg" }
    if ($Title -match "עורך דין גירושין") { return "divorce-lawyer" }
    if ($Title -match "גירושין בהסכמה") { return "consensual-divorce" }
    if ($Title -match "גישור גירושין") { return "divorce-mediation" }
    if ($Title -match "מזונות ילדים|מזונות") { return "child-support" }
    if ($Title -match "משמורת ילדים|זמני שהות|משמורת") { return "child-custody" }
    if ($Title -match "חלוקת רכוש") { return "divorce-property-division" }
    if ($Title -match "יישוב סכסוך") { return "family-dispute-resolution" }
    if ($Title -match "עורך דין פלילי") { return "criminal-lawyer" }
    if ($Title -match "חקירה במשטרה") { return "police-investigation" }
    if ($Title -match "כתב אישום") { return "indictment" }
    if ($Title -match "מעצר") { return "pretrial-detention" }
    if ($Title -match "עבירות סמים") { return "drug-offenses" }
    if ($Title -match "עורך דין תעבורה") { return "traffic-lawyer" }
    if ($Title -match "נהיגה בשכרות") { return "drunk-driving" }
    if ($Title -match "שלילת רישיון|שלילת רשיון") { return "license-suspension" }
    if ($Title -match "תאונת דרכים") { return "car-accident-lawyer" }
    if ($Title -match "עורך דין מקרקעין") { return "real-estate-lawyer" }
    if ($Title -match "קניית דירה") { return "buying-apartment" }
    if ($Title -match "חוזה מכר") { return "real-estate-purchase-agreement" }
    if ($Title -match "טאבו") { return "land-registry" }
    if ($Title -match "ליקויי בנייה") { return "construction-defects" }
    if ($Title -match "רשלנות רפואית") { return "medical-malpractice-lawyer" }
    if ($Title -match "רשלנות.*הריון") { return "pregnancy-malpractice" }
    if ($Title -match "רשלנות.*לידה") { return "birth-malpractice" }
    if ($Title -match "עורך דין נזיקין") { return "personal-injury-lawyer" }
    if ($Title -match "תאונת עבודה") { return "work-accident-lawyer" }
    if ($Title -match "ביטוח לאומי") { return "national-insurance-lawyer" }
    if ($Title -match "עורך דין ירושה") { return "inheritance-lawyer" }
    if ($Title -match "צוואה") { return "will" }
    return ""
}

function Get-PreferredPillarSlug {
    param([string]$Cluster)
    switch ($Cluster) {
        "family-law-divorce" { return "divorce-lawyer" }
        "criminal-law" { return "criminal-lawyer" }
        "real-estate" { return "real-estate-lawyer" }
        "medical-malpractice" { return "medical-malpractice-lawyer" }
        "personal-injury" { return "personal-injury-lawyer" }
        "traffic-law" { return "traffic-lawyer" }
        "employment-law" { return "employment-lawyer" }
        "inheritance-wills" { return "inheritance-lawyer" }
        "cyber-privacy" { return "cyber-privacy-law" }
        default { return "" }
    }
}

function Get-QualityRecommendation {
    param(
        [int]$WordCount,
        [bool]$IsThin,
        [bool]$IsOutdated,
        [bool]$IsDuplicate,
        [bool]$IsSpam,
        [bool]$InternalMarkerRisk,
        [string]$Cluster
    )
    if ($IsSpam) { return "SPAM_REVIEW" }
    if ($InternalMarkerRisk) { return "REWRITE" }
    if ($IsDuplicate) { return "MERGE" }
    if ($IsOutdated) { return "REWRITE" }
    if ($Cluster -eq "needs-classification") { return "REVIEW_CLASSIFY" }
    if ($WordCount -ge 2500 -and $Cluster -ne "outdated-corona-legacy") { return "KEEP_OR_MAKE_PILLAR_REVIEW" }
    if ($IsThin) { return "EXPAND" }
    return "KEEP_OR_SUPPORT_PILLAR_REVIEW"
}

$inventory = Read-CsvIfExists $InventoryPath
if ($inventory.Count -eq 0) {
    throw "Inventory not found or empty: $InventoryPath"
}

$titleGroups = $inventory | Group-Object { Normalize-TitleKey $_.title } | Where-Object { $_.Name -and $_.Count -gt 1 }
$duplicateTitleKeys = @{}
foreach ($group in $titleGroups) { $duplicateTitleKeys[$group.Name] = $true }

$qualityRows = foreach ($row in $inventory) {
    $wordCount = [int]($row.word_count)
    $titleKey = Normalize-TitleKey $row.title
    $cluster = Get-ClusterForTitle $row.title
    $isThin = $wordCount -lt 800
    $isOutdated = (($row.date_modified -match "^20(1[0-9]|20|21)") -or $row.title -match "קורונה|נגיף|מגפה|חירום")
    $isSpam = ($row.title -match "קזינו|casino|הימורים|betting|gaming")
    $internalMarkerRisk = ($row.notes -match "INTERNAL_MARKER_RISK")
    $hasLinks = -not [string]::IsNullOrWhiteSpace($row.internal_links_out)
    $score = 5
    if ($wordCount -ge 2500) { $score += 2 } elseif ($wordCount -ge 1200) { $score += 1 } elseif ($wordCount -lt 500) { $score -= 2 }
    if ($hasLinks) { $score += 1 } else { $score -= 1 }
    if ($isOutdated) { $score -= 2 }
    if ($isSpam) { $score = 1 }
    if ($internalMarkerRisk) { $score = [Math]::Min($score, 3) }
    if ($duplicateTitleKeys.ContainsKey($titleKey)) { $score -= 1 }
    $score = [Math]::Max(1, [Math]::Min(10, $score))

    [pscustomobject]@{
        id = $row.id
        url = $row.current_url
        title = $row.title
        word_count = $wordCount
        quality_score_1_10 = $score
        is_thin = $isThin
        is_outdated = $isOutdated
        is_duplicate = $duplicateTitleKeys.ContainsKey($titleKey)
        is_spam = $isSpam
        has_legal_sources = "UNKNOWN_PUBLIC_REST_V1"
        has_practical_steps = "UNKNOWN_PUBLIC_REST_V1"
        has_faq = "UNKNOWN_PUBLIC_REST_V1"
        has_checklist = "UNKNOWN_PUBLIC_REST_V1"
        has_internal_links = $hasLinks
        has_clear_intent = ($cluster -ne "needs-classification")
        has_cta = "UNKNOWN_PUBLIC_REST_V1"
        needs_rewrite = ($isOutdated -or $internalMarkerRisk)
        needs_merge = $duplicateTitleKeys.ContainsKey($titleKey)
        needs_expansion = $isThin
        recommended_action = Get-QualityRecommendation -WordCount $wordCount -IsThin $isThin -IsOutdated $isOutdated -IsDuplicate ($duplicateTitleKeys.ContainsKey($titleKey)) -IsSpam $isSpam -InternalMarkerRisk $internalMarkerRisk -Cluster $cluster
        notes = "PUBLIC_REST_HEURISTIC_V1;cluster=$cluster;traffic_risk=UNKNOWN"
    }
}

$qualityRows | Export-Csv -Path (Join-Path $ProjectControlDir "content-quality-audit.csv") -NoTypeInformation -Encoding UTF8

$urlRows = foreach ($row in $inventory) {
    $currentSlug = Get-UrlPathSlug -Url $row.current_url -FallbackSlug $row.current_slug
    $isClean = Test-CleanEnglishSlug $currentSlug
    $hasHebrewUrl = Test-HebrewOrEncodedUrl $row.current_url
    $suggested = Get-KnownSlugSuggestion -Title $row.title -PostType $row.post_type
    if ($isClean -and -not $hasHebrewUrl) {
        $newSlug = $currentSlug
        $status = "KEEP_CURRENT_CLEAN_SLUG"
    } elseif ($suggested) {
        $newSlug = $suggested
        $status = "PROPOSED_ENGLISH_SLUG_NEEDS_REVIEW"
    } else {
        $newSlug = "NEEDS_ENGLISH_SLUG_REVIEW"
        $status = "NEEDS_EDITORIAL_SLUG_MAPPING"
    }
    $newUrl = ""
    if ($newSlug -ne "NEEDS_ENGLISH_SLUG_REVIEW") {
        if ($row.post_type -eq "justice_lawyer") {
            $newUrl = "https://jus-tice.co.il/lawyers/$newSlug/"
        } else {
            $newUrl = "https://jus-tice.co.il/$newSlug/"
        }
    }
    $redirectRequired = if (($newUrl -and $newUrl -ne $row.current_url) -or $row.current_url -match "^http://") { "YES_AFTER_APPROVAL" } else { "NO" }
    [pscustomobject]@{
        old_url = $row.current_url
        old_slug = $currentSlug
        new_url = $newUrl
        new_slug = $newSlug
        post_id = $row.id
        post_type = $row.post_type
        title = $row.title
        primary_keyword = ""
        search_intent = ""
        topic_cluster = Get-ClusterForTitle $row.title
        gsc_clicks_3m = "UNKNOWN"
        gsc_impressions_3m = "UNKNOWN"
        traffic_risk = "UNKNOWN"
        redirect_required = $redirectRequired
        canonical_update_required = if ($redirectRequired -like "YES*") { "YES_AFTER_APPROVAL" } else { "REVIEW" }
        internal_links_update_required = if ($redirectRequired -like "YES*") { "YES_AFTER_APPROVAL" } else { "REVIEW" }
        sitemap_update_required = if ($redirectRequired -like "YES*") { "YES_AFTER_APPROVAL" } else { "REVIEW" }
        status = $status
        notes = "PUBLIC_REST_URL_MAP_V1;NO_URL_CHANGE_EXECUTED"
    }
}

$slugConflicts = $urlRows | Where-Object { $_.new_slug -and $_.new_slug -ne "NEEDS_ENGLISH_SLUG_REVIEW" } | Group-Object new_slug | Where-Object { $_.Count -gt 1 }
$conflictSet = @{}
foreach ($g in $slugConflicts) { $conflictSet[$g.Name] = $true }
foreach ($row in $urlRows) {
    if ($conflictSet.ContainsKey($row.new_slug)) {
        $row.status = "TARGET_SLUG_CONFLICT_NEEDS_REVIEW"
        $row.notes += ";duplicate_target_slug"
    }
}
$urlRows | Export-Csv -Path (Join-Path $ProjectControlDir "url-migration-map.csv") -NoTypeInformation -Encoding UTF8

$redirectRows = $urlRows | Where-Object { $_.redirect_required -like "YES*" } | ForEach-Object {
    [pscustomobject]@{
        old_url = $_.old_url
        new_url = $_.new_url
        redirect_type = "301"
        status = "PLANNED_ONLY_NOT_EXECUTED"
        traffic_risk = $_.traffic_risk
        canonical_update_required = $_.canonical_update_required
        internal_links_update_required = $_.internal_links_update_required
        notes = $_.notes
    }
}
$redirectRows | Export-Csv -Path (Join-Path $ProjectControlDir "redirect-map.csv") -NoTypeInformation -Encoding UTF8

$clusterGroups = $inventory | Group-Object { Get-ClusterForTitle $_.title }
$cannibalRows = foreach ($group in $clusterGroups) {
    $clusterRows = @($group.Group)
    $preferredSlug = Get-PreferredPillarSlug -Cluster $group.Name
    $preferred = @()
    if ($preferredSlug) {
        $preferred = @($clusterRows | Where-Object { (Get-UrlPathSlug -Url $_.current_url -FallbackSlug $_.current_slug) -eq $preferredSlug })
    }
    $candidates = $clusterRows | Sort-Object @{ Expression = { [int]$_.word_count }; Descending = $true }
    $best = if ($preferred.Count -gt 0) { $preferred | Select-Object -First 1 } else { $candidates | Select-Object -First 1 }
    $supporting = $candidates | Select-Object -Skip 1 -First 40
    [pscustomobject]@{
        cannibalization_group = $group.Name
        primary_keyword = ""
        search_intent = "NEEDS_MANUAL_INTENT_REVIEW"
        competing_urls = (($candidates | Select-Object -First 80 | ForEach-Object { $_.current_url }) -join "|")
        current_best_url = $best.current_url
        recommended_primary_url = "NEEDS_OWNER_REVIEW"
        supporting_urls = (($supporting | ForEach-Object { $_.current_url }) -join "|")
        pages_to_merge = ""
        pages_to_redirect_later = ""
        pages_to_keep = ""
        notes = if ($preferred.Count -gt 0) { "PUBLIC_REST_HEURISTIC_V1;preferred_clean_pillar_slug_found=$preferredSlug;do_not_redirect_without_GSC_and_owner_approval" } else { "PUBLIC_REST_HEURISTIC_V1;no_preferred_pillar_slug_found;best_by_word_count_only;do_not_redirect_without_GSC_and_owner_approval" }
        owner_approval_required = "YES"
    }
}
$cannibalRows | Export-Csv -Path (Join-Path $ProjectControlDir "cannibalization-map.csv") -NoTypeInformation -Encoding UTF8

$termFiles = @(
    @{ Taxonomy = "category"; Path = Join-Path $ExportDir "all-categories-export.csv" },
    @{ Taxonomy = "post_tag"; Path = Join-Path $ExportDir "all-tags-export.csv" },
    @{ Taxonomy = "practice-areas"; Path = Join-Path $ExportDir "all-practice-areas-export.csv" },
    @{ Taxonomy = "city"; Path = Join-Path $ExportDir "all-cities-export.csv" }
)
$allTerms = foreach ($file in $termFiles) {
    foreach ($term in (Read-CsvIfExists $file.Path)) {
        $nameKey = Normalize-TitleKey $term.name
        $suggestedSlug = Get-KnownSlugSuggestion -Title $term.name -PostType "term"
        if (-not $suggestedSlug -and (Test-CleanEnglishSlug $term.slug)) { $suggestedSlug = $term.slug }
        if (-not $suggestedSlug) { $suggestedSlug = "NEEDS_ENGLISH_SLUG_REVIEW" }
        [pscustomobject]@{
            taxonomy = $file.Taxonomy
            term_id = $term.id
            name = $term.name
            current_slug = $term.slug
            count = $term.count
            canonical_cluster = Get-ClusterForTitle $term.name
            proposed_english_slug = $suggestedSlug
            duplicate_name_group = $nameKey
            recommended_action = if ([int]$term.count -eq 0) { "REVIEW_EMPTY_TERM" } else { "KEEP_OR_MERGE_REVIEW" }
            notes = "PUBLIC_REST_TERM_MAP_V1;NO_TERM_CHANGE_EXECUTED"
        }
    }
}
$termDuplicateKeys = $allTerms | Group-Object duplicate_name_group | Where-Object { $_.Name -and $_.Count -gt 1 }
$termConflictSet = @{}
foreach ($g in $termDuplicateKeys) { $termConflictSet[$g.Name] = $true }
foreach ($term in $allTerms) {
    if ($termConflictSet.ContainsKey($term.duplicate_name_group)) {
        $term.recommended_action = "MERGE_REVIEW"
        $term.notes += ";duplicate_term_name"
    }
}
$allTerms | Export-Csv -Path (Join-Path $ProjectControlDir "category-map.csv") -NoTypeInformation -Encoding UTF8

$topicRows = foreach ($group in $clusterGroups) {
    $clusterRows = @($group.Group)
    $preferredSlug = Get-PreferredPillarSlug -Cluster $group.Name
    $preferred = @()
    if ($preferredSlug) {
        $preferred = @($clusterRows | Where-Object { (Get-UrlPathSlug -Url $_.current_url -FallbackSlug $_.current_slug) -eq $preferredSlug })
    }
    $best = if ($preferred.Count -gt 0) { $preferred | Select-Object -First 1 } else { $clusterRows | Sort-Object @{ Expression = { [int]$_.word_count }; Descending = $true } | Select-Object -First 1 }
    [pscustomobject]@{
        cluster = $group.Name
        pillar_title = $best.title
        pillar_url = $best.current_url
        primary_keyword = ""
        secondary_keywords = ""
        supporting_articles = (($clusterRows | Where-Object { $_.current_url -ne $best.current_url } | Select-Object -First 80 | ForEach-Object { $_.current_url }) -join "|")
        missing_articles = "NEEDS_SERP_REVIEW"
        related_lawyers = "NEEDS_LAWYER_MAPPING"
        related_categories = ""
        related_sources = "NEEDS_SOURCE_AUDIT"
        status = "PUBLIC_REST_HEURISTIC_V1_NEEDS_REVIEW"
        notes = "Pillar chosen by word count only; verify intent, traffic and quality before approval."
    }
}
$topicRows | Export-Csv -Path (Join-Path $ProjectControlDir "topic-clusters.csv") -NoTypeInformation -Encoding UTF8

$linkRows = Read-CsvIfExists (Join-Path $ExportDir "all-internal-links-export.csv") | ForEach-Object {
    $target = $_.target_url
    $linkType = "article_to_internal"
    if ($target -match "lawyers") { $linkType = "article_to_lawyer" }
    elseif ($target -match "practice-areas|category") { $linkType = "article_to_category" }
    elseif ($target -match "divorce-lawyer|criminal-lawyer|real-estate-lawyer|medical-malpractice-lawyer|personal-injury-lawyer") { $linkType = "support_to_pillar" }
    [pscustomobject]@{
        source_url = $_.source_url
        target_url = $_.target_url
        anchor_text = $_.anchor_text
        link_type = $linkType
        reason = "Extracted from public REST rendered content"
        priority = if ($linkType -eq "support_to_pillar") { "HIGH" } else { "MEDIUM" }
        status = "EXPORTED_NEEDS_REVIEW"
    }
}
$linkRows | Export-Csv -Path (Join-Path $ProjectControlDir "internal-link-map.csv") -NoTypeInformation -Encoding UTF8

Write-Output "Audit build complete."
Write-Output "Inventory rows: $($inventory.Count)"
Write-Output "Quality rows: $(@($qualityRows).Count)"
Write-Output "URL rows: $(@($urlRows).Count)"
Write-Output "Redirect planned rows: $(@($redirectRows).Count)"
Write-Output "Cannibalization groups: $(@($cannibalRows).Count)"
Write-Output "Terms mapped: $(@($allTerms).Count)"
Write-Output "Internal links mapped: $(@($linkRows).Count)"
