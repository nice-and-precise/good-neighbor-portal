Param(
    [switch]$Force
)
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot | Split-Path -Parent | Split-Path -Parent
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
# Resolve SQL file paths used by the runner
$schemaPath = Join-Path $dataDir 'schema.sql'
$seedPath = Join-Path $dataDir 'seed.sql'

if (Test-Path $dbPath) {
    if ($Force) {
        Remove-Item $dbPath -Force
    } else {
        Write-Host "Database already exists at data/app.db. Use -Force to recreate." -ForegroundColor Yellow
    }
}

# Use PHP to execute schema and seed against SQLite
function Resolve-Php {
    if (Get-Command 'php' -ErrorAction SilentlyContinue) { return (Get-Command 'php').Source }
    $wingetDir = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
    $candidate = Get-ChildItem -Path $wingetDir -Recurse -Filter php.exe -ErrorAction SilentlyContinue |
        Select-Object -First 1 -ExpandProperty FullName
    if ($candidate) { return $candidate }
    throw "PHP is not installed or not in PATH. Please install PHP 8.1+ and retry."
}
$php = Resolve-Php
$phpDir = Split-Path -Parent $php
# Only compute ext dir for Windows; on Linux (CI) overriding extension_dir breaks extension loading
$extDir = if ($IsWindows) { Join-Path $phpDir 'ext' } else { $null }

# Build a tiny PHP runner to apply schema/seed
$runner = @'
<?php
$dsn = 'sqlite:./data/app.db';
$db = new PDO($dsn);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$schema = getenv('SCHEMA_PATH') ?: './data/schema.sql';
$db->exec(file_get_contents($schema));
if (getenv('SEED_DEMO') === 'true') {
    $seed = getenv('SEED_PATH') ?: './data/seed.sql';
    $db->exec(file_get_contents($seed));
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
$env:SCHEMA_PATH = $schemaPath
$env:SEED_PATH = $seedPath

# Build PHP argument list safely across platforms
$phpArgs = @()
if ($IsWindows) {
    if ($extDir) { $phpArgs += '-d'; $phpArgs += "extension_dir=$extDir" }
    $phpArgs += '-d'; $phpArgs += 'extension=pdo_sqlite'
    $phpArgs += '-d'; $phpArgs += 'extension=sqlite3'
} else {
    # On GitHub Actions (Linux), shivammathur/setup-php installs and enables required extensions.
    # Do not override extension_dir; optionally ensure sqlite extensions are enabled if available.
    $phpArgs += '-d'; $phpArgs += 'extension=pdo_sqlite'
    $phpArgs += '-d'; $phpArgs += 'extension=sqlite3'
}
& $php @phpArgs $runnerPath
if ($LASTEXITCODE -ne 0) {
    throw "Database migration failed (PHP exit code $LASTEXITCODE). Ensure PDO and pdo_sqlite are installed and enabled."
}

Write-Host "Database migrated and seeded: $dbPath" -ForegroundColor Green
Write-Host "Setup complete." -ForegroundColor Green
