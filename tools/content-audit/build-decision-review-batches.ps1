param(
    [string] $ProjectControlDir = "project-control"
)

$ErrorActionPreference = "Stop"

function Import-RequiredCsv {
    param([string] $Path)

    if (-not (Test-Path $Path)) {
        throw "Missing required CSV: $Path"
    }

    return Import-Csv $Path
}

function Get-LastPathSegment {
    param([string] $Url)

    if ([string]::IsNullOrWhiteSpace($Url)) {
        return ""
    }

    try {
        $uri = [Uri] $Url
        $path = $uri.AbsolutePath.Trim("/")
        if (-not $path) {
            return ""
        }

        $parts = $path.Split("/", [System.StringSplitOptions]::RemoveEmptyEntries)
        if ($parts.Count -eq 0) {
            return ""
        }

        return [Uri]::UnescapeDataString($parts[$parts.Count - 1])
    }
    catch {
        return ""
    }
}

function Get-WordCount {
    param(
        [object] $Row,
        [hashtable] $InventoryById
    )

    $id = [string] $Row.post_id
    if (-not $id -and $Row.id) {
        $id = [string] $Row.id
    }

    if ($id -and $InventoryById.ContainsKey($id)) {
        $value = $InventoryById[$id].word_count
        $parsed = 0
        if ([int]::TryParse([string] $value, [ref] $parsed)) {
            return $parsed
        }
    }

    return 0
}

function Join-Unique {
    param(
        [object[]] $Values,
        [string] $Separator = "|"
    )

    return (($Values | Where-Object { -not [string]::IsNullOrWhiteSpace([string] $_) } | Sort-Object -Unique) -join $Separator)
}

$inventoryPath = Join-Path $ProjectControlDir "content-master-inventory.csv"
$urlMapPath = Join-Path $ProjectControlDir "url-migration-map.csv"
$qualityPath = Join-Path $ProjectControlDir "content-quality-audit.csv"
$cannibalPath = Join-Path $ProjectControlDir "cannibalization-map.csv"

$inventory = @(Import-RequiredCsv $inventoryPath)
$urlMap = @(Import-RequiredCsv $urlMapPath)
$quality = @(Import-RequiredCsv $qualityPath)
$cannibal = @(Import-RequiredCsv $cannibalPath)

$inventoryById = @{}
foreach ($row in $inventory) {
    $inventoryById[[string] $row.id] = $row
}

$qualityById = @{}
foreach ($row in $quality) {
    $qualityById[[string] $row.id] = $row
}

$strategicTargets = [ordered] @{
    "family-law-divorce"    = "divorce-lawyer"
    "criminal-law"          = "criminal-lawyer"
    "real-estate"           = "real-estate-lawyer"
    "medical-malpractice"   = "medical-malpractice-lawyer"
    "personal-injury"       = "personal-injury-lawyer"
    "traffic-law"           = "traffic-lawyer"
    "employment-law"        = "employment-lawyer"
    "inheritance-wills"     = "inheritance-lawyer"
    "cyber-privacy"         = "cyber-privacy-lawyer"
    "outdated-corona-legacy" = ""
    "needs-classification"  = ""
}

$slugRoleHints = @{
    "divorce-lawyer"                  = "pillar"
    "family-lawyer"                   = "pillar"
    "criminal-lawyer"                 = "pillar"
    "real-estate-lawyer"              = "pillar"
    "medical-malpractice-lawyer"      = "pillar"
    "personal-injury-lawyer"          = "pillar"
    "traffic-lawyer"                  = "pillar"
    "employment-lawyer"               = "pillar"
    "inheritance-lawyer"              = "pillar"
    "child-support"                   = "supporting_article"
    "child-custody"                   = "supporting_article"
    "divorce-mediation"              = "supporting_article"
    "divorce-property-division"       = "supporting_article"
    "consensual-divorce"              = "supporting_article"
    "family-dispute-resolution"       = "supporting_article"
    "pretrial-detention"              = "supporting_article"
    "police-investigation"            = "supporting_article"
    "indictment"                      = "supporting_article"
    "drug-offenses"                   = "supporting_article"
    "sex-offenses"                    = "supporting_article"
    "white-collar-crime"              = "supporting_article"
    "buying-apartment"                = "supporting_article"
    "real-estate-purchase-agreement"  = "supporting_article"
    "car-accident-lawyer"             = "supporting_article"
}

$slugConflicts = @()
$conflictGroups = $urlMap |
    Where-Object {
        -not [string]::IsNullOrWhiteSpace($_.new_slug) -and
        $_.new_slug -ne "NEEDS_ENGLISH_SLUG_REVIEW"
    } |
    Group-Object new_slug |
    Where-Object { $_.Count -gt 1 } |
    Sort-Object -Property @{ Expression = { $_.Count }; Descending = $true }, Name

