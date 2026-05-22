param(
  [string]$CredentialPath = $env:GSC_OAUTH_CLIENT_PATH,
  [string]$TokenPath = $env:GSC_TOKEN_PATH,
  [ValidateSet("family", "criminal", "medical")]
  [string[]]$Clusters = @("family", "criminal", "medical"),
  [switch]$RunPriorityDryRun
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$gscRoot = Resolve-Path $PSScriptRoot

$results = New-Object System.Collections.Generic.List[object]

function Add-Result {
  param(
    [string]$Check,
    [string]$Status,
    [string]$Detail,
    [string]$NextStep = ""
  )

  $results.Add([pscustomobject]@{
    check = $Check
    status = $Status
    detail = $Detail
    next_step = $NextStep
  })
}

function Test-UnderRepo {
  param([string]$Path)

  if (-not $Path) {
    return $false
  }

  $fullPath = [System.IO.Path]::GetFullPath($Path)
  $repoPath = [System.IO.Path]::GetFullPath($repoRoot)
  return $fullPath.StartsWith($repoPath, [System.StringComparison]::OrdinalIgnoreCase)
}

function Get-RelativeToRepo {
  param([string]$Path)

  $fullPath = [System.IO.Path]::GetFullPath($Path)
  $repoPath = [System.IO.Path]::GetFullPath($repoRoot)
  if (-not $fullPath.StartsWith($repoPath, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $Path
  }
  return $fullPath.Substring($repoPath.Length).TrimStart("\", "/")
}

function Test-GitTracked {
  param([string]$Path)

  if (-not (Test-UnderRepo $Path)) {
    return $false
  }
  $relative = Get-RelativeToRepo $Path
  $tracked = & git -C $repoRoot ls-files -- $relative
  return -not [string]::IsNullOrWhiteSpace(($tracked -join ""))
}

function Test-GitIgnored {
  param([string]$Path)

  if (-not (Test-UnderRepo $Path)) {
    return $true
  }
  $relative = Get-RelativeToRepo $Path
  & git -C $repoRoot check-ignore -q -- $relative
  return $LASTEXITCODE -eq 0
}

Push-Location $repoRoot
try {
  $nodeCommand = Get-Command node -ErrorAction SilentlyContinue
  if ($nodeCommand) {
    $nodeVersion = (& node --version)
    Add-Result "node_runtime" "VERIFIED" "Node is available: $nodeVersion"
  } else {
    Add-Result "node_runtime" "BLOCKED" "Node is not available in PATH." "Install Node.js or run from the bundled workspace runtime before GSC export."
  }

  $packageJson = Join-Path $gscRoot "package.json"
  if (Test-Path $packageJson) {
    Add-Result "gsc_package_json" "VERIFIED" "tools/gsc/package.json exists."
  } else {
    Add-Result "gsc_package_json" "BLOCKED" "tools/gsc/package.json is missing." "Restore GSC tooling package metadata before export."
  }

  $googleApisPath = Join-Path $gscRoot "node_modules\googleapis"
  $openPath = Join-Path $gscRoot "node_modules\open"
  if ((Test-Path $googleApisPath) -and (Test-Path $openPath)) {
    Add-Result "gsc_node_dependencies" "VERIFIED" "Required local packages googleapis and open are installed under tools/gsc/node_modules."
  } else {
    Add-Result "gsc_node_dependencies" "BLOCKED" "Required local packages are not fully installed under tools/gsc/node_modules." "Run npm install from tools/gsc before export."
  }

  $priorityRunner = Join-Path $gscRoot "run-priority-cluster-gsc-exports.ps1"
  if (Test-Path $priorityRunner) {
    Add-Result "priority_runner" "VERIFIED" "Priority cluster runner exists."
  } else {
    Add-Result "priority_runner" "BLOCKED" "Priority cluster runner is missing." "Restore tools/gsc/run-priority-cluster-gsc-exports.ps1 before export."
  }

  if ([string]::IsNullOrWhiteSpace($CredentialPath)) {
    Add-Result "oauth_client_path" "BLOCKED" "No OAuth client path was provided." 'Set $env:GSC_OAUTH_CLIENT_PATH to the OAuth Desktop client JSON path outside Git.'
  } elseif (-not (Test-Path $CredentialPath)) {
    Add-Result "oauth_client_file" "BLOCKED" "OAuth client file does not exist at the provided path." "Check the downloaded Google Cloud Desktop OAuth JSON path."
  } else {
    Add-Result "oauth_client_file" "VERIFIED" "OAuth client file exists. Secret values were not printed."

    try {
      $oauth = Get-Content -Raw -LiteralPath $CredentialPath | ConvertFrom-Json
      $client = $oauth.installed
      if (-not $client) {
        $client = $oauth.web
      }

      if ($client -and $client.client_id -and $client.client_secret -and $client.auth_uri -and $client.token_uri) {
        Add-Result "oauth_client_shape" "VERIFIED" "OAuth client JSON has the expected client_id, client_secret, auth_uri and token_uri fields."
      } else {
        Add-Result "oauth_client_shape" "BLOCKED" "OAuth client JSON is missing expected Desktop OAuth fields." "Create a Google Cloud OAuth Desktop client and download the JSON again."
      }
    } catch {
      Add-Result "oauth_client_shape" "BLOCKED" "OAuth client JSON could not be parsed." "Download a fresh OAuth client JSON file from Google Cloud."
    }

    if (Test-GitTracked $CredentialPath) {
      Add-Result "oauth_client_git_tracking" "BLOCKED" "OAuth client file is tracked by Git." "Remove it from Git tracking and rotate the OAuth client before use."
    } elseif (Test-UnderRepo $CredentialPath) {
      if (Test-GitIgnored $CredentialPath) {
        Add-Result "oauth_client_git_tracking" "VERIFIED" "OAuth client file is inside the repo but ignored by Git."
      } else {
        Add-Result "oauth_client_git_tracking" "BLOCKED" "OAuth client file is inside the repo and not ignored by Git." "Move it outside the repo or add an ignore rule before use."
      }
    } else {
      Add-Result "oauth_client_git_tracking" "VERIFIED" "OAuth client file is outside the repo."
    }
  }

  if ([string]::IsNullOrWhiteSpace($TokenPath)) {
    Add-Result "token_path" "BLOCKED" "No token path was provided." 'Set $env:GSC_TOKEN_PATH to a local JSON path outside Git, for example C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json.'
  } else {
    $tokenParent = Split-Path -Parent $TokenPath
    if ($tokenParent -and (Test-Path $tokenParent)) {
      Add-Result "token_parent" "VERIFIED" "Token parent folder exists. Token file may be created on first OAuth approval."
    } else {
      Add-Result "token_parent" "BLOCKED" "Token parent folder does not exist." "Create the token folder before first OAuth run."
    }

    if (Test-Path $TokenPath) {
      if (Test-GitTracked $TokenPath) {
        Add-Result "token_git_tracking" "BLOCKED" "Token file is tracked by Git." "Remove it from Git tracking and revoke the token before reuse."
      } elseif (Test-UnderRepo $TokenPath) {
        if (Test-GitIgnored $TokenPath) {
          Add-Result "token_git_tracking" "VERIFIED" "Token file is inside the repo but ignored by Git."
        } else {
          Add-Result "token_git_tracking" "BLOCKED" "Token file is inside the repo and not ignored by Git." "Move it outside the repo or add an ignore rule before use."
        }
      } else {
        Add-Result "token_git_tracking" "VERIFIED" "Token file is outside the repo."
      }
    } elseif (Test-UnderRepo $TokenPath) {
      if (Test-GitIgnored $TokenPath) {
        Add-Result "token_git_tracking" "VERIFIED" "Planned token path is inside the repo but ignored by Git."
      } else {
        Add-Result "token_git_tracking" "BLOCKED" "Planned token path is inside the repo and not ignored by Git." "Move it outside the repo or add an ignore rule before first OAuth run."
      }
    } else {
      Add-Result "token_git_tracking" "VERIFIED" "Planned token path is outside the repo."
    }
  }

  if ($Clusters.Count -gt 0) {
    Add-Result "cluster_scope" "VERIFIED" ("Selected cluster scope: " + ($Clusters -join ", "))
  } else {
    Add-Result "cluster_scope" "BLOCKED" "No clusters selected." "Select family, criminal, medical or all three."
  }

  if ($RunPriorityDryRun) {
    $dryRunParams = @{
      DryRun = $true
      Clusters = $Clusters
    }
    if ($CredentialPath) {
      $dryRunParams.CredentialPath = $CredentialPath
    }
    if ($TokenPath) {
      $dryRunParams.TokenPath = $TokenPath
    }

    & $priorityRunner @dryRunParams
    if ($?) {
      Add-Result "priority_runner_dry_run" "VERIFIED" "Priority cluster dry run completed without opening OAuth or calling GSC."
    } else {
      Add-Result "priority_runner_dry_run" "BLOCKED" "Priority cluster dry run failed." "Fix the runner error before first OAuth export."
    }
  } else {
    Add-Result "priority_runner_dry_run" "NOT VERIFIED" "Priority runner dry run was not requested." "Add -RunPriorityDryRun to verify command wiring after paths are set."
  }

  $blockedCount = @($results | Where-Object { $_.status -eq "BLOCKED" }).Count
  $verifiedCount = @($results | Where-Object { $_.status -eq "VERIFIED" }).Count
  $notVerifiedCount = @($results | Where-Object { $_.status -eq "NOT VERIFIED" }).Count

  $summary = [pscustomobject]@{
    status = if ($blockedCount -eq 0) { "VERIFIED_PRECHECK_READY" } else { "BLOCKED_PRECHECK" }
    verified = $verifiedCount
    blocked = $blockedCount
    not_verified = $notVerifiedCount
    credential_path_provided = -not [string]::IsNullOrWhiteSpace($CredentialPath)
    token_path_provided = -not [string]::IsNullOrWhiteSpace($TokenPath)
    api_called = $false
    oauth_browser_opened = $false
    public_site_changed = $false
  }

  $results | Format-Table -AutoSize
  Write-Host ""
  $summary | ConvertTo-Json -Depth 3

  if ($blockedCount -gt 0) {
    exit 1
  }
} finally {
  Pop-Location
}
