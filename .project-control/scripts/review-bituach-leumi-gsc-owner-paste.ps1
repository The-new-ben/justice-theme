param(
    [string]$InputCsv = ".project-control/bituach-leumi-gsc-owner-paste-template-2026-05-28.csv",
    [string]$ReportDate = "2026-05-28"
)

$ErrorActionPreference = 'Stop'

function Convert-ToNumber {
    param([string]$Value)
    if ([string]::IsNullOrWhiteSpace($Value)) {
        return 0
    }

    $normalized = $Value.Trim().TrimEnd('%')
    $number = 0.0
    if ([double]::TryParse($normalized, [System.Globalization.NumberStyles]::Float, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$number)) {
        return $number
    }

    return 0
}

function Normalize-Query {
    param([string]$Query)
    if ([string]::IsNullOrWhiteSpace($Query)) {
        return ''
    }

    return ($Query.Trim().ToLowerInvariant() -replace '\s+', ' ')
}

$root = (Resolve-Path '.').Path
$csvPath = if ([System.IO.Path]::IsPathRooted($InputCsv)) { $InputCsv } else { Join-Path $root $InputCsv }

if (-not (Test-Path -LiteralPath $csvPath)) {
    throw "Missing GSC owner paste CSV: $csvPath"
}

$rows = Import-Csv -LiteralPath $csvPath
$validRoutes = @('/national-insurance-attorney/', '/bituach-leumi-appeal-guide/')
$validBuckets = @('lawyer_match', 'appeal_guide', 'mixed', 'irrelevant', 'unknown')

if ($rows.Count -eq 0) {
    throw "GSC owner paste CSV has no rows"
}

$routeStats = @{}
foreach ($route in $validRoutes) {
    $routeStats[$route] = [ordered]@{
        route = $route
        rows = 0
        filled_rows = 0
        clicks = 0.0
        impressions = 0.0
        lawyer_match = 0
        appeal_guide = 0
        mixed = 0
        irrelevant = 0
        unknown = 0
    }
}

$filledRows = @()
$errors = @()

foreach ($row in $rows) {
    if ($validRoutes -notcontains $row.route) {
        $errors += "Invalid route: $($row.route)"
        continue
    }

    if ($validBuckets -notcontains $row.intent_bucket) {
        $errors += "Invalid intent_bucket for $($row.route) / $($row.query): $($row.intent_bucket)"
        continue
    }

    $routeStats[$row.route].rows += 1
    $routeStats[$row.route][$row.intent_bucket] += 1

    $query = Normalize-Query $row.query
    $isPlaceholder = $query -eq '' -or $query -like 'paste_query_*'
    if (-not $isPlaceholder) {
        $clicks = Convert-ToNumber $row.clicks
        $impressions = Convert-ToNumber $row.impressions

        $routeStats[$row.route].filled_rows += 1
        $routeStats[$row.route].clicks += $clicks
        $routeStats[$row.route].impressions += $impressions

        $filledRows += [pscustomobject]@{
            route = $row.route
            query = $query
            clicks = $clicks
            impressions = $impressions
            intent_bucket = $row.intent_bucket
        }
    }
}

if ($errors.Count -gt 0) {
    throw "GSC owner paste CSV validation errors: $($errors -join '; ')"
}

$byQuery = $filledRows | Group-Object query
$overlapQueries = @(
    foreach ($group in $byQuery) {
        $routes = @($group.Group.route | Sort-Object -Unique)
        if ($routes.Count -gt 1) {
            $clicks = ($group.Group | Measure-Object clicks -Sum).Sum
            $impressions = ($group.Group | Measure-Object impressions -Sum).Sum
            [pscustomobject]@{
                query = $group.Name
                routes = ($routes -join ' | ')
                clicks = [double]$clicks
                impressions = [double]$impressions
            }
        }
    }
)

$filledNational = $routeStats['/national-insurance-attorney/'].filled_rows
$filledGuide = $routeStats['/bituach-leumi-appeal-guide/'].filled_rows
$enoughData = $filledNational -ge 3 -and $filledGuide -ge 3
$meaningfulOverlap = @($overlapQueries | Where-Object { $_.clicks -gt 0 -or $_.impressions -ge 20 }).Count

$nationalDominant = if (($routeStats['/national-insurance-attorney/'].lawyer_match + $routeStats['/national-insurance-attorney/'].appeal_guide) -gt 0) {
    $routeStats['/national-insurance-attorney/'].lawyer_match -ge $routeStats['/national-insurance-attorney/'].appeal_guide
} else {
    $false
}

$guideDominant = if (($routeStats['/bituach-leumi-appeal-guide/'].lawyer_match + $routeStats['/bituach-leumi-appeal-guide/'].appeal_guide) -gt 0) {
    $routeStats['/bituach-leumi-appeal-guide/'].appeal_guide -ge $routeStats['/bituach-leumi-appeal-guide/'].lawyer_match
} else {
    $false
}

$status = 'BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_BLOCKED_WAITING_OWNER_EXPORT_NO_LIVE_ACTION'
$recommendation = 'Owner/admin must paste real non-private GSC query rows before any CMS copy, metadata or SEO-control decision.'

if ($enoughData -and $meaningfulOverlap -gt 0) {
    $status = 'BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_HOLD_OVERLAP_NO_LIVE_ACTION'
    $recommendation = 'Hold public edits; query overlap needs owner/SEO review before metadata, body or link changes.'
} elseif ($enoughData -and $nationalDominant -and $guideDominant) {
    $status = 'BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_PASS_INTENT_SPLIT_NO_LIVE_ACTION'
    $recommendation = 'Intent split is supported by pasted rows; owner/legal approval is still required before public work.'
} elseif ($enoughData) {
    $status = 'BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_HOLD_BUCKET_MISMATCH_NO_LIVE_ACTION'
    $recommendation = 'Hold public edits; one or both routes do not yet match their intended query bucket.'
}

[pscustomobject]@{
    status = $status
    report_date = $ReportDate
    input_csv = $csvPath
    rows = $rows.Count
    filled_rows = $filledRows.Count
    national_insurance_attorney_filled_rows = $filledNational
    appeal_guide_filled_rows = $filledGuide
    meaningful_overlap_queries = $meaningfulOverlap
    route_stats = @($routeStats.Values)
    recommendation = $recommendation
    gsc_api_calls = 0
    public_changes = 0
    seo_control_changes = 0
    revenue_proof = 0
} | ConvertTo-Json -Depth 6 -Compress
