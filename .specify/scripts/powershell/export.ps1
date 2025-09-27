Param(
    [string]$Out = './exports/route-summary.csv'
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent | Split-Path -Parent
Set-Location $root

# Minimal placeholder export; real logic will come in a later milestone.
New-Item -ItemType Directory -Force -Path (Split-Path $Out -Parent) | Out-Null
"id,street,neighborhood,status" | Set-Content -Path $Out -Encoding UTF8
"1,101 1st St W,Downtown,new" | Add-Content -Path $Out -Encoding UTF8
Write-Host "Export written to $Out (placeholder)." -ForegroundColor Green
