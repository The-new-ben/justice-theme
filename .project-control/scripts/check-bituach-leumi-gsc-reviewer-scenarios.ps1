$ErrorActionPreference = 'Stop'

$root = (Resolve-Path '.').Path
$reviewer = Join-Path $root '.project-control/scripts/review-bituach-leumi-gsc-owner-paste.ps1'

if (-not (Test-Path -LiteralPath $reviewer)) {
    throw "Missing reviewer script: $reviewer"
}

function New-ScenarioCsv {
    param(
        [string]$Name,
        [string[]]$Rows
    )

    $dir = Join-Path ([System.IO.Path]::GetTempPath()) 'justice-btl-gsc-reviewer-scenarios'
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $path = Join-Path $dir "$Name.csv"
    $header = 'route,date_range,query,clicks,impressions,ctr,position,intent_bucket,owner_note'
    $content = @($header) + $Rows
    Set-Content -LiteralPath $path -Encoding UTF8 -Value $content
    return $path
}

function Invoke-Scenario {
    param(
        [string]$Name,
        [string]$ExpectedStatus,
        [string[]]$Rows
    )

    $csv = New-ScenarioCsv -Name $Name -Rows $Rows
    $jsonText = & $reviewer -InputCsv $csv -ReportDate '2026-05-28'
    $result = $jsonText | ConvertFrom-Json
    $pass = $result.status -eq $ExpectedStatus

    [pscustomobject]@{
        scenario = $Name
        expected_status = $ExpectedStatus
        actual_status = $result.status
        pass = $pass
        rows = $result.rows
        filled_rows = $result.filled_rows
        meaningful_overlap_queries = $result.meaningful_overlap_queries
        gsc_api_calls = $result.gsc_api_calls
        public_changes = $result.public_changes
        revenue_proof = $result.revenue_proof
    }
}

$passRows = @(
    '/national-insurance-attorney/,last_3_months,national insurance lawyer,3,60,5%,4.2,lawyer_match,fixture'
    '/national-insurance-attorney/,last_3_months,lawyer for disability appeal,2,40,5%,5.1,lawyer_match,fixture'
    '/national-insurance-attorney/,last_3_months,medical committee lawyer,1,25,4%,7.3,lawyer_match,fixture'
    '/bituach-leumi-appeal-guide/,last_3_months,national insurance appeal,4,80,5%,3.8,appeal_guide,fixture'
    '/bituach-leumi-appeal-guide/,last_3_months,how to appeal national insurance,2,50,4%,6.0,appeal_guide,fixture'
    '/bituach-leumi-appeal-guide/,last_3_months,medical committee appeal form,1,30,3.3%,8.4,appeal_guide,fixture'
)

$overlapRows = @(
    '/national-insurance-attorney/,last_3_months,national insurance appeal,2,60,3.3%,5.2,lawyer_match,fixture'
    '/national-insurance-attorney/,last_3_months,lawyer for disability appeal,1,30,3.3%,6.1,lawyer_match,fixture'
    '/national-insurance-attorney/,last_3_months,medical committee lawyer,1,22,4.5%,7.1,lawyer_match,fixture'
    '/bituach-leumi-appeal-guide/,last_3_months,national insurance appeal,3,70,4.2%,4.0,appeal_guide,fixture'
    '/bituach-leumi-appeal-guide/,last_3_months,how to appeal national insurance,2,50,4%,6.0,appeal_guide,fixture'
    '/bituach-leumi-appeal-guide/,last_3_months,medical committee appeal form,1,30,3.3%,8.4,appeal_guide,fixture'
)

$mismatchRows = @(
    '/national-insurance-attorney/,last_3_months,national insurance appeal,3,60,5%,4.2,appeal_guide,fixture'
    '/national-insurance-attorney/,last_3_months,how to appeal national insurance,2,40,5%,5.1,appeal_guide,fixture'
    '/national-insurance-attorney/,last_3_months,medical committee appeal form,1,25,4%,7.3,appeal_guide,fixture'
    '/bituach-leumi-appeal-guide/,last_3_months,national insurance lawyer,4,80,5%,3.8,lawyer_match,fixture'
    '/bituach-leumi-appeal-guide/,last_3_months,lawyer for disability appeal,2,50,4%,6.0,lawyer_match,fixture'
    '/bituach-leumi-appeal-guide/,last_3_months,medical committee lawyer,1,30,3.3%,8.4,lawyer_match,fixture'
)

$blankResult = & $reviewer | ConvertFrom-Json
$scenarios = @(
    Invoke-Scenario -Name 'pass_intent_split' -ExpectedStatus 'BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_PASS_INTENT_SPLIT_NO_LIVE_ACTION' -Rows $passRows
    Invoke-Scenario -Name 'hold_overlap' -ExpectedStatus 'BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_HOLD_OVERLAP_NO_LIVE_ACTION' -Rows $overlapRows
    Invoke-Scenario -Name 'hold_bucket_mismatch' -ExpectedStatus 'BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_HOLD_BUCKET_MISMATCH_NO_LIVE_ACTION' -Rows $mismatchRows
    [pscustomobject]@{
        scenario = 'blank_owner_template'
        expected_status = 'BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_BLOCKED_WAITING_OWNER_EXPORT_NO_LIVE_ACTION'
        actual_status = $blankResult.status
        pass = ($blankResult.status -eq 'BITUACH_LEUMI_GSC_OWNER_PASTE_REVIEW_BLOCKED_WAITING_OWNER_EXPORT_NO_LIVE_ACTION')
        rows = $blankResult.rows
        filled_rows = $blankResult.filled_rows
        meaningful_overlap_queries = $blankResult.meaningful_overlap_queries
        gsc_api_calls = $blankResult.gsc_api_calls
        public_changes = $blankResult.public_changes
        revenue_proof = $blankResult.revenue_proof
    }
)

$failed = @($scenarios | Where-Object { -not $_.pass })
if ($failed.Count -gt 0) {
    $details = ($failed | ForEach-Object { "$($_.scenario): expected $($_.expected_status), got $($_.actual_status)" }) -join '; '
    throw "GSC reviewer scenario failures: $details"
}

$unsafe = @($scenarios | Where-Object { $_.gsc_api_calls -ne 0 -or $_.public_changes -ne 0 -or $_.revenue_proof -ne 0 })
if ($unsafe.Count -gt 0) {
    throw "Scenario checker found an unsafe side-effect count"
}

[pscustomobject]@{
    status = 'BITUACH_LEUMI_GSC_REVIEWER_SCENARIOS_PASS_NO_API_NO_LIVE_ACTION'
    scenarios = $scenarios.Count
    passed = ($scenarios | Where-Object { $_.pass }).Count
    gsc_api_calls = 0
    public_changes = 0
    revenue_proof = 0
    results = $scenarios
} | ConvertTo-Json -Depth 6 -Compress
