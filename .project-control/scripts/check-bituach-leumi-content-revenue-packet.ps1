$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$packet = Join-Path $root 'bituach-leumi-content-revenue-packet-2026-05-28.md'

if (-not (Test-Path -LiteralPath $packet)) {
    throw "Missing packet: $packet"
}

$text = Get-Content -Raw -LiteralPath $packet
$required = @(
    'BITUACH_LEUMI_CONTENT_REVENUE_PACKET_READY_NOT_UPLOAD',
    'Project Manager Check',
    'Official Source Research',
    'Existing Jus-Tice Cannibalization Map',
    '/national-insurance-attorney/',
    '/bituach-leumi-appeal-guide/',
    'Do not create a third generic',
    'Revenue Path',
    'Minimum Publication Gate',
    'no public CMS',
    'private payment evidence',
    '0%, intentionally not performed'
)

$missing = @()
foreach ($token in $required) {
    if ($text -notlike "*$token*") {
        $missing += $token
    }
}

if ($missing.Count -gt 0) {
    throw "Packet is missing required tokens: $($missing -join ', ')"
}

$officialUrlCount = ([regex]::Matches($text, 'https://(?:www\.)?(?:btl\.gov\.il|gov\.il)/')).Count
if ($officialUrlCount -lt 6) {
    throw "Expected at least 6 official source URLs, found $officialUrlCount"
}

$forbiddenClaims = @(
    'revenue proof: 100%',
    'public content publication: 100%',
    'CMS updated',
    'published live',
    'paid revenue proven',
    'invoice created',
    'payment charged'
)

$forbiddenFound = @()
foreach ($token in $forbiddenClaims) {
    if ($text -match [regex]::Escape($token)) {
        $forbiddenFound += $token
    }
}

if ($forbiddenFound.Count -gt 0) {
    throw "Packet contains forbidden completion/revenue claims: $($forbiddenFound -join ', ')"
}

[pscustomobject]@{
    status = 'BITUACH_LEUMI_CONTENT_REVENUE_PACKET_PASS_NO_LIVE_ACTION'
    packet = $packet
    official_source_urls = $officialUrlCount
    public_changes = 0
    revenue_proof = 0
} | ConvertTo-Json -Compress
