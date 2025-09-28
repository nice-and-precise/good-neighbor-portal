Param(
  [switch]$StartServer,
  [int]$Port = 8080
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[setup] $msg" -ForegroundColor Cyan }
function Write-Ok($msg) { Write-Host "[setup] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[setup] $msg" -ForegroundColor Yellow }
function Write-Err($msg) { Write-Host "[setup] $msg" -ForegroundColor Red }

# Locate php.exe
$phpCmd = Get-Command php -ErrorAction SilentlyContinue
if (-not $phpCmd) { Write-Err "php.exe not found on PATH. Install PHP 8.1+ or add it to PATH."; exit 1 }
$phpPath = $phpCmd.Path
$phpDir = Split-Path -Parent $phpPath
$extDir = Join-Path $phpDir 'ext'

Write-Info "PHP: $phpPath"
Write-Info "PHP dir: $phpDir"

# Determine loaded ini (may be none)
$iniLoaded = & $phpPath -r "echo php_ini_loaded_file() ?: '';"
$iniTarget = $iniLoaded
if ([string]::IsNullOrWhiteSpace($iniTarget)) {
  $iniTarget = Join-Path $phpDir 'php.ini'
  Write-Warn "No php.ini loaded; will create: $iniTarget"
  if (-not (Test-Path $iniTarget)) {
    $iniDev = Join-Path $phpDir 'php.ini-development'
    $iniProd = Join-Path $phpDir 'php.ini-production'
    if (Test-Path $iniDev) { Copy-Item $iniDev $iniTarget -Force }
    elseif (Test-Path $iniProd) { Copy-Item $iniProd $iniTarget -Force }
    else { Write-Err "Could not find php.ini-development or php.ini-production in $phpDir"; exit 1 }
  }
}

Write-Info "Using php.ini: $iniTarget"
if (-not (Test-Path $iniTarget)) { Write-Err "php.ini file does not exist: $iniTarget"; exit 1 }

# Backup php.ini
$backup = "$iniTarget.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $iniTarget $backup
Write-Info "Backup created: $backup"

# Read and modify
$content = Get-Content -Raw -Path $iniTarget
$lines = $content -split "`r?`n"

# Ensure extension_dir
$extConfigured = $false
for ($i=0; $i -lt $lines.Length; $i++) {
  $line = $lines[$i]
  if ($line -match '^\s*;?\s*extension_dir\s*=') {
    $lines[$i] = ('extension_dir = "{0}"' -f $extDir)
    $extConfigured = $true
  }
}
if (-not $extConfigured) { $lines += ('extension_dir = "{0}"' -f $extDir) }

# Enable extensions
function Enable-Extension([string]$name) {
  $found = $false
  for ($i=0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "^\s*;?\s*extension\s*=\s*$name\s*$") { $lines[$i] = "extension=$name"; $found = $true }
  }
  if (-not $found) { $lines += "extension=$name" }
}
Enable-Extension 'pdo_sqlite'
Enable-Extension 'sqlite3'

# Write back
$newContent = ($lines -join "`r`n")
Set-Content -Path $iniTarget -Value $newContent -Encoding UTF8
Write-Ok "php.ini updated"

# Validate
$hasPdo = (& $phpPath -r "echo extension_loaded('pdo') ? '1' : '0';") -eq '1'
$hasSqlite3 = (& $phpPath -r "echo extension_loaded('sqlite3') ? '1' : '0';") -eq '1'
$hasPdoSqlite = (& $phpPath -r "echo extension_loaded('pdo_sqlite') ? '1' : '0';") -eq '1'
Write-Info "Extensions: pdo=$hasPdo sqlite3=$hasSqlite3 pdo_sqlite=$hasPdoSqlite"
if (-not ($hasSqlite3 -and $hasPdoSqlite)) { Write-Err "Failed to enable sqlite extensions. Check $iniTarget and restart your shell."; exit 1 }

# Optionally start server and open diag
if ($StartServer) {
  Write-Info "Starting PHP server on 127.0.0.1:$Port ..."
  $pub = Join-Path (Split-Path -Parent $PSScriptRoot) 'public'
  $proc = Start-Process -FilePath $phpPath -ArgumentList '-S',"127.0.0.1:$Port",'-t',"$pub" -PassThru
  Start-Sleep -Seconds 1
  try {
    $resp = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/api/diag.php" -UseBasicParsing -TimeoutSec 5
    Write-Ok "diag.php: $($resp.StatusCode)"
    Write-Host $resp.Content
  } catch {
    Write-Warn "Could not fetch diag.php: $($_.Exception.Message)"
  }
  Write-Info "Stop server with: Stop-Process -Id $($proc.Id)"
}

Write-Ok "SQLite enabled for PHP. Restart any running PHP servers and reload your app."