foreach ($group in $conflictGroups) {
    $rows = @($group.Group)
    $slug = [string] $group.Name
    $exactRows = @($rows | Where-Object {
        $_.old_slug -eq $slug -or (Get-LastPathSegment $_.old_url) -eq $slug
    })

    $candidateRows = if ($exactRows.Count -gt 0) { $exactRows } else { $rows }
    $candidate = $candidateRows |
        Sort-Object @{ Expression = { if ($_.post_type -eq "page") { 0 } else { 1 } } },
                    @{ Expression = { -(Get-WordCount $_ $inventoryById) } },
                    old_url |
        Select-Object -First 1

    $highest = $rows |
        Sort-Object @{ Expression = { -(Get-WordCount $_ $inventoryById) } }, old_url |
        Select-Object -First 1

    $candidateWordCount = Get-WordCount $candidate $inventoryById
    $highestWordCount = Get-WordCount $highest $inventoryById
    $clusters = Join-Unique ($rows | ForEach-Object { $_.topic_cluster })
    $exactUrls = Join-Unique ($exactRows | ForEach-Object { $_.old_url })
    $postTypes = Join-Unique ($rows | ForEach-Object { $_.post_type })
    $role = if ($slugRoleHints.ContainsKey($slug)) { $slugRoleHints[$slug] } else { "needs_editorial_classification" }

    $nextAction = if ($exactRows.Count -eq 1) {
        "KEEP_EXACT_URL_AS_PRIMARY_REVIEW_MERGE_DUPLICATES"
    }
    elseif ($exactRows.Count -gt 1) {
        "EXACT_SLUG_DUPLICATE_REVIEW"
    }
    else {
        "SELECT_PRIMARY_AND_PLAN_REDIRECTS_LATER"
    }

    $slugConflicts += [pscustomobject] @{
        target_slug = $slug
        conflict_count = $rows.Count
        expected_role = $role
        topic_clusters = $clusters
        post_types = $postTypes
        exact_current_slug_count = $exactRows.Count
        exact_current_urls = $exactUrls
        proposed_primary_url_for_review = $candidate.old_url
        proposed_primary_post_id = $candidate.post_id
        proposed_primary_post_type = $candidate.post_type
        proposed_primary_title = $candidate.title
        proposed_primary_word_count = $candidateWordCount
        highest_word_count_url = $highest.old_url
        highest_word_count_title = $highest.title
        highest_word_count = $highestWordCount
        recommended_next_action = $nextAction
        gsc_required = "YES"
        owner_approval_required = "YES"
        status = "REVIEW_ONLY_NO_URL_CHANGE"
        notes = "Generated from refreshed public REST URL map; do not redirect or rename until GSC/SERP/manual review approves the primary URL."
    }
}

$slugConflictPath = Join-Path $ProjectControlDir "slug-conflict-review.csv"
$slugConflicts | Export-Csv -Path $slugConflictPath -NoTypeInformation -Encoding UTF8

$editorialRows = @()
$needsSlugRows = @($urlMap | Where-Object {
    $_.status -eq "NEEDS_EDITORIAL_SLUG_MAPPING" -or
    $_.new_slug -eq "NEEDS_ENGLISH_SLUG_REVIEW"
})

foreach ($row in $needsSlugRows) {
    $inventoryRow = $null
    if ($inventoryById.ContainsKey([string] $row.post_id)) {
        $inventoryRow = $inventoryById[[string] $row.post_id]
    }

    $qualityRow = $null
    if ($qualityById.ContainsKey([string] $row.post_id)) {
        $qualityRow = $qualityById[[string] $row.post_id]
    }

    $lane = "manual_review"
    $title = [string] $row.title
    $url = [string] $row.old_url

    if ($row.topic_cluster -eq "outdated-corona-legacy") {
        $lane = "legacy_outdated_review"
    }
    elseif ($row.topic_cluster -eq "needs-classification") {
        $lane = "classify_topic_first"
    }
    elseif ($title -match "Australia|United States|Cyprus|Greece|Malta|Ukraine|Europe" -or $url -match "cyprus|greece|malta|ukraine|united-states|australia|europe") {
        $lane = "international_or_non_local_review"
    }
    elseif ($qualityRow -and $qualityRow.is_thin -eq "TRUE") {
        $lane = "thin_content_review"
    }

    $editorialRows += [pscustomobject] @{
        post_id = $row.post_id
        current_url = $row.old_url
        current_slug = $row.old_slug
        title = $row.title
        post_type = $row.post_type
        topic_cluster = $row.topic_cluster
        word_count = if ($inventoryRow) { $inventoryRow.word_count } else { "" }
        quality_action = if ($qualityRow) { $qualityRow.recommended_action } else { "" }
        slug_status = $row.status
        suggested_review_lane = $lane
        gsc_required = "YES"
        owner_approval_required = "YES"
        status = "REVIEW_ONLY_NO_URL_CHANGE"
        notes = "Needs human slug/topic decision before any migration; traffic risk remains UNKNOWN until GSC overlay."
    }
}

