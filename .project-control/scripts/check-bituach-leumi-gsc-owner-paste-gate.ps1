$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$md = Join-Path $root 'bituach-leumi-gsc-owner-paste-gate-2026-05-28.md'
$csv = Join-Path $root 'bituach-leumi-gsc-owner-paste-template-2026-05-28.csv'

foreach ($path in @($md, $csv)) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing GSC gate artifact: $path"
    }
}

$text = Get-Content -Raw -LiteralPath $md
$rows = Import-Csv -LiteralPath $csv

$requiredText = @(
    'BITUACH_LEUMI_GSC_OWNER_PASTE_GATE_READY_NO_API_NO_PUBLIC_CHANGE',
    'Owner Export Instructions',
    'Decision Rules',
    'Query Classification Guide',
    'After Owner Paste',
    '/national-insurance-attorney/',
    '/bituach-leumi-appeal-guide/',
    'Actual GSC evidence pasted: 0%',
    'Public CMS edits: 0%',
    'SEO-control changes: 0%',
    'Revenue proof: 0%'
)

$missing = @()
foreach ($token in $requiredText) {
    if ($text -notlike "*$token*") {
        $missing += $token
    }
}

if ($missing.Count -gt 0) {
    throw "Markdown artifact missing required tokens: $($missing -join ', ')"
}

$requiredColumns = @('route','date_range','query','clicks','impressions','ctr','position','intent_bucket','owner_note')
$actualColumns = @($rows[0].PSObject.Properties.Name)
foreach ($column in $requiredColumns) {
    if ($actualColumns -notcontains $column) {
        throw "CSV template missing column: $column"
    }
}

if ($rows.Count -lt 16) {
    throw "Expected at least 16 paste rows, found $($rows.Count)"
}

$validRoutes = @('/national-insurance-attorney/','/bituach-leumi-appeal-guide/')
$validBuckets = @('lawyer_match','appeal_guide','mixed','irrelevant','unknown')
$routeCounts = @{}

foreach ($row in $rows) {
    if ($validRoutes -notcontains $row.route) {
        throw "Invalid route in template: $($row.route)"
    }
    if ($validBuckets -notcontains $row.intent_bucket) {
        throw "Invalid intent bucket in template row $($row.query): $($row.intent_bucket)"
    }
    if (-not $routeCounts.ContainsKey($row.route)) {
        $routeCounts[$row.route] = 0
    }
    $routeCounts[$row.route] += 1
}

foreach ($route in $validRoutes) {
    if (-not $routeCounts.ContainsKey($route) -or $routeCounts[$route] -lt 8) {
        throw "Expected at least 8 rows for $route"
    }
}

$forbidden = @(
    'GSC API called',
    'CMS updated',
    'published live',
    'redirect changed',
    'canonical changed',
    'noindex changed',
    'sitemap changed',
    'paid revenue proven',
    'payment charged',
    'invoice created'
)

$forbiddenFound = @()
foreach ($token in $forbidden) {
    if ($text -match [regex]::Escape($token)) {
        $forbiddenFound += $token
    }
}

if ($forbiddenFound.Count -gt 0) {
    throw "Artifact contains forbidden live/API/revenue claims: $($forbiddenFound -join ', ')"
}

[pscustomobject]@{
    status = 'BITUACH_LEUMI_GSC_OWNER_PASTE_GATE_PASS_NO_API_NO_LIVE_ACTION'
    markdown = $md
    csv = $csv
    rows = $rows.Count
    national_insurance_attorney_rows = $routeCounts['/national-insurance-attorney/']
    appeal_guide_rows = $routeCounts['/bituach-leumi-appeal-guide/']
    gsc_api_calls = 0
    public_changes = 0
    revenue_proof = 0
} | ConvertTo-Json -Compress
