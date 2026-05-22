param(
  [string]$ReportDate = (Get-Date -Format "yyyy-MM-dd"),
  [string]$OutputDir = "",
  [string]$CredentialPath = $env:GSC_OAUTH_CLIENT_PATH,
  [string]$TokenPath = $env:GSC_TOKEN_PATH,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
if ([string]::IsNullOrWhiteSpace($OutputDir)) {
  $OutputDir = Join-Path $repoRoot "reports\gsc\criminal-law-$ReportDate"
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
    "tools/gsc/gsc-criminal-export.js",
    "--outputDir=$OutputDir"
  )

  if ($DryRun) {
    Invoke-Checked @("node", $exportArgs[0], $exportArgs[1], "--dry-run")
    Write-Host "VERIFIED: dry run completed; no OAuth browser opened and no GSC API call made."
    exit 0
  }

  Invoke-Checked @("node", $exportArgs[0], $exportArgs[1])

  Invoke-Checked @(
    "node",
    "tools/build-criminal-gsc-decision-map.mjs",
    "--gscDir=$OutputDir",
    "--reportDate=$ReportDate"
  )

  Write-Host "VERIFIED: Criminal Law GSC export completed for $ReportDate."
  Write-Host "VERIFY NEXT: review reports\criminal-gsc-decision-map-$ReportDate.csv, reports\criminal-cannibalization-decision-map-$ReportDate.csv and reports\criminal-protected-url-decision-map-$ReportDate.csv before any URL decision."
} finally {
  Pop-Location
}