$editorialPath = Join-Path $ProjectControlDir "editorial-slug-mapping-review.csv"
$editorialRows | Export-Csv -Path $editorialPath -NoTypeInformation -Encoding UTF8

$clusterRows = @()
foreach ($cluster in $strategicTargets.Keys) {
    $targetSlug = $strategicTargets[$cluster]
    $clusterUrlRows = @($urlMap | Where-Object { $_.topic_cluster -eq $cluster })
    $clusterQuality = @($clusterUrlRows | ForEach-Object {
        if ($qualityById.ContainsKey([string] $_.post_id)) { $qualityById[[string] $_.post_id] }
    } | Where-Object { $_ })

    $targetCandidates = @()
    if ($targetSlug) {
        $targetCandidates = @($clusterUrlRows | Where-Object {
            $_.old_slug -eq $targetSlug -or
            (Get-LastPathSegment $_.old_url) -eq $targetSlug -or
            $_.old_url -match "/$([regex]::Escape($targetSlug))/?$"
        })
    }

    $candidate = $null
    if ($targetCandidates.Count -gt 0) {
        $candidate = $targetCandidates |
            Sort-Object @{ Expression = { if ($_.post_type -eq "page") { 0 } else { 1 } } },
                        @{ Expression = { -(Get-WordCount $_ $inventoryById) } },
                        old_url |
            Select-Object -First 1
    }
    elseif ($clusterUrlRows.Count -gt 0) {
        $candidate = $clusterUrlRows |
            Sort-Object @{ Expression = { -(Get-WordCount $_ $inventoryById) } }, old_url |
            Select-Object -First 1
    }

    $cannibalRow = $cannibal | Where-Object { $_.cannibalization_group -eq $cluster } | Select-Object -First 1
    $candidateUrl = if ($candidate) { $candidate.old_url } else { "" }
    $candidateTitle = if ($candidate) { $candidate.title } else { "" }
    $candidateId = if ($candidate) { $candidate.post_id } else { "" }
    $candidateWords = if ($candidate) { Get-WordCount $candidate $inventoryById } else { "" }
    $currentHeuristic = if ($cannibalRow) { $cannibalRow.current_best_url } else { "" }

    $issue = if (-not $targetSlug) {
        "NO_STRATEGIC_TARGET_SLUG_DEFINED"
    }
    elseif ($targetCandidates.Count -eq 0) {
        "TARGET_PILLAR_NOT_FOUND_BY_PUBLIC_URL"
    }
    elseif ($currentHeuristic -and $currentHeuristic -ne $candidateUrl) {
        "HEURISTIC_BEST_DIFFERS_FROM_STRATEGIC_TARGET"
    }
    else {
        "TARGET_CANDIDATE_FOUND_NEEDS_GSC_CONFIRMATION"
    }

    $clusterRows += [pscustomobject] @{
        cluster = $cluster
        strategic_target_slug = $targetSlug
        current_heuristic_best_url = $currentHeuristic
        proposed_pillar_url_for_review = $candidateUrl
        proposed_pillar_post_id = $candidateId
        proposed_pillar_title = $candidateTitle
        proposed_pillar_word_count = $candidateWords
        public_rows_in_cluster = $clusterUrlRows.Count
        rewrite_rows = @($clusterQuality | Where-Object { $_.recommended_action -eq "REWRITE" }).Count
        expand_rows = @($clusterQuality | Where-Object { $_.recommended_action -eq "EXPAND" }).Count
        review_classify_rows = @($clusterQuality | Where-Object { $_.recommended_action -eq "REVIEW_CLASSIFY" }).Count
        issue = $issue
        recommended_next_action = "CONFIRM_PRIMARY_WITH_GSC_SERP_OWNER_REVIEW"
        status = "REVIEW_ONLY_NO_URL_CHANGE"
        notes = "Strategic target is a planning candidate only; do not change URLs or redirects before owner approval."
    }
}

$clusterPath = Join-Path $ProjectControlDir "cluster-pillar-review.csv"
$clusterRows | Export-Csv -Path $clusterPath -NoTypeInformation -Encoding UTF8

Write-Host "Decision review batches created."
Write-Host "Slug conflict groups: $($slugConflicts.Count)"
Write-Host "Editorial slug mapping rows: $($editorialRows.Count)"
Write-Host "Cluster pillar rows: $($clusterRows.Count)"
