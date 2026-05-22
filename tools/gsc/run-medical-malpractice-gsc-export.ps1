param(
  [string]$ReportDate = (Get-Date -Format "yyyy-MM-dd"),
  [string]$OutputDir = "",
  [string]$Dashboard = "",
  [string]$CredentialPath = $env:GSC_OAUTH_CLIENT_PATH,
  [string]$TokenPath = $env:GSC_TOKEN_PATH,
  [switch]$DryRun,
  [switch]$SkipExport
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
if ([string]::IsNullOrWhiteSpace($OutputDir)) {
  $OutputDir = Join-Path $repoRoot "reports\gsc\medical-malpractice-$ReportDate"
}

if ([string]::IsNullOrWhiteSpace($Dashboard)) {
  $latestDashboard = Get-ChildItem -Path (Join-Path $repoRoot "project-control") -Filter "medical-malpractice-readiness-dashboard-*.csv" |
    Sort-Object Name -Descending |
    Select-Object -First 1
  if ($latestDashboard) {
    $Dashboard = $latestDashboard.FullName
  }
}

function Invoke-Checked {
  param([string[]]$Command)

  & $Command[0] $Command[1..($Command.Length - 1)]
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed with exit code ${LASTEXITCODE}: $($Command -join ' ')"
  }
}

if ($CredentialPath) {
  $env:GSC_OAUTH_CLIENT_PATH = $CredentialPath
}
if ($TokenPath) {
  $env:GSC_TOKEN_PATH = $TokenPath
}
if ($Dashboard) {
  $env:MEDICAL_MALPRACTICE_READINESS_DASHBOARD_CSV = $Dashboard
}

Push-Location $repoRoot
try {
  $exportArgs = @(
    "tools/gsc/gsc-medical-malpractice-export.js",
    "--outputDir=$OutputDir"
  )
  if ($Dashboard) {
    $exportArgs += "--dashboard=$Dashboard"
  }

  if ($DryRun) {
    $dryRunCommand = @("node") + $exportArgs + @("--dry-run")
    Invoke-Checked $dryRunCommand
    Write-Host "VERIFIED: dry run completed; no OAuth browser opened and no GSC API call made."
    exit 0
  }

  if (-not $SkipExport) {
    $exportCommand = @("node") + $exportArgs
    Invoke-Checked $exportCommand
  } elseif (-not (Test-Path $OutputDir)) {
    throw "SkipExport was set but OutputDir does not exist: $OutputDir"
  }

  Invoke-Checked @(
    "node",
    "tools/build-medical-malpractice-gsc-decision-map.mjs",
    "--gscDir=$OutputDir",
    "--reportDate=$ReportDate",
    "--dashboard=$Dashboard"
  )

  Write-Host "VERIFIED: Medical Malpractice GSC workflow completed for $ReportDate."
  Write-Host "VERIFY NEXT: review reports\medical-malpractice-gsc-decision-map-$ReportDate.csv, reports\medical-malpractice-protected-url-decision-map-$ReportDate.csv and reports\medical-malpractice-cannibalization-decision-map-$ReportDate.csv before any URL decision."
} finally {
  Pop-Location
}
