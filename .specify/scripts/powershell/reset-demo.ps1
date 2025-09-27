Param(
    [int]$Port = 8080,
    [switch]$Force
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent | Split-Path -Parent
Set-Location $root

function Test-PortInUse([int]$P) {
    $inUse = Get-NetTCPConnection -State Listen -LocalPort $P -ErrorAction SilentlyContinue
    return $null -ne $inUse
}

if (-not $Force) {
    if (Test-PortInUse -P $Port) {
        Write-Host "Refusing to reset demo while server appears to be running on port $Port." -ForegroundColor Red
        Write-Host "Stop the server and rerun with -Force if you are sure." -ForegroundColor Yellow
        exit 1
    }
}

# Delete DB, logs, tmp
Remove-Item -Force -ErrorAction SilentlyContinue .\data\app.db
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .\logs
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .\tmp

# Recreate logs dir
New-Item -ItemType Directory -Force -Path .\logs | Out-Null

# Re-run setup to migrate/seed
& .\.specify\scripts\powershell\setup.ps1 -Force
