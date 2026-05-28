$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$md = Join-Path $root 'bituach-leumi-owner-copy-approval-rows-2026-05-28.md'
$csv = Join-Path $root 'bituach-leumi-owner-copy-approval-rows-2026-05-28.csv'

foreach ($path in @($md, $csv)) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing approval artifact: $path"
    }
}

$text = Get-Content -Raw -LiteralPath $md
$rows = Import-Csv -LiteralPath $csv

$requiredText = @(
    'BITUACH_LEUMI_OWNER_COPY_ROWS_READY_NOT_UPLOAD',
    '/national-insurance-attorney/',
    '/bituach-leumi-appeal-guide/',
    'Owner decision needed before public work',
    'Blocked Until Approval',
    'Public CMS changes: 0%',
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

if ($rows.Count -ne 16) {
    throw "Expected 16 owner copy rows, found $($rows.Count)"
}

$routeCounts = $rows | Group-Object route | ForEach-Object { @{ route = $_.Name; count = $_.Count } }
$national = ($routeCounts | Where-Object { $_.route -eq '/national-insurance-attorney/' }).count
$guide = ($routeCounts | Where-Object { $_.route -eq '/bituach-leumi-appeal-guide/' }).count

if ($national -ne 8 -or $guide -ne 8) {
    throw "Expected 8 rows per route; found national=$national guide=$guide"
}

$rowTypes = $rows.row_type | Sort-Object -Unique
foreach ($requiredType in @('Title', 'H1', 'Meta Description', 'Primary CTA', 'Secondary Link', 'Opening Direction', 'Required Body Sections', 'Image Requirement')) {
    if ($rowTypes -notcontains $requiredType) {
        throw "Missing row type: $requiredType"
    }
}

foreach ($row in $rows) {
    if ($row.owner_decision -ne 'Pending') {
        throw "Owner decision must remain Pending for $($row.id)"
    }
}

$forbidden = @(
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
    throw "Artifact contains forbidden live/revenue claims: $($forbiddenFound -join ', ')"
}

[pscustomobject]@{
    status = 'BITUACH_LEUMI_OWNER_COPY_ROWS_PASS_NO_LIVE_ACTION'
    markdown = $md
    csv = $csv
    rows = $rows.Count
    national_insurance_attorney_rows = $national
    appeal_guide_rows = $guide
    public_changes = 0
    revenue_proof = 0
} | ConvertTo-Json -Compress
