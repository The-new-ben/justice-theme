param(
  [string]$ReportDate = (Get-Date -Format "yyyy-MM-dd"),
  [string]$CredentialPath = $env:GSC_OAUTH_CLIENT_PATH,
  [string]$TokenPath = $env:GSC_TOKEN_PATH,
  [string]$MedicalDashboard = "",
  [ValidateSet("family", "criminal", "medical")]
  [string[]]$Clusters = @("family", "criminal", "medical"),
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$powerShellExe = (Get-Process -Id $PID).Path

function Invoke-ClusterWorkflow {
  param(
    [string]$Name,
    [string]$Script,
    [string[]]$ExtraArgs = @()
  )

  $arguments = @(
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    $Script,
    "-ReportDate",
    $ReportDate
  )

  if ($CredentialPath) {
    $arguments += @("-CredentialPath", $CredentialPath)
  }
  if ($TokenPath) {
    $arguments += @("-TokenPath", $TokenPath)
  }
  if ($DryRun) {
    $arguments += "-DryRun"
  }
  if ($ExtraArgs.Count -gt 0) {
    $arguments += $ExtraArgs
  }

  Write-Host "RUNNING: $Name GSC workflow"
  & $powerShellExe $arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Name GSC workflow failed with exit code $LASTEXITCODE"
  }
  Write-Host "VERIFIED: $Name GSC workflow completed"
}

if ($CredentialPath) {
  $env:GSC_OAUTH_CLIENT_PATH = $CredentialPath
}
if ($TokenPath) {
  $env:GSC_TOKEN_PATH = $TokenPath
}

Push-Location $repoRoot
try {
  $clusterSet = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
  foreach ($cluster in $Clusters) {
    [void]$clusterSet.Add($cluster)
  }

  if ($clusterSet.Contains("family")) {
    Invoke-ClusterWorkflow `
      -Name "Family/Divorce" `
      -Script (Join-Path $repoRoot "tools\gsc\run-family-divorce-gsc-workflow.ps1")
  }

  if ($clusterSet.Contains("criminal")) {
    Invoke-ClusterWorkflow `
      -Name "Criminal Law" `
      -Script (Join-Path $repoRoot "tools\gsc\run-criminal-gsc-export.ps1")
  }

  if ($clusterSet.Contains("medical")) {
    $extraArgs = @()
    if ($MedicalDashboard) {
      $extraArgs += @("-Dashboard", $MedicalDashboard)
    }

    Invoke-ClusterWorkflow `
      -Name "Medical Malpractice" `
      -Script (Join-Path $repoRoot "tools\gsc\run-medical-malpractice-gsc-export.ps1") `
      -ExtraArgs $extraArgs
  }

  if ($DryRun) {
    Write-Host "VERIFIED: priority-cluster dry run completed; no OAuth browser opened and no GSC API call was made."
  } else {
    Write-Host "VERIFIED: priority-cluster GSC exports completed for $ReportDate."
    Write-Host "VERIFY NEXT: review Family/Divorce, Criminal and Medical Malpractice decision maps before any CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy or internal-link action."
  }
} finally {
  Pop-Location
}
