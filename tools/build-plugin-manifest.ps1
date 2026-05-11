param(
    [Parameter(Mandatory = $true)]
    [string]$PluginPath,

    [Parameter(Mandatory = $true)]
    [string]$OutputPath
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path -LiteralPath $PluginPath
$workspace = (Get-Location).Path

$rows = Get-ChildItem -LiteralPath $root -Recurse -File | Sort-Object FullName | ForEach-Object {
    $relative = $_.FullName.Replace($workspace + "\", "")
    $hash = Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256

    [pscustomobject]@{
        path = $relative.Replace("\", "/")
        bytes = $_.Length
        sha256 = $hash.Hash
        last_modified_local = $_.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
    }
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}

$rows | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8

Write-Host "Manifest written: $OutputPath"
Write-Host "Files: $(@($rows).Count)"
