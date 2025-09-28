Param(
  [int]$Port = 8080
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info($m){ Write-Host "[first-run] $m" -ForegroundColor Cyan }
function Write-Ok($m){ Write-Host "[first-run] $m" -ForegroundColor Green }
function Write-Err($m){ Write-Host "[first-run] $m" -ForegroundColor Red }

$root = Split-Path -Parent $PSScriptRoot
$public = Join-Path $root 'public'
$smoke = Join-Path $root 'tests/smoke.ps1'
$setup = Join-Path $PSScriptRoot 'setup-php-sqlite.ps1'

# 1) Enable SQLite
& $setup

# 2) Start server
$php = (Get-Command php).Path
Write-Info "Starting PHP dev server: $php -S 127.0.0.1:$Port -t $public"
$proc = Start-Process -FilePath $php -ArgumentList '-S',"127.0.0.1:$Port",'-t',"$public" -PassThru

# 3) Wait for server
$base = "http://127.0.0.1:$Port"
$ok = $false
for ($i=0; $i -lt 20; $i++) {
  Start-Sleep -Milliseconds 500
  try {
    $r = Invoke-WebRequest -Uri "$base/api/diag.php" -UseBasicParsing -TimeoutSec 2
    if ($r.StatusCode -eq 200) { $ok = $true; break }
  } catch { }
}
if (-not $ok) {
  try { Stop-Process -Id $proc.Id -ErrorAction SilentlyContinue } catch {}
  Write-Err "Server did not start on $base"
  exit 1
}
Write-Ok "Server is up at $base"

# 4) Run smoke test
& $smoke -BaseUrl $base

# 5) Stop server
try { Stop-Process -Id $proc.Id -ErrorAction SilentlyContinue } catch {}
Write-Ok "First run complete. Use 'App: Run server (8080)' task to keep it running."