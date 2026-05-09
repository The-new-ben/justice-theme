# build.ps1 — Justice Portal Build & Validation Script
# Usage: .\build.ps1
# Run from: C:\Users\pro\justice\

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root        = $PSScriptRoot
$PluginSrc   = Join-Path $Root "ultra-justice-engine"
$ThemeSrc    = Join-Path $Root "jus-tice-ui"
$PluginZip   = Join-Path $Root "ultra-justice-engine.zip"
$ThemeZip    = Join-Path $Root "jus-tice-ui.zip"
$Errors      = @()


Write-Host ""
Write-Host "=== Justice Portal Build Script ===" -ForegroundColor Cyan
Write-Host "Root: $Root"
Write-Host ""

# ─── 1. Validate Plugin Structure ───────────────────────────────────────────

Write-Host "--- Validating Plugin Structure ---" -ForegroundColor Yellow

$PluginMain = Join-Path $PluginSrc "ultra-justice-engine.php"
if (-not (Test-Path $PluginMain)) {
    $Errors += "MISSING: ultra-justice-engine.php"
} else {
    $header = Get-Content $PluginMain -Raw
    if ($header -notmatch "Plugin Name:") { $Errors += "MISSING: Plugin Name header in ultra-justice-engine.php" }
    if ($header -notmatch "Version:") { $Errors += "MISSING: Version in ultra-justice-engine.php" }
    $versionMatch = [regex]::Match($header, "Version:\s*(\S+)")
    if ($versionMatch.Success) {
        Write-Host "  Plugin Version: $($versionMatch.Groups[1].Value)" -ForegroundColor Green
    }
}

$RequiredIncludes = @(
    "includes/security.php",
    "includes/logger.php",
    "includes/cpt-articles.php",
    "includes/cpt-lawyers.php",
    "includes/taxonomy-practice-areas.php",
    "includes/taxonomy-city.php",
    "includes/lead-submissions.php",
    "includes/seeder.php",
    "includes/rest-health.php",
    "includes/rest-content-tools.php",
    "includes/rest-db-tools.php",
    "includes/admin-pages.php"
)

foreach ($inc in $RequiredIncludes) {
    $path = Join-Path $PluginSrc $inc
    if (-not (Test-Path $path)) {
        $Errors += "MISSING INCLUDE: ultra-justice-engine/$inc"
    } else {
        Write-Host "  OK: $inc" -ForegroundColor Green
    }
}

# ─── 2. Validate Theme Structure ────────────────────────────────────────────

Write-Host ""
Write-Host "--- Validating Theme Structure --- (REMOVED - Theme is deployed via Upress Git Sync)" -ForegroundColor Yellow

$StyleCSS = Join-Path $ThemeSrc "style.css"
if (Test-Path $StyleCSS) {
    $css = Get-Content $StyleCSS -Raw
    if ($css -notmatch "Theme Name:") { $Errors += "MISSING: Theme Name header in style.css" }
    if ($css -match "Template:") { $Errors += "WARNING: style.css contains Template: - this makes it a child theme! Remove unless intentional." }

    $vMatch = [regex]::Match($css, "Version:\s*(\S+)")
    if ($vMatch.Success) {
        Write-Host "  Theme Version: $($vMatch.Groups[1].Value)" -ForegroundColor Green
    }
}

# ─── 3. PHP Syntax Check ────────────────────────────────────────────────────

Write-Host ""
Write-Host "--- PHP Syntax Check ---" -ForegroundColor Yellow

$phpExe = "php"
try {
    $phpVersion = & $phpExe -v 2>&1 | Select-Object -First 1
    Write-Host "  PHP: $phpVersion" -ForegroundColor Gray
    
    $phpFiles = Get-ChildItem -Path $PluginSrc -Filter "*.php" -Recurse
    $phpFiles += Get-ChildItem -Path $ThemeSrc -Filter "*.php" -Recurse
    
    foreach ($phpFile in $phpFiles) {
        $result = & $phpExe -l $phpFile.FullName 2>&1
        if ($result -notmatch "No syntax errors") {
            $Errors += "PHP SYNTAX ERROR: $($phpFile.FullName): $result"
        }
    }
    Write-Host "  PHP syntax: checked $($phpFiles.Count) files" -ForegroundColor Green
} catch {
    Write-Host "  WARNING: PHP not found in PATH. Skipping syntax check." -ForegroundColor Yellow
}

# ─── 4. Check for justice-core-v3 conflict ──────────────────────────────────

Write-Host ""
Write-Host "--- Checking for Duplicate Plugin Conflict ---" -ForegroundColor Yellow

$V3Dir = Join-Path $Root "justice-core-v3"
if (Test-Path $V3Dir) {
    Write-Host "  WARNING: justice-core-v3/ folder exists locally." -ForegroundColor Red
    Write-Host "           This is the conflicting monolith plugin." -ForegroundColor Red
    Write-Host "           On the live server, deactivate justice-core-v3 before uploading v4." -ForegroundColor Red
}

# ─── 5. Stop on errors ──────────────────────────────────────────────────────

Write-Host ""
if ($Errors.Count -gt 0) {
    Write-Host "=== BUILD FAILED ===" -ForegroundColor Red
    foreach ($err in $Errors) {
        Write-Host "  ERROR: $err" -ForegroundColor Red
    }
    exit 1
}

Write-Host "=== All validations passed ===" -ForegroundColor Green

# ─── 6. Create Plugin ZIP ───────────────────────────────────────────────────

Write-Host ""
Write-Host "--- Creating Plugin ZIP ---" -ForegroundColor Yellow

if (Test-Path $PluginZip) { Remove-Item $PluginZip -Force }

tar -a -c -f $PluginZip -C (Split-Path $PluginSrc) (Split-Path $PluginSrc -Leaf)

# Verify ZIP contents
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($PluginZip)
$allEntries = $zip.Entries | ForEach-Object { $_.FullName }
$hasMain = $allEntries | Where-Object { $_ -match "ultra-justice-engine[/\\]ultra-justice-engine\.php" }
$zip.Dispose()

Write-Host "  ZIP top entries:" -ForegroundColor Gray
$allEntries | Select-Object -First 5 | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }

if (-not $hasMain) {
    Write-Host "  ERROR: ZIP does not contain ultra-justice-engine/ultra-justice-engine.php" -ForegroundColor Red
    exit 1
}

$sizeMB = [math]::Round((Get-Item $PluginZip).Length / 1MB, 2)
Write-Host "  Plugin ZIP: $PluginZip ($sizeMB MB)" -ForegroundColor Green


# ─── 7. Print Instructions ──────────────────────────────────────────────────

Write-Host ""
Write-Host "=== BUILD COMPLETE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Upload instructions:" -ForegroundColor Yellow
Write-Host "  PLUGIN: $PluginZip" -ForegroundColor Gray
Write-Host "     1. https://jus-tice.co.il/wp-admin/update.php?action=upload-plugin"
Write-Host "     2. Select 'Replace current with uploaded' if prompted"
Write-Host "     3. Activate"
Write-Host ""
Write-Host "After upload, verify:" -ForegroundColor Yellow
Write-Host "  GET https://jus-tice.co.il/wp-json/ultra-justice-engine/v1/health" -ForegroundColor Gray
Write-Host ""



