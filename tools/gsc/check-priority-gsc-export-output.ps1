param(
  [string]$ReportDate = (Get-Date -Format "yyyy-MM-dd"),
  [ValidateSet("family", "criminal", "medical")]
  [string[]]$Clusters = @("family", "criminal", "medical"),
  [switch]$AllowEmptyExports,
  [switch]$WriteReport
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path

function Join-RepoPath {
  param([string]$Path)
  return Join-Path $repoRoot $Path
}

function Get-RelativePath {
  param([string]$Path)
  $fullPath = [System.IO.Path]::GetFullPath($Path)
  $rootPrefix = $repoRoot.TrimEnd("\") + "\"
  if ($fullPath.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $fullPath.Substring($rootPrefix.Length)
  }
  return $Path
}

function New-CheckRow {
  param(
    [string]$Cluster,
    [string]$ArtifactType,
    [string]$Artifact,
    [string]$Status,
    [string]$Severity,
    [string]$Detail,
    [int]$Rows = 0,
    [string[]]$RequiredColumns = @(),
    [string[]]$MissingColumns = @(),
    [string]$NextStep = ""
  )

  [pscustomobject]@{
    cluster = $Cluster
    artifact_type = $ArtifactType
    artifact = $Artifact
    status = $Status
    severity = $Severity
    detail = $Detail
    rows = $Rows
    required_columns = ($RequiredColumns -join "|")
    missing_columns = ($MissingColumns -join "|")
    next_step = $NextStep
  }
}

function Read-CsvHeader {
  param([string]$Path)

  $lines = @(Get-Content -LiteralPath $Path -Encoding UTF8)
  if ($lines.Count -eq 0) {
    return @()
  }
  return @($lines[0] -split ",")
}

function Test-CsvArtifact {
  param(
    [string]$Cluster,
    [string]$ArtifactType,
    [string]$Path,
    [string[]]$RequiredColumns,
    [bool]$RequireRows,
    [string]$EmptyStatus = "NOT_VERIFIED_EMPTY_ALLOWED"
  )

  $relative = Get-RelativePath $Path
  if (-not (Test-Path -LiteralPath $Path)) {
    return New-CheckRow `
      -Cluster $Cluster `
      -ArtifactType $ArtifactType `
      -Artifact $relative `
      -Status "BLOCKED_MISSING_FILE" `
      -Severity "BLOCKED" `
      -Detail "Required CSV file is missing." `
      -RequiredColumns $RequiredColumns `
      -MissingColumns $RequiredColumns `
      -NextStep "Run the priority GSC export for this cluster and rebuild decision maps before public upload or URL action."
  }

  $headers = Read-CsvHeader -Path $Path
  if ($headers.Count -eq 0) {
    return New-CheckRow `
      -Cluster $Cluster `
      -ArtifactType $ArtifactType `
      -Artifact $relative `
      -Status "BLOCKED_EMPTY_FILE" `
      -Severity "BLOCKED" `
      -Detail "CSV exists but has no header row." `
      -RequiredColumns $RequiredColumns `
      -MissingColumns $RequiredColumns `
      -NextStep "Regenerate the export; do not use this artifact for upload decisions."
  }

  $missingColumns = @($RequiredColumns | Where-Object { $headers -notcontains $_ })
  if ($missingColumns.Count -gt 0) {
    return New-CheckRow `
      -Cluster $Cluster `
      -ArtifactType $ArtifactType `
      -Artifact $relative `
      -Status "BLOCKED_BAD_COLUMNS" `
      -Severity "BLOCKED" `
      -Detail "CSV exists but required columns are missing." `
      -RequiredColumns $RequiredColumns `
      -MissingColumns $missingColumns `
      -NextStep "Regenerate the export with the current repo scripts."
  }

  try {
    $rows = @(Import-Csv -LiteralPath $Path)
  } catch {
    return New-CheckRow `
      -Cluster $Cluster `
      -ArtifactType $ArtifactType `
      -Artifact $relative `
      -Status "BLOCKED_CSV_PARSE_FAILED" `
      -Severity "BLOCKED" `
      -Detail $_.Exception.Message `
      -RequiredColumns $RequiredColumns `
      -NextStep "Fix or regenerate the CSV before using it."
  }

  if ($RequireRows -and -not $AllowEmptyExports -and $rows.Count -eq 0) {
    return New-CheckRow `
      -Cluster $Cluster `
      -ArtifactType $ArtifactType `
      -Artifact $relative `
      -Status "BLOCKED_EMPTY_EXPORT" `
      -Severity "BLOCKED" `
      -Detail "CSV has the expected columns but no data rows." `
      -Rows $rows.Count `
      -RequiredColumns $RequiredColumns `
      -NextStep "Confirm the GSC property/date range and rerun. Use -AllowEmptyExports only after manual review."
  }

  if ($rows.Count -eq 0) {
    return New-CheckRow `
      -Cluster $Cluster `
      -ArtifactType $ArtifactType `
      -Artifact $relative `
      -Status $EmptyStatus `
      -Severity "REVIEW" `
      -Detail "CSV has the expected columns but no data rows; this can be valid for cannibalization only." `
      -Rows $rows.Count `
      -RequiredColumns $RequiredColumns `
      -NextStep "Review manually before treating the lack of rows as evidence."
  }

  return New-CheckRow `
    -Cluster $Cluster `
    -ArtifactType $ArtifactType `
    -Artifact $relative `
    -Status "VERIFIED_CSV_READY" `
    -Severity "OK" `
    -Detail "CSV exists, parses, has required columns and has data rows." `
    -Rows $rows.Count `
    -RequiredColumns $RequiredColumns `
    -NextStep "Use this artifact only together with the matching focused decision-map summary."
}

function Test-JsonSummary {
  param(
    [string]$Cluster,
    [string]$ArtifactType,
    [string]$Path,
    [string[]]$RequiredProperties,
    [switch]$RequireFocusedDecisionMap,
    [string]$ExpectedDirName = ""
  )

  $relative = Get-RelativePath $Path
  if (-not (Test-Path -LiteralPath $Path)) {
    return New-CheckRow `
      -Cluster $Cluster `
      -ArtifactType $ArtifactType `
      -Artifact $relative `
      -Status "BLOCKED_MISSING_FILE" `
      -Severity "BLOCKED" `
      -Detail "Required JSON summary is missing." `
      -RequiredColumns $RequiredProperties `
      -MissingColumns $RequiredProperties `
      -NextStep "Regenerate the matching export or decision map."
  }

  try {
    $json = Get-Content -Raw -LiteralPath $Path -Encoding UTF8 | ConvertFrom-Json
  } catch {
    return New-CheckRow `
      -Cluster $Cluster `
      -ArtifactType $ArtifactType `
      -Artifact $relative `
      -Status "BLOCKED_JSON_PARSE_FAILED" `
      -Severity "BLOCKED" `
      -Detail $_.Exception.Message `
      -RequiredColumns $RequiredProperties `
      -NextStep "Regenerate the JSON summary."
  }

  $summary = $json
  if ($json.PSObject.Properties.Name -contains "summary") {
    $summary = $json.summary
  }

  $propertyNames = @($summary.PSObject.Properties.Name)
  $missingProperties = @($RequiredProperties | Where-Object { $propertyNames -notcontains $_ })
  if ($missingProperties.Count -gt 0) {
    return New-CheckRow `
      -Cluster $Cluster `
      -ArtifactType $ArtifactType `
      -Artifact $relative `
      -Status "BLOCKED_BAD_JSON_SUMMARY" `
      -Severity "BLOCKED" `
      -Detail "JSON exists but required summary properties are missing." `
      -RequiredColumns $RequiredProperties `
      -MissingColumns $missingProperties `
      -NextStep "Regenerate the artifact with the current repo scripts."
  }

  if ($ExpectedDirName -and $summary.outputDir -and -not ([string]$summary.outputDir).Contains($ExpectedDirName)) {
    return New-CheckRow `
      -Cluster $Cluster `
      -ArtifactType $ArtifactType `
      -Artifact $relative `
      -Status "BLOCKED_WRONG_OUTPUT_DIR" `
      -Severity "BLOCKED" `
      -Detail "Summary outputDir does not point at the expected report-date folder." `
      -RequiredColumns $RequiredProperties `
      -NextStep "Rerun the export with the intended -ReportDate."
  }

  if ($RequireFocusedDecisionMap) {
    if ($summary.inputMode -ne "FOCUSED_GSC_EXPORT" -or $summary.finality -ne "READY_FOR_OWNER_REVIEW_AFTER_EXPORT_VALIDATION") {
      return New-CheckRow `
        -Cluster $Cluster `
        -ArtifactType $ArtifactType `
        -Artifact $relative `
        -Status "BLOCKED_DECISION_MAP_NOT_FOCUSED" `
        -Severity "BLOCKED" `
        -Detail "Decision-map summary is not from a focused GSC export. inputMode=$($summary.inputMode); finality=$($summary.finality)." `
        -RequiredColumns $RequiredProperties `
        -NextStep "Run the real focused GSC export and rebuild the decision map before using it."
    }
  }

  return New-CheckRow `
    -Cluster $Cluster `
    -ArtifactType $ArtifactType `
    -Artifact $relative `
    -Status "VERIFIED_JSON_READY" `
    -Severity "OK" `
    -Detail "JSON exists, parses and has the expected summary shape." `
    -RequiredColumns $RequiredProperties `
    -NextStep "Review with matching CSV artifacts before any public action."
}

function New-ClusterSpec {
  param(
    [string]$Key,
    [string]$Label,
    [string]$ExportDirName,
    [string]$ExportPrefix,
    [string]$DecisionPrefix,
    [string]$ProtectedDecisionPrefix,
    [string]$CannibalizationDecisionPrefix,
    [string[]]$DecisionColumns,
    [string[]]$DecisionCannibalizationColumns,
    [string[]]$ExportSummaryProperties,
    [string[]]$DecisionSummaryProperties
  )

  $exportDir = Join-RepoPath "reports\gsc\$ExportDirName"
  return @{
    key = $Key
    label = $Label
    exportDir = $exportDir
    exportDirName = $ExportDirName
    exportPrefix = $ExportPrefix
    decisionFiles = @(
      @{ type = "decision-map"; path = (Join-RepoPath "reports\$DecisionPrefix-$ReportDate.csv"); columns = $DecisionColumns; requireRows = $true; emptyStatus = "BLOCKED_EMPTY_DECISION_MAP" },
      @{ type = "protected-decision-map"; path = (Join-RepoPath "reports\$ProtectedDecisionPrefix-$ReportDate.csv"); columns = $DecisionColumns; requireRows = $true; emptyStatus = "BLOCKED_EMPTY_PROTECTED_MAP" },
      @{ type = "cannibalization-decision-map"; path = (Join-RepoPath "reports\$CannibalizationDecisionPrefix-$ReportDate.csv"); columns = $DecisionCannibalizationColumns; requireRows = $false; emptyStatus = "NOT_VERIFIED_EMPTY_CANNIBALIZATION_MAP" }
    )
    exportSummaryProperties = $ExportSummaryProperties
    decisionSummary = @{
      path = (Join-RepoPath "reports\$DecisionPrefix-$ReportDate.json")
      properties = $DecisionSummaryProperties
    }
  }
}

$exportPageColumns = @("role", "path", "page", "clicks", "impressions", "ctr", "position")
$exportQueryPageColumns = @("match_type", "query", "path", "page", "clicks", "impressions", "ctr", "position")
$exportCannibalizationColumns = @("query", "page_count", "total_clicks", "total_impressions", "pages", "positions", "decision_use")
$exportProtectedColumns = @("path", "status", "clicks", "impressions", "ctr", "position", "risk_note")
$exportSummaryBase = @("generatedAt", "siteUrl", "startDate", "endDate", "outputDir", "safety")

$familyDecisionColumns = @("group", "path", "mapped_target", "live_status", "final_path", "gsc_clicks", "gsc_impressions", "gsc_position", "risk", "proposed_action", "required_before_action", "status")
$familyCannibalizationDecisionColumns = @("query", "page_count", "total_clicks", "total_impressions", "pages", "positions", "risk", "proposed_action", "status")
$priorityDecisionColumns = @("group", "path", "mapped_target", "role_or_topic", "live_or_route_status", "gsc_clicks", "gsc_impressions", "gsc_position", "metric_source", "risk", "proposed_action", "required_before_action", "blocked_actions", "status")
$priorityCannibalizationDecisionColumns = @("source", "query", "page_count", "total_clicks", "total_impressions", "pages", "positions", "risk", "proposed_action", "status")
$decisionSummaryBase = @("generatedAt", "inputMode", "reportDate", "finality", "outputs")

$specs = @{
  family = New-ClusterSpec `
    -Key "family" `
    -Label "Family/Divorce" `
    -ExportDirName "family-divorce-$ReportDate" `
    -ExportPrefix "family-divorce" `
    -DecisionPrefix "family-divorce-gsc-decision-map" `
    -ProtectedDecisionPrefix "family-divorce-protected-url-decision-map" `
    -CannibalizationDecisionPrefix "family-divorce-cannibalization-decision-map" `
    -DecisionColumns $familyDecisionColumns `
    -DecisionCannibalizationColumns $familyCannibalizationDecisionColumns `
    -ExportSummaryProperties ($exportSummaryBase + @("familyPageRows", "familyQueryPageRows", "cannibalizationGroups", "protectedSourcesWithGscRows")) `
    -DecisionSummaryProperties ($decisionSummaryBase + @("targetRows", "protectedRows", "cannibalizationRows"))

  criminal = New-ClusterSpec `
    -Key "criminal" `
    -Label "Criminal Law" `
    -ExportDirName "criminal-law-$ReportDate" `
    -ExportPrefix "criminal-law" `
    -DecisionPrefix "criminal-gsc-decision-map" `
    -ProtectedDecisionPrefix "criminal-protected-url-decision-map" `
    -CannibalizationDecisionPrefix "criminal-cannibalization-decision-map" `
    -DecisionColumns $priorityDecisionColumns `
    -DecisionCannibalizationColumns $priorityCannibalizationDecisionColumns `
    -ExportSummaryProperties ($exportSummaryBase + @("criminalPageRows", "criminalQueryPageRows", "cannibalizationGroups", "protectedSourcesWithGscRows")) `
    -DecisionSummaryProperties ($decisionSummaryBase + @("targetRows", "protectedRows", "cannibalizationRows"))

  medical = New-ClusterSpec `
    -Key "medical" `
    -Label "Medical Malpractice" `
    -ExportDirName "medical-malpractice-$ReportDate" `
    -ExportPrefix "medical-malpractice" `
    -DecisionPrefix "medical-malpractice-gsc-decision-map" `
    -ProtectedDecisionPrefix "medical-malpractice-protected-url-decision-map" `
    -CannibalizationDecisionPrefix "medical-malpractice-cannibalization-decision-map" `
    -DecisionColumns $priorityDecisionColumns `
    -DecisionCannibalizationColumns $priorityCannibalizationDecisionColumns `
    -ExportSummaryProperties ($exportSummaryBase + @("medicalPageRows", "medicalQueryPageRows", "cannibalizationGroups", "protectedSourcesWithGscRows")) `
    -DecisionSummaryProperties ($decisionSummaryBase + @("decisionRows", "targetRows", "protectedRows", "cannibalizationRows"))
}

$results = @()

foreach ($cluster in $Clusters) {
  $spec = $specs[$cluster]
  $exportDir = $spec.exportDir
  $exportDirRelative = Get-RelativePath $exportDir

  if (Test-Path -LiteralPath $exportDir) {
    $results += New-CheckRow `
      -Cluster $spec.label `
      -ArtifactType "export-directory" `
      -Artifact $exportDirRelative `
      -Status "VERIFIED_DIRECTORY_EXISTS" `
      -Severity "OK" `
      -Detail "Focused export directory exists." `
      -NextStep "Validate the CSV and summary files in this directory."
  } else {
    $results += New-CheckRow `
      -Cluster $spec.label `
      -ArtifactType "export-directory" `
      -Artifact $exportDirRelative `
      -Status "BLOCKED_EXPORT_DIRECTORY_MISSING" `
      -Severity "BLOCKED" `
      -Detail "Focused export directory is missing for this report date." `
      -NextStep "Run .\tools\gsc\run-priority-cluster-gsc-exports.ps1 after OAuth setup."
  }

  $exportFiles = @(
    @{ type = "export-pages"; path = (Join-Path $exportDir "$($spec.exportPrefix)-pages.csv"); columns = $exportPageColumns; requireRows = $true; emptyStatus = "BLOCKED_EMPTY_PAGES_EXPORT" },
    @{ type = "export-query-page"; path = (Join-Path $exportDir "$($spec.exportPrefix)-query-page.csv"); columns = $exportQueryPageColumns; requireRows = $true; emptyStatus = "BLOCKED_EMPTY_QUERY_PAGE_EXPORT" },
    @{ type = "export-cannibalization"; path = (Join-Path $exportDir "$($spec.exportPrefix)-cannibalization.csv"); columns = $exportCannibalizationColumns; requireRows = $false; emptyStatus = "NOT_VERIFIED_EMPTY_CANNIBALIZATION_EXPORT" },
    @{ type = "export-protected-sources"; path = (Join-Path $exportDir "$($spec.exportPrefix)-protected-sources.csv"); columns = $exportProtectedColumns; requireRows = $true; emptyStatus = "BLOCKED_EMPTY_PROTECTED_EXPORT" }
  )

  foreach ($fileSpec in $exportFiles) {
    $results += Test-CsvArtifact `
      -Cluster $spec.label `
      -ArtifactType $fileSpec.type `
      -Path $fileSpec.path `
      -RequiredColumns $fileSpec.columns `
      -RequireRows $fileSpec.requireRows `
      -EmptyStatus $fileSpec.emptyStatus
  }

  $results += Test-JsonSummary `
    -Cluster $spec.label `
    -ArtifactType "export-summary" `
    -Path (Join-Path $exportDir "$($spec.exportPrefix)-summary.json") `
    -RequiredProperties $spec.exportSummaryProperties `
    -ExpectedDirName $spec.exportDirName

  foreach ($fileSpec in $spec.decisionFiles) {
    $results += Test-CsvArtifact `
      -Cluster $spec.label `
      -ArtifactType $fileSpec.type `
      -Path $fileSpec.path `
      -RequiredColumns $fileSpec.columns `
      -RequireRows $fileSpec.requireRows `
      -EmptyStatus $fileSpec.emptyStatus
  }

  $results += Test-JsonSummary `
    -Cluster $spec.label `
    -ArtifactType "decision-map-summary" `
    -Path $spec.decisionSummary.path `
    -RequiredProperties $spec.decisionSummary.properties `
    -RequireFocusedDecisionMap
}

$blocked = @($results | Where-Object { $_.severity -eq "BLOCKED" })
$review = @($results | Where-Object { $_.severity -eq "REVIEW" })
$verified = @($results | Where-Object { $_.severity -eq "OK" })

$summary = [pscustomobject]@{
  report_date = $ReportDate
  clusters = ($Clusters -join "|")
  verified = $verified.Count
  review = $review.Count
  blocked = $blocked.Count
  result = if ($blocked.Count -gt 0) { "BLOCKED_EXPORT_VALIDATION" } else { "VERIFIED_EXPORT_OUTPUTS_READY_FOR_OWNER_REVIEW" }
}

if ($WriteReport) {
  $csvPath = Join-RepoPath "project-control\gsc-priority-export-output-validator-$ReportDate.csv"
  $mdPath = Join-RepoPath "project-control\gsc-priority-export-output-validator-$ReportDate.md"

  $results | Export-Csv -LiteralPath $csvPath -NoTypeInformation -Encoding UTF8

  $lines = @(
    "# GSC Priority Export Output Validator - $ReportDate",
    "",
    "## Status",
    "- Result: $($summary.result)",
    "- VERIFIED rows: $($summary.verified)",
    "- REVIEW rows: $($summary.review)",
    "- BLOCKED rows: $($summary.blocked)",
    "",
    "## What This Checks",
    '- Focused export directories under `reports/gsc/` for Family/Divorce, Criminal Law and Medical Malpractice.',
    "- Required export CSV files, required columns and non-empty page/query/protected-source exports.",
    "- Export summary JSON shape and report-date output directory.",
    "- Decision-map CSV files and summary JSON.",
    '- Decision maps must be rebuilt from `FOCUSED_GSC_EXPORT`; baseline dashboard/cache maps remain blocked.',
    "",
    "## How To Run After OAuth Setup",
    '```powershell',
    ".\tools\gsc\run-priority-cluster-gsc-exports.ps1 -ReportDate $ReportDate",
    ".\tools\gsc\check-priority-gsc-export-output.ps1 -ReportDate $ReportDate -WriteReport",
    '```',
    "",
    "## Result Rows",
    "",
    "| Cluster | Artifact Type | Status | Severity | Rows | Artifact |",
    "|---|---|---:|---:|---:|---|"
  )

  foreach ($row in $results) {
    $artifact = ($row.artifact -replace "\|", "\`|")
    $artifactCode = '`' + $artifact + '`'
    $lines += "| $($row.cluster) | $($row.artifact_type) | $($row.status) | $($row.severity) | $($row.rows) | $artifactCode |"
  }

  $lines += @(
    "",
    "## Safety",
    "- VERIFIED: this validator is local/read-only. It does not call GSC, OAuth, WordPress, wp-admin, uPress or any public API.",
    "- BLOCKED: this validator does not approve CMS upload, URL migration, redirects, canonicals/noindex, sitemap, taxonomy, internal-link, lawyer, lead or CRM actions.",
    '- NEXT: fix every `BLOCKED_*` row before treating priority cluster decision maps as upload evidence.'
  )

  Set-Content -LiteralPath $mdPath -Value $lines -Encoding UTF8
}

$summary | ConvertTo-Json -Depth 4
$results | Sort-Object cluster, artifact_type | Format-Table cluster, artifact_type, status, severity, rows, artifact -AutoSize

if ($blocked.Count -gt 0) {
  exit 1
}
