param(
  [string]$ReportDate = (Get-Date -Format "yyyy-MM-dd"),
  [string]$OutputDir = "",
  [string]$CredentialPath = $env:GSC_OAUTH_CLIENT_PATH,
  [string]$TokenPath = $env:GSC_TOKEN_PATH,
  [switch]$DryRun,
  [switch]$SkipExport
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
if ([string]::IsNullOrWhiteSpace($OutputDir)) {
  $OutputDir = Join-Path $repoRoot "reports\gsc\family-divorce-$ReportDate"
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

Push-Location $repoRoot
try {
  $exportArgs = @(
    "tools/gsc/gsc-family-divorce-export.js",
    "--outputDir=$OutputDir"
  )

  if ($DryRun) {
    Invoke-Checked @("node", $exportArgs[0], $exportArgs[1], "--dry-run")
    Write-Host "VERIFIED: dry run completed; no OAuth browser opened and no GSC API call made."
    exit 0
  }

  if (-not $SkipExport) {
    Invoke-Checked @("node", $exportArgs[0], $exportArgs[1])
  } elseif (-not (Test-Path $OutputDir)) {
    throw "SkipExport was set but OutputDir does not exist: $OutputDir"
  }

  Invoke-Checked @(
    "node",
    "tools/build-family-divorce-gsc-decision-map.mjs",
    "--gscDir=$OutputDir",
    "--reportDate=$ReportDate"
  )

  Invoke-Checked @(
    "node",
    "tools/build-family-divorce-protected-url-review-packet.mjs",
    "--reportDate=$ReportDate",
    "--input=reports/family-divorce-protected-url-decision-map-$ReportDate.csv"
  )

  Write-Host "VERIFIED: Family/Divorce GSC workflow completed for $ReportDate."
  Write-Host "VERIFY NEXT: review reports/family-divorce-gsc-decision-map-$ReportDate.csv and project-control/family-divorce-protected-url-owner-review-packet-$ReportDate.csv before any URL decision."
} finally {
  Pop-Location
}
