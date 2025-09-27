Param(
    [int]$Port = 8080
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent | Split-Path -Parent
Set-Location $root

$php = 'php'
if (-not (Get-Command $php -ErrorAction SilentlyContinue)) {
    throw "PHP is not installed or not in PATH. Please install PHP 8.1+ and retry."
}

$bindHost = '127.0.0.1'
$msg = "==> Starting PHP dev server at http://{0}:{1}" -f $bindHost, $Port
Write-Host $msg -ForegroundColor Cyan
& $php -S "$bindHost`:$Port" -t public
