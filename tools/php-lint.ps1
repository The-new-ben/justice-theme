param(
    [string]$Path = "."
)

$ErrorActionPreference = "Stop"

function Resolve-PhpExecutable {
    $command = Get-Command php -ErrorAction SilentlyContinue
    if ($command) {
        return $command.Source
    }

    $wingetPhp = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe"
    if (Test-Path -LiteralPath $wingetPhp) {
        return $wingetPhp
    }

    $wingetRoot = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages"
    if (Test-Path -LiteralPath $wingetRoot) {
        $candidate = Get-ChildItem -LiteralPath $wingetRoot -Recurse -Filter php.exe -ErrorAction SilentlyContinue |
            Sort-Object FullName |
            Select-Object -First 1

        if ($candidate) {
            return $candidate.FullName
        }
    }

    throw "PHP CLI was not found. Install PHP locally or open a new terminal after installation so PATH refreshes."
}

$root = Resolve-Path -LiteralPath $Path
$php = Resolve-PhpExecutable
$files = Get-ChildItem -LiteralPath $root -Recurse -Filter *.php |
    Where-Object {
        $_.FullName -notmatch '\\.git\\' -and
        $_.FullName -notmatch '\\node_modules\\' -and
        $_.FullName -notmatch '\\vendor\\'
    } |
    Sort-Object FullName

if (-not $files) {
    Write-Host "No PHP files found."
    exit 0
}

$errors = @()

foreach ($file in $files) {
    $result = & $php -l $file.FullName 2>&1
    if ($LASTEXITCODE -ne 0) {
        $errors += "`n--- $($file.FullName) ---`n$result"
    }
}

if ($errors.Count -gt 0) {
    Write-Host ($errors -join "`n")
    exit 1
}

Write-Host "PHP lint passed for $($files.Count) PHP files."
