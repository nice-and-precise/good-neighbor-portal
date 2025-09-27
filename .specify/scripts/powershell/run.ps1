Param(
    [int]$Port = 8080
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot | Split-Path -Parent | Split-Path -Parent
Set-Location $root

function Resolve-Php {
    if (Get-Command 'php' -ErrorAction SilentlyContinue) { return (Get-Command 'php').Source }
    $wingetDir = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
    $candidate = Get-ChildItem -Path $wingetDir -Recurse -Filter php.exe -ErrorAction SilentlyContinue |
        Select-Object -First 1 -ExpandProperty FullName
    if ($candidate) { return $candidate }
    throw "PHP is not installed or not in PATH. Please install PHP 8.1+ and retry."
}
$php = Resolve-Php

function Resolve-ExtDir {
    param([string]$phpPath)
    $phpDir = Split-Path -Parent $phpPath
    $candidates = @()
    $candidates += (Join-Path $phpDir 'ext')
    $wingetDir = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
    try {
        $pdoSqliteDll = Get-ChildItem -Path $wingetDir -Recurse -Filter 'php_pdo_sqlite.dll' -ErrorAction SilentlyContinue |
            Select-Object -First 1 -ExpandProperty FullName
        if ($pdoSqliteDll) { $candidates += (Split-Path -Parent $pdoSqliteDll) }
    } catch {}
    foreach ($dir in $candidates | Where-Object { $_ -and (Test-Path $_) } ) {
        $hasPdoSqlite = Test-Path (Join-Path $dir 'php_pdo_sqlite.dll')
        $hasSqlite3 = Test-Path (Join-Path $dir 'php_sqlite3.dll')
        if ($hasPdoSqlite -and $hasSqlite3) { return $dir }
    }
    return $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
}

$extDir = Resolve-ExtDir -phpPath $php

$bindHost = '127.0.0.1'
$binding = @($bindHost, $Port) -join ':'
$msg = [System.String]::Concat('==> Starting PHP dev server at http://', $binding)
Write-Host $msg -ForegroundColor Cyan
Write-Host "PHP: $php" -ForegroundColor DarkGray
Write-Host "Ext: $extDir" -ForegroundColor DarkGray
& $php -d "extension_dir=$extDir" -d extension=pdo_sqlite -d extension=sqlite3 -S $binding -t public
