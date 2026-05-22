param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [string]$ReportPath = "",

    [switch]$AllowRepoPath,

    [switch]$TemplateMode
)

$ErrorActionPreference = "Stop"

function Add-Issue {
    param(
        [int]$RowNumber,
        [string]$Severity,
        [string]$Field,
        [string]$Code,
        [string]$Message
    )

    $script:Issues += [pscustomobject]@{
        row      = $RowNumber
        severity = $Severity
        field    = $Field
        code     = $Code
        message  = $Message
    }
}

function Test-Choice {
    param(
        [string]$Value,
        [string[]]$Allowed
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return $false
    }

    return $Allowed -contains $Value.Trim()
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$resolvedInput = Resolve-Path $Path
$inputPath = $resolvedInput.Path

if (-not $AllowRepoPath -and $inputPath.StartsWith($repoRoot.Path, [System.StringComparison]::OrdinalIgnoreCase)) {
    Write-Error "BLOCKED_PRIVATE_DATA_PATH_IN_REPO: Copy the prospect CSV outside the repo before filling private lawyer/contact data, or rerun with -AllowRepoPath only for the blank template."
}

$requiredHeaders = @(
    "slot",
    "practice_area",
    "city",
    "lawyer_name_private",
    "contact_source_private",
    "google_review_count",
    "latest_review_date",
    "has_website",
    "has_profile_photo",
    "likely_pain_point",
    "plan_fit",
    "outreach_status",
    "next_followup_date",
    "notes_private"
)

$allowedPracticeAreas = @(
    "family-law",
    "criminal-law",
    "traffic-law",
    "real-estate",
    "inheritance-wills",
    "personal-injury",
    "medical-malpractice",
    "employment-law",
    "tax-law",
    "immigration-international",
    "other"
)

$allowedTriState = @("yes", "no", "unknown")
$allowedPlans = @("Pro", "Featured", "Lead Partner", "Full Service", "Unknown", "unknown")
$allowedStatuses = @(
    "not_started",
    "research",
    "ready_to_contact",
    "contacted",
    "follow_up",
    "demo_booked",
    "proposal_sent",
    "won",
    "lost",
    "parked"
)

$script:Issues = @()
$rows = @(Import-Csv -Path $inputPath)
$headers = @()
if ($rows.Count -gt 0) {
    $headers = @($rows[0].PSObject.Properties.Name)
} else {
    $firstLine = Get-Content -Path $inputPath -TotalCount 1
    if ($firstLine) {
        $headers = @($firstLine -split ",")
    }
}

foreach ($header in $requiredHeaders) {
    if ($headers -notcontains $header) {
        Add-Issue -RowNumber 0 -Severity "ERROR" -Field $header -Code "MISSING_REQUIRED_HEADER" -Message "Required CSV header is missing."
    }
}

if ($rows.Count -eq 0) {
    Add-Issue -RowNumber 0 -Severity "ERROR" -Field "file" -Code "NO_ROWS" -Message "CSV has headers but no prospect rows."
}

if ($rows.Count -ne 20) {
    Add-Issue -RowNumber 0 -Severity "WARNING" -Field "file" -Code "ROW_COUNT_NOT_20" -Message "First wave should normally contain exactly 20 rows."
}

$seenSlots = @{}
$rowNumber = 1

foreach ($row in $rows) {
    $slot = (([string]$row.slot).Trim())
    if ($slot -notmatch "^\d+$") {
        Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "slot" -Code "INVALID_SLOT" -Message "Slot must be a positive integer."
    } else {
        $slotNumber = [int]$slot
        if ($slotNumber -lt 1) {
            Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "slot" -Code "INVALID_SLOT" -Message "Slot must be greater than zero."
        }
        if ($seenSlots.ContainsKey($slotNumber)) {
            Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "slot" -Code "DUPLICATE_SLOT" -Message "Slot number is duplicated."
        }
        $seenSlots[$slotNumber] = $true
    }

    if (-not (Test-Choice -Value ([string]$row.practice_area) -Allowed $allowedPracticeAreas)) {
        Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "practice_area" -Code "INVALID_PRACTICE_AREA" -Message "Practice area must match the approved first-wave taxonomy value."
    }

    if (-not $TemplateMode) {
        if ([string]::IsNullOrWhiteSpace([string]$row.city)) {
            Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "city" -Code "MISSING_CITY" -Message "City is required for outreach prioritization."
        }
        if ([string]::IsNullOrWhiteSpace([string]$row.lawyer_name_private)) {
            Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "lawyer_name_private" -Code "MISSING_LAWYER_NAME" -Message "Private lawyer name is required in the owner file."
        }
        if ([string]::IsNullOrWhiteSpace([string]$row.contact_source_private)) {
            Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "contact_source_private" -Code "MISSING_CONTACT_SOURCE" -Message "Record where the owner found the contact channel."
        }
    }

    $reviewCount = (([string]$row.google_review_count).Trim())
    if ($reviewCount -ne "" -and $reviewCount -notmatch "^\d+$") {
        Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "google_review_count" -Code "INVALID_REVIEW_COUNT" -Message "Google review count must be blank or a non-negative integer."
    }

    $latestReviewDate = (([string]$row.latest_review_date).Trim())
    if ($latestReviewDate -ne "" -and $latestReviewDate -notmatch "^\d{4}-\d{2}-\d{2}$") {
        Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "latest_review_date" -Code "INVALID_LATEST_REVIEW_DATE" -Message "Use ISO date format YYYY-MM-DD or leave blank."
    }

    if (-not (Test-Choice -Value ([string]$row.has_website) -Allowed $allowedTriState)) {
        Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "has_website" -Code "INVALID_HAS_WEBSITE" -Message "Allowed values: yes, no, unknown."
    }

    if (-not (Test-Choice -Value ([string]$row.has_profile_photo) -Allowed $allowedTriState)) {
        Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "has_profile_photo" -Code "INVALID_HAS_PROFILE_PHOTO" -Message "Allowed values: yes, no, unknown."
    }

    if ([string]::IsNullOrWhiteSpace([string]$row.likely_pain_point)) {
        Add-Issue -RowNumber $rowNumber -Severity "WARNING" -Field "likely_pain_point" -Code "MISSING_PAIN_POINT" -Message "Add a practical reason the lawyer may need Jus-Tice."
    }

    if (-not (Test-Choice -Value ([string]$row.plan_fit) -Allowed $allowedPlans)) {
        Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "plan_fit" -Code "INVALID_PLAN_FIT" -Message "Allowed values: Pro, Featured, Lead Partner, Full Service, Unknown."
    }

    if (-not (Test-Choice -Value ([string]$row.outreach_status) -Allowed $allowedStatuses)) {
        Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "outreach_status" -Code "INVALID_OUTREACH_STATUS" -Message "Use an approved outreach status."
    }

    $nextFollowup = (([string]$row.next_followup_date).Trim())
    if ($nextFollowup -ne "" -and $nextFollowup -notmatch "^\d{4}-\d{2}-\d{2}$") {
        Add-Issue -RowNumber $rowNumber -Severity "ERROR" -Field "next_followup_date" -Code "INVALID_NEXT_FOLLOWUP_DATE" -Message "Use ISO date format YYYY-MM-DD or leave blank."
    }

    $rowNumber++
}

if ($seenSlots.Count -gt 0 -and $rows.Count -eq 20) {
    foreach ($expectedSlot in 1..20) {
        if (-not $seenSlots.ContainsKey($expectedSlot)) {
            Add-Issue -RowNumber 0 -Severity "ERROR" -Field "slot" -Code "MISSING_EXPECTED_SLOT" -Message "Expected slot $expectedSlot is missing."
        }
    }
}

if ($ReportPath) {
    $reportDirectory = Split-Path -Path $ReportPath -Parent
    if ($reportDirectory -and -not (Test-Path -Path $reportDirectory)) {
        New-Item -ItemType Directory -Path $reportDirectory | Out-Null
    }

    if ($script:Issues.Count -gt 0) {
        $script:Issues | Export-Csv -Path $ReportPath -NoTypeInformation -Encoding UTF8
    } else {
        @([pscustomobject]@{
            row      = 0
            severity = "VERIFIED"
            field    = "file"
            code     = "NO_ISSUES"
            message  = "CSV structure and allowed values passed validation."
        }) | Export-Csv -Path $ReportPath -NoTypeInformation -Encoding UTF8
    }
}

$errorCount = @($script:Issues | Where-Object { $_.severity -eq "ERROR" }).Count
$warningCount = @($script:Issues | Where-Object { $_.severity -eq "WARNING" }).Count

[pscustomobject]@{
    status        = if ($errorCount -eq 0) { "VERIFIED_PRIVATE_LIST_STRUCTURE" } else { "BLOCKED_PRIVATE_LIST_VALIDATION" }
    template_mode = [bool]$TemplateMode
    rows          = $rows.Count
    errors        = $errorCount
    warnings      = $warningCount
    report_path   = $ReportPath
} | ConvertTo-Json -Compress

if ($errorCount -gt 0) {
    exit 1
}
