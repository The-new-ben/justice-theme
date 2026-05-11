param(
    [string[]]$PluginFolders = @("ultra-justice-engine", "justice-core", "ultra-justice"),
    [switch]$FailOnCollision
)

$ErrorActionPreference = "Stop"

function Get-RegexMatches {
    param(
        [string]$Root,
        [string]$Pattern
    )

    if (-not (Test-Path -LiteralPath $Root)) {
        return @()
    }

    $phpFiles = Get-ChildItem -LiteralPath $Root -Recurse -File -Filter "*.php"
    $results = $phpFiles | Select-String -Pattern $Pattern -AllMatches
    $matches = @()

    foreach ($result in $results) {
        foreach ($match in $result.Matches) {
            if ($match.Groups.Count -gt 1) {
                $matches += [pscustomobject]@{
                    Value = $match.Groups[1].Value
                    Path = $result.Path
                    Line = $result.LineNumber
                }
            }
        }
    }

    return $matches
}

function Get-PluginHeader {
    param(
        [string]$MainFile
    )

    $header = @{
        Name = ""
        Version = ""
        TextDomain = ""
    }

    if (-not (Test-Path -LiteralPath $MainFile)) {
        return [pscustomobject]$header
    }

    $lines = Get-Content -LiteralPath $MainFile -TotalCount 40
    foreach ($line in $lines) {
        if ($line -match "Plugin Name:\s*(.+)$") {
            $header.Name = $Matches[1].Trim()
        }
        if ($line -match "Version:\s*(.+)$") {
            $header.Version = $Matches[1].Trim()
        }
        if ($line -match "Text Domain:\s*(.+)$") {
            $header.TextDomain = $Matches[1].Trim()
        }
    }

    return [pscustomobject]$header
}

$reports = @()

foreach ($folder in $PluginFolders) {
    $root = Join-Path (Get-Location) $folder
    $mainFile = Join-Path $root "$folder.php"
    $header = Get-PluginHeader -MainFile $mainFile

    $reports += [pscustomobject]@{
        Folder = $folder
        ExpectedMainFile = "$folder/$folder.php"
        PluginName = $header.Name
        Version = $header.Version
        TextDomain = $header.TextDomain
        Constants = @(Get-RegexMatches -Root $root -Pattern "define\(\s*['""]([^'""]+)").Value | Sort-Object -Unique
        Functions = @(Get-RegexMatches -Root $root -Pattern "function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(").Value | Sort-Object -Unique
        RestNamespaces = @(Get-RegexMatches -Root $root -Pattern "register_rest_route\(\s*['""]([^'""]+)").Value | Sort-Object -Unique
        PostTypes = @(Get-RegexMatches -Root $root -Pattern "register_post_type\(\s*['""]([^'""]+)").Value | Sort-Object -Unique
        Taxonomies = @(Get-RegexMatches -Root $root -Pattern "register_taxonomy\(\s*['""]([^'""]+)").Value | Sort-Object -Unique
    }
}

Write-Host "JUSTICE PLUGIN COLLISION CHECK"
Write-Host ""

foreach ($report in $reports) {
    Write-Host "Plugin folder: $($report.Folder)"
    Write-Host "  Expected main file: $($report.ExpectedMainFile)"
    Write-Host "  Header: $($report.PluginName) $($report.Version) [$($report.TextDomain)]"
    Write-Host "  Constants: $($report.Constants -join ', ')"
    Write-Host "  Function prefix sample: $((@($report.Functions) | Select-Object -First 8) -join ', ')"
    Write-Host "  REST namespaces: $($report.RestNamespaces -join ', ')"
    Write-Host "  CPTs: $($report.PostTypes -join ', ')"
    Write-Host "  Taxonomies: $($report.Taxonomies -join ', ')"
    Write-Host ""
}

Write-Host "Collision summary:"
$allFunctions = @{}
$allConstants = @{}

foreach ($report in $reports) {
    foreach ($fn in $report.Functions) {
        if (-not $allFunctions.ContainsKey($fn)) {
            $allFunctions[$fn] = @()
        }
        $allFunctions[$fn] += $report.Folder
    }

    foreach ($constant in $report.Constants) {
        if (-not $allConstants.ContainsKey($constant)) {
            $allConstants[$constant] = @()
        }
        $allConstants[$constant] += $report.Folder
    }
}

$duplicateFunctions = $allFunctions.GetEnumerator() | Where-Object { @($_.Value | Sort-Object -Unique).Count -gt 1 } | Sort-Object Name
$duplicateConstants = $allConstants.GetEnumerator() | Where-Object { @($_.Value | Sort-Object -Unique).Count -gt 1 } | Sort-Object Name

Write-Host "  Duplicate constants:"
if ($duplicateConstants.Count -eq 0) {
    Write-Host "    none"
} else {
    foreach ($item in $duplicateConstants) {
        Write-Host "    $($item.Name): $((@($item.Value) | Sort-Object -Unique) -join ', ')"
    }
}

Write-Host "  Duplicate functions:"
if ($duplicateFunctions.Count -eq 0) {
    Write-Host "    none"
} else {
    foreach ($item in $duplicateFunctions) {
        Write-Host "    $($item.Name): $((@($item.Value) | Sort-Object -Unique) -join ', ')"
    }
}

Write-Host ""

if ($duplicateConstants.Count -gt 0 -or $duplicateFunctions.Count -gt 0) {
    Write-Host "RESULT: REVIEW - duplicate plugin symbols exist. Do not activate duplicate Justice plugins together."
    if ($FailOnCollision) {
        exit 1
    }
    exit 0
}

Write-Host "RESULT: VERIFIED - no duplicate plugin symbols found."
exit 0
