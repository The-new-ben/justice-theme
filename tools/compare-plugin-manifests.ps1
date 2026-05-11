param(
    [string] $RepoManifest = "project-control/ultra-justice-engine-repo-manifest.csv",
    [string] $LiveManifest = "project-control/live-active-plugin-manifest.csv",
    [string] $OutputCsv = "project-control/live-plugin-manifest-comparison.csv"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $RepoManifest)) {
    Write-Host "BLOCKED: repo manifest not found: $RepoManifest"
    exit 2
}

if (-not (Test-Path -LiteralPath $LiveManifest)) {
    Write-Host "BLOCKED: live manifest not found: $LiveManifest"
    Write-Host "Run tools/export-plugin-manifest-diagnostic.ps1 with a WordPress Application Password first."
    exit 2
}

$repoRows = Import-Csv -LiteralPath $RepoManifest
$liveRows = Import-Csv -LiteralPath $LiveManifest

$repoByPath = @{}
foreach ($row in $repoRows) {
    $repoByPath[$row.path] = $row
}

$liveByPath = @{}
foreach ($row in $liveRows) {
    $liveByPath[$row.path] = $row
}

$allPaths = @($repoByPath.Keys + $liveByPath.Keys) | Sort-Object -Unique
$comparison = foreach ($path in $allPaths) {
    $repo = $repoByPath[$path]
    $live = $liveByPath[$path]

    $status = "MATCH"
    if (-not $repo) {
        $status = "LIVE_ONLY"
    } elseif (-not $live) {
        $status = "REPO_ONLY"
    } elseif ([string]$repo.sha256 -ne [string]$live.sha256) {
        $status = "HASH_MISMATCH"
    } elseif ([int64]$repo.bytes -ne [int64]$live.bytes) {
        $status = "SIZE_MISMATCH"
    }

    [pscustomobject]@{
        path = $path
        status = $status
        repo_bytes = if ($repo) { $repo.bytes } else { "" }
        live_bytes = if ($live) { $live.bytes } else { "" }
        repo_sha256 = if ($repo) { $repo.sha256 } else { "" }
        live_sha256 = if ($live) { $live.sha256 } else { "" }
    }
}

$outputDirectory = Split-Path -Parent $OutputCsv
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}

$comparison | Export-Csv -LiteralPath $OutputCsv -NoTypeInformation -Encoding UTF8

$summary = $comparison | Group-Object status | Sort-Object Name | ForEach-Object {
    [pscustomobject]@{
        status = $_.Name
        count = $_.Count
    }
}

Write-Host "PLUGIN MANIFEST COMPARISON"
Write-Host "Repo: $RepoManifest"
Write-Host "Live: $LiveManifest"
Write-Host "Output: $OutputCsv"
Write-Host ""
$summary | Format-Table -AutoSize

$problemCount = @($comparison | Where-Object status -ne "MATCH").Count
if ($problemCount -gt 0) {
    Write-Host "RESULT: REVIEW - manifest differences found."
    exit 1
}

Write-Host "RESULT: VERIFIED - manifests match."
