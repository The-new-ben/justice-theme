param(
    [string]$InputCsv = ".project-control/manual-invoice-revenue-fallback-template-2026-05-27.csv",
    [string]$ReportDate = "2026-05-28"
)

$ErrorActionPreference = 'Stop'

function Test-Yes {
    param([string]$Value)
    return -not [string]::IsNullOrWhiteSpace($Value) -and $Value.Trim().ToLowerInvariant() -in @('yes', 'true', '1', 'y')
}

function Has-Value {
    param([string]$Value)
    return -not [string]::IsNullOrWhiteSpace($Value)
}

$root = (Resolve-Path '.').Path
$csvPath = if ([System.IO.Path]::IsPathRooted($InputCsv)) { $InputCsv } else { Join-Path $root $InputCsv }

if (-not (Test-Path -LiteralPath $csvPath)) {
    throw "Missing manual invoice evidence CSV: $csvPath"
}

$rows = Import-Csv -LiteralPath $csvPath
if ($rows.Count -eq 0) {
    throw "Manual invoice evidence CSV has no rows"
}

$requiredColumns = @(
    'evidence_id',
    'revenue_path',
    'source_record_type',
    'source_record_id_private',
    'owner_approved_controlled_test',
    'accepted_terms_status',
    'agreed_fee_ils',
    'billing_contact_present',
    'invoice_reference',
    'payment_evidence_present',
    'billing_status',
    'allowed_next_action',
    'forbidden_action',
    'operator_note_no_pii'
)

$actualColumns = @($rows[0].PSObject.Properties.Name)
foreach ($column in $requiredColumns) {
    if ($actualColumns -notcontains $column) {
        throw "Manual invoice evidence CSV missing column: $column"
    }
}

$reviewRows = @()
$filledRows = 0
$paidRows = 0
$paidRowsWithProof = 0
$invoiceStageRows = 0
$unsafePaidRows = 0
$readyToBillRows = 0

foreach ($row in $rows) {
    $hasSource = Has-Value $row.source_record_id_private
    $ownerApproved = Test-Yes $row.owner_approved_controlled_test
    $termsAccepted = ($row.accepted_terms_status.Trim().ToLowerInvariant() -eq 'accepted')
    $hasFee = Has-Value $row.agreed_fee_ils
    $hasBillingContact = Test-Yes $row.billing_contact_present
    $hasInvoiceReference = Has-Value $row.invoice_reference
    $hasPaymentEvidence = Test-Yes $row.payment_evidence_present
    $billingStatus = if (Has-Value $row.billing_status) { $row.billing_status.Trim().ToLowerInvariant() } else { '' }

    $isFilled = $hasSource -or $ownerApproved -or $termsAccepted -or $hasFee -or $hasBillingContact -or $hasInvoiceReference -or $hasPaymentEvidence -or (Has-Value $billingStatus)
    if ($isFilled) {
        $filledRows += 1
    }

    $rowStatus = 'BLOCKED_WAITING_OWNER_EVIDENCE'
    $nextAction = 'Owner/admin fills no-PII evidence for controlled scope, terms, fee, billing contact and invoice/payment proof.'

    if ($billingStatus -eq 'paid') {
        $paidRows += 1
        if ($hasPaymentEvidence) {
            $paidRowsWithProof += 1
            $rowStatus = 'PASS_PAID_REQUIRES_PRIVATE_PAYMENT_EVIDENCE'
            $nextAction = 'Paid evidence can be privately reviewed; do not expose payment URL or PII in repo.'
        } else {
            $unsafePaidRows += 1
            $rowStatus = 'HOLD_PAID_STATUS_WITHOUT_PAYMENT_EVIDENCE'
            $nextAction = 'Revert paid claim to invoice/follow-up stage until private payment evidence exists.'
        }
    } elseif ($billingStatus -eq 'invoice_sent' -or $hasInvoiceReference) {
        $invoiceStageRows += 1
        $rowStatus = 'INVOICE_STAGE_NOT_REVENUE'
        $nextAction = 'Follow up for private payment evidence; do not count paid revenue from invoice/reference alone.'
    } elseif ($billingStatus -eq 'ready_to_bill' -or ($ownerApproved -and $termsAccepted -and $hasFee -and $hasBillingContact)) {
        $readyToBillRows += 1
        $rowStatus = 'READY_TO_BILL_NOT_INVOICED'
        $nextAction = 'Owner/operator may prepare invoice/payment request outside this repo; no paid revenue yet.'
    }

    $reviewRows += [pscustomobject]@{
        evidence_id = $row.evidence_id
        revenue_path = $row.revenue_path
        source_record_type = $row.source_record_type
        filled = $isFilled
        row_status = $rowStatus
        billing_status = $billingStatus
        has_invoice_reference = $hasInvoiceReference
        has_payment_evidence = $hasPaymentEvidence
        next_action = $nextAction
    }
}

$status = 'MANUAL_INVOICE_REVENUE_FALLBACK_REVIEW_BLOCKED_WAITING_OWNER_EVIDENCE_NO_LIVE_ACTION'
$recommendation = 'Owner/admin must fill no-PII evidence rows before any invoice-stage or paid-revenue review.'

if ($unsafePaidRows -gt 0) {
    $status = 'MANUAL_INVOICE_REVENUE_FALLBACK_REVIEW_HOLD_PAID_WITHOUT_PROOF_NO_LIVE_ACTION'
    $recommendation = 'Hold revenue claim; paid rows require private payment evidence before paid status can stand.'
} elseif ($paidRowsWithProof -gt 0) {
    $status = 'MANUAL_INVOICE_REVENUE_FALLBACK_REVIEW_PASS_PRIVATE_PAYMENT_EVIDENCE_PRESENT_NO_LIVE_ACTION'
    $recommendation = 'Private payment proof is indicated; owner/admin must review the private evidence location before any revenue report.'
} elseif ($invoiceStageRows -gt 0) {
    $status = 'MANUAL_INVOICE_REVENUE_FALLBACK_REVIEW_INVOICE_STAGE_NO_REVENUE_NO_LIVE_ACTION'
    $recommendation = 'Invoice/reference exists but paid revenue remains blocked until private payment evidence exists.'
} elseif ($readyToBillRows -gt 0) {
    $status = 'MANUAL_INVOICE_REVENUE_FALLBACK_REVIEW_READY_TO_BILL_NO_REVENUE_NO_LIVE_ACTION'
    $recommendation = 'Ready-to-bill evidence exists; owner/operator still needs sent invoice/reference and private payment evidence.'
}

[pscustomobject]@{
    status = $status
    report_date = $ReportDate
    input_csv = $csvPath
    rows = $rows.Count
    filled_rows = $filledRows
    ready_to_bill_rows = $readyToBillRows
    invoice_stage_rows = $invoiceStageRows
    paid_rows = $paidRows
    paid_rows_with_private_payment_evidence = $paidRowsWithProof
    unsafe_paid_rows = $unsafePaidRows
    recommendation = $recommendation
    row_results = $reviewRows
    invoices_created = 0
    payments_charged = 0
    public_changes = 0
    provider_setting_changes = 0
    revenue_proof = $paidRowsWithProof
} | ConvertTo-Json -Depth 6 -Compress
