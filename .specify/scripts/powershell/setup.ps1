Param(
    [switch]$Force
)
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent | Split-Path -Parent
Set-Location $root

Write-Host "==> Setting up Good Neighbor Portal (M1)" -ForegroundColor Cyan

# Ensure config
$configDir = Join-Path $root 'config'
$appEnv = Join-Path $configDir 'app.env'
$appEnvExample = Join-Path $configDir 'app.example.env'
if (-not (Test-Path $appEnv)) {
    Copy-Item $appEnvExample $appEnv -Force
    Write-Host "Created config/app.env from example" -ForegroundColor Yellow
}

# Create SQLite DB
$dataDir = Join-Path $root 'data'
$dbPath = Join-Path $dataDir 'app.db'
## Paths (schema/seed constants are used by the PHP runner)

if (Test-Path $dbPath) {
    if ($Force) {
        Remove-Item $dbPath -Force
    } else {
        Write-Host "Database already exists at data/app.db. Use -Force to recreate." -ForegroundColor Yellow
    }
}

# Use PHP to execute schema and seed against SQLite
$php = 'php'
if (-not (Get-Command $php -ErrorAction SilentlyContinue)) {
    throw "PHP is not installed or not in PATH. Please install PHP 8.1+ and retry."
}

# Build a tiny PHP runner to apply schema/seed
$runner = @'
<?php
$dsn = 'sqlite:./data/app.db';
$db = new PDO($dsn);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec(file_get_contents('./data/schema.sql'));
if (getenv('SEED_DEMO') === 'true') {
    $db->exec(file_get_contents('./data/seed.sql'));
}
?>
'@

$runnerPath = Join-Path $root 'tmp\migrate.php'
New-Item -ItemType Directory -Force -Path (Split-Path $runnerPath -Parent) | Out-Null
Set-Content -Path $runnerPath -Value $runner -Encoding UTF8

# Read SEED_DEMO from env file
$envLines = Get-Content $appEnv | Where-Object { $_ -and (-not $_.StartsWith('#')) }
$seedFlag = 'true'
foreach ($line in $envLines) {
    if ($line -match '^SEED_DEMO=(.*)$') { $seedFlag = $Matches[1]; break }
}

$env:SEED_DEMO = $seedFlag
& $php $runnerPath

Write-Host "Database migrated and seeded: $dbPath" -ForegroundColor Green
Write-Host "Setup complete." -ForegroundColor Green
