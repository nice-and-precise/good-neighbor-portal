#!/usr/bin/env pwsh
# tools/audit-runner.ps1
# Runs the Autonomous Audit Phase 1 probes and writes tools/audit-report.md

param(
  [switch]$Open,
  [switch]$RunServer,
  [switch]$DraftIssue
)

$ErrorActionPreference = 'Stop'

# Normalize working directory to repo root (script is in repo/tools)
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

# Ensure Spec Kit prereqs tolerate running on main by selecting first specs/* feature
$prereqScript = Join-Path $repoRoot '.specify/scripts/powershell/check-prerequisites.ps1'
$prereqRaw = & $prereqScript -Json -IncludeTasks 2>&1
$prereqExitCode = $LASTEXITCODE
$prereqSucceeded = $?
$paths = $null
try {
  $paths = $prereqRaw | ConvertFrom-Json -ErrorAction Stop
} catch {
  $paths = $null
}

$featureDir = $null
if ($paths -and $paths.FEATURE_DIR) {
  $featureDir = $paths.FEATURE_DIR
} else {
  # Fallback: pick first specs/NNN-* dir
  $specsRoot = Join-Path (Get-Location) 'specs'
  if (Test-Path $specsRoot) {
    $first = Get-ChildItem -Path $specsRoot -Directory | Where-Object { $_.Name -match '^[0-9]{3}-' } | Select-Object -First 1
    if ($first) { $featureDir = $first.FullName }
  }
}

$reportPath = Join-Path (Get-Location) 'tools/audit-report.md'

# Utility: Write-Log
function Write-Log {
  param([string]$Message)
  Write-Host "[audit] $Message"
}

# Phase 1: Data collection
$structureSample = & pwsh -NoProfile -Command "Get-ChildItem -Recurse -File -Include *.php,*.md,*.sql,*.ps1 | Select-Object -First 50 | ForEach-Object FullName" 2>$null
$configTemplate = Test-Path 'config/app.example.env'
$schemaExists  = Test-Path 'data/schema.sql'

# Script check
$prereqOutput = $prereqRaw
$prereqOk = (($prereqExitCode -eq 0) -or $prereqSucceeded)

# Compose report
$ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'
$lines = @()
$lines += "# Audit Report - $ts"
$lines += ""
$lines += "## Phase 1: Data Collection"
$lines += "- Config template: $($configTemplate ? 'PASS' : 'FAIL')"
$lines += "- Schema: $($schemaExists ? 'PASS' : 'FAIL')"
$lines += "- Feature dir: $($featureDir ?? '(none)')"
$lines += "- Prerequisites: $($prereqOk ? 'PASS' : 'FAIL')"
$lines += ""
$lines += "<details><summary>Prerequisite Output</summary>"
$lines += ""
$lines += '```'
$lines += ($prereqOutput | Out-String)
$lines += '```'
$lines += "" 
$lines += "</details>"
$lines += ""
$lines += "<details><summary>Structure sample (first 50)</summary>"
$lines += ""
$lines += '```'
$lines += ($structureSample -join [Environment]::NewLine)
$lines += '```'
$lines += "" 
$lines += "</details>"
$lines += ""
$lines += "## Next Steps"
if (-not $configTemplate) { $lines += "- Create config/app.example.env (copy to config/app.env locally)." }
if (-not $schemaExists) { $lines += "- Ensure data/schema.sql exists (and seed scripts if needed)." }
if (-not $prereqOk) { $lines += "- Run Spec Kit commands (/constitution → /specify → /plan → /tasks) to populate feature docs, or continue using the scaffold in specs/001-autonomous-audit." }
if ($prereqOk) { $lines += "- Proceed with Phase 2 milestone checks (manual or scripted)." }

# ------------------------------
# Phase 2: Static Milestone Checks (binary pass/fail by presence)
# ------------------------------

function Test-File {
  param([string]$Path)
  return (Test-Path $Path -PathType Leaf)
}
function Test-Dir {
  param([string]$Path)
  return (Test-Path $Path -PathType Container)
}
function CheckItems {
  param([hashtable]$Items)
  $results = @{}
  foreach ($k in $Items.Keys) {
    $v = $Items[$k]
    if ($v -is [string]) { $results[$k] = (Test-File $v) }
    elseif ($v -is [object[]]) {
      # all must exist
      $results[$k] = ($v | ForEach-Object { Test-File $_ } | Where-Object { -not $_ } | Measure-Object).Count -eq 0
    } else { $results[$k] = $false }
  }
  return $results
}


# M1
$m1 = CheckItems @{
  schema = "data/schema.sql"
  libs   = @(
    "src/Lib/Config.php","src/Lib/Db.php","src/Lib/Validator.php","src/Lib/Util.php","src/Lib/Http.php"
  )
  endpoints = @(
    "public/api/ping.php","public/api/csrf.php","public/api/diag.php",
    "public/api/auth_request.php","public/api/auth_verify.php",
    "public/api/session.php","public/api/tenants.php","public/api/logout.php"
  )
  scripts = @(
    ".specify/scripts/powershell/setup.ps1",
    ".specify/scripts/powershell/run.ps1",
    ".specify/scripts/powershell/reset-demo.ps1",
    ".specify/scripts/powershell/export.ps1"
  )
  gitignore = ".gitignore"
}
# Robust .gitignore check: ensure all required patterns are present at least once
if (Test-Path .gitignore) {
  $content = Get-Content -Raw .gitignore
  $patterns = @('config/app.env','/data/app.db','logs/','tmp/','exports/')
  $present = @()
  foreach ($p in $patterns) { if ($content -like ("*${p}*")) { $present += $p } }
  $m1.gitignore = ($present.Count -ge $patterns.Count)
} else {
  $m1.gitignore = $false
}

# M2 (Auth + Tenant Switcher) — align with SPA+endpoints architecture
$m2 = CheckItems @{
  endpoints = @(
    "public/api/csrf.php",
    "public/api/tenants.php",
    "public/api/auth_request.php",
    "public/api/auth_verify.php",
    "public/api/session.php",
    "public/api/logout.php"
  )
  spa = "public/index.html"
}

# M3 (Resident Dashboard + Billing)
$m3 = CheckItems @{
  dashboardEndpoint = "public/api/dashboard.php"
  billingEndpoint = "public/api/billing_get.php"
  payDemo = "public/api/pay_demo.php"
}

# M4 (Service Requests + Confirmations)
$m4 = CheckItems @{
  createEndpoint = "public/api/request_create.php"
  getEndpoint = "public/api/request_get.php"
}

# M5 (Staff Queue + Notes + Polling)
$m5 = CheckItems @{
  queueEndpoint = "public/api/staff_queue.php"
  statusUpdate = "public/api/request_status_update.php"
  notesCreate = "public/api/request_note_create.php"
  notesList = "public/api/request_notes.php"
}
# CSRF and logging static signal
# Detect CSRF header usage in Http lib or any API endpoint
$httpContent = (Get-Content -Raw "src/Lib/Http.php" 2>$null)
$httpCsrf = $false
if ($httpContent) {
  $httpCsrf = ($httpContent -match "X-CSRF" -or $httpContent -match "HTTP_X_CSRF" -or $httpContent -match "requireCsrf")
}
$apiCsrf = $false
$apiRequire = $false
$apiFiles = Get-ChildItem -Path "public/api" -Filter "*.php" -File -Recurse -ErrorAction SilentlyContinue
if ($apiFiles) {
  $apiCsrf = ((Select-String -Path ($apiFiles | ForEach-Object FullName) -SimpleMatch "X-CSRF","HTTP_X_CSRF" -ErrorAction SilentlyContinue | Measure-Object).Count -gt 0)
  $apiRequire = ((Select-String -Path ($apiFiles | ForEach-Object FullName) -SimpleMatch "requireCsrf(" -ErrorAction SilentlyContinue | Measure-Object).Count -gt 0)
}
$m5_csrf = ($httpCsrf -or $apiCsrf -or $apiRequire)
$m5_log = (Get-Content -Raw "src/Lib/Util.php" 2>$null) -match "log"

# M6 (Route Summary + CSV)
$m6 = CheckItems @{
  csvEndpoint = "public/api/route_summary.csv.php"
}

# M7 (i18n + Toggle + Tests)
$m7 = CheckItems @{
  i18nFiles = @("public/i18n/en.json","public/i18n/es.json")
  toggleEndpoint = "public/api/i18n_switch.php"
  smoke = "tests/smoke.ps1"
  unit = "tests/unit/validator_test.php"
}

function SumTrue { param($h) return (($h.GetEnumerator() | Where-Object { $_.Value }).Count) }
function CountItems { param($h) return ($h.Keys.Count) }

$lines += ""
$lines += "## Milestone Status Matrix (static checks)"
$lines += "| Milestone | Completed/Total | Notes |"
$lines += "|---|---:|---|"

function Row { param($name,$map,$extraNote)
  $done = SumTrue $map; $total = CountItems $map
  $note = $extraNote
  return "| $name | $done/$total | $note |"
}

# Compute note with missing keys for M1 to aid debugging
$m1Missing = ($m1.GetEnumerator() | Where-Object { -not $_.Value } | ForEach-Object { $_.Key })
$m1Note = if ($m1Missing.Count -gt 0) { "missing=" + ($m1Missing -join ',') } else { "" }

$lines += (Row "M1 Scaffold + DB + Scripts" $m1 $m1Note)
$lines += (Row "M2 Auth + Neighborhood Switcher" $m2 "")
$lines += (Row "M3 Resident Dashboard + Billing" $m3 "")
$lines += (Row "M4 Service Requests + Confirmations" $m4 "")
$lines += (Row "M5 Staff Queue + Notes + Polling" $m5 ("csrf=" + ($m5_csrf) + ", log=" + ($m5_log)))
$lines += (Row "M6 Route Summary + CSV Export" $m6 "")
$lines += (Row "M7 i18n + Toggle + Tests" $m7 "")

# ------------------------------
# Optional Phase 3: Runtime Probes (-RunServer)
# ------------------------------

$runtimeResults = @()
$csrfTests = @()
$runtimeOkCount = 0
$runtimeTotal = 0
$phpFound = $false
$serverStarted = $false
$serverProc = $null
$serverLogDir = Join-Path (Get-Location) 'tmp'
if (-not (Test-Path $serverLogDir)) { New-Item -ItemType Directory -Path $serverLogDir | Out-Null }

function AcceptableStatus([int]$code) { return ($code -in 200,201,202,204,301,302,401,403) }

function Invoke-Probe {
  param([string]$Url,[int]$TimeoutSec = 10)
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $resp = Invoke-WebRequest -UseBasicParsing -Uri $Url -Method GET -TimeoutSec $TimeoutSec -ErrorAction Stop
    $sw.Stop()
    return [pscustomobject]@{ url=$Url; status=$resp.StatusCode; ms=[int]$sw.Elapsed.TotalMilliseconds; ok=(AcceptableStatus($resp.StatusCode)) }
  } catch {
    $sw.Stop()
    $code = if ($_.Exception.Response -and $_.Exception.Response.StatusCode) { [int]$_.Exception.Response.StatusCode } else { 0 }
    $ok = if ($code -ne 0) { AcceptableStatus($code) } else { $false }
    return [pscustomobject]@{ url=$Url; status=$code; ms=[int]$sw.Elapsed.TotalMilliseconds; ok=$ok; error=$_.Exception.Message }
  }
}

if ($RunServer) {
  Write-Log "RunServer flag detected; attempting to start PHP built-in server."
  $php = Get-Command php -ErrorAction SilentlyContinue
  if ($php) {
    $phpFound = $true
    $phpArgs = @('-S','127.0.0.1:8080','-t','public')
    Write-Log "Starting: php $($phpArgs -join ' ')"
    $outLog = Join-Path $serverLogDir 'php-server.out.log'
    $errLog = Join-Path $serverLogDir 'php-server.err.log'
    $serverProc = Start-Process -FilePath $php.Path -ArgumentList $phpArgs -WorkingDirectory (Get-Location) -PassThru -NoNewWindow -RedirectStandardOutput $outLog -RedirectStandardError $errLog
    Start-Sleep -Seconds 1
    # Wait for readiness up to 15s
    $serverAlive = $false
    $serverAlive = (1..15 | ForEach-Object {
      try {
        Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:8080/api/ping.php' -TimeoutSec 2 -ErrorAction Stop | Out-Null
        return $true
      } catch { Start-Sleep -Milliseconds 500 }
    } | Select-Object -First 1)
    if ($serverAlive) { $serverStarted = $true }
    if ($serverStarted) {
      Write-Log "Server is ready. Probing endpoints."
      $toProbe = @(
        '/api/ping.php',
        '/api/csrf.php',
        '/api/diag.php',
        '/api/session.php',
        '/api/tenants.php'
      )
      foreach ($p in $toProbe) {
        $url = "http://127.0.0.1:8080$p"
        $res = Invoke-Probe -Url $url -TimeoutSec 8
        $runtimeResults += $res
      }

      # Runtime CSRF probe: keep a single session so PHPSESSID cookie persists
      $sess = New-Object Microsoft.PowerShell.Commands.WebRequestSession
      try {
        $csrfJson = Invoke-RestMethod -Method GET -Uri 'http://127.0.0.1:8080/api/csrf.php' -WebSession $sess -TimeoutSec 5 -ErrorAction Stop
        $csrfToken = $csrfJson.csrf
      } catch { $csrfToken = $null }

      try {
        $noCsrf = Invoke-WebRequest -UseBasicParsing -Method POST -Uri 'http://127.0.0.1:8080/api/auth_request.php' -WebSession $sess -Body '{"email":"ci@example.com","tenant":"willmar-mn"}' -ContentType 'application/json' -TimeoutSec 8 -ErrorAction Stop
        $csrfTests += [pscustomobject]@{ name='post_without_csrf'; status=$noCsrf.StatusCode; ok=$false }
      } catch {
        $code = if ($_.Exception.Response -and $_.Exception.Response.StatusCode) { [int]$_.Exception.Response.StatusCode } else { 0 }
        $csrfTests += [pscustomobject]@{ name='post_without_csrf'; status=$code; ok=($code -in 401,403) }
      }
      if ($null -ne $csrfToken) {
        try {
          $headers = @{ 'X-CSRF' = $csrfToken }
          $withCsrf = Invoke-WebRequest -UseBasicParsing -Method POST -Uri 'http://127.0.0.1:8080/api/auth_request.php' -WebSession $sess -Headers $headers -Body '{"email":"ci@example.com","tenant":"willmar-mn"}' -ContentType 'application/json' -TimeoutSec 8 -ErrorAction Stop
          $csrfTests += [pscustomobject]@{ name='post_with_csrf'; status=$withCsrf.StatusCode; ok=($withCsrf.StatusCode -in 200,201,202) }
        } catch {
          $code = if ($_.Exception.Response -and $_.Exception.Response.StatusCode) { [int]$_.Exception.Response.StatusCode } else { 0 }
          $csrfTests += [pscustomobject]@{ name='post_with_csrf'; status=$code; ok=$false }
        }
      }
    } else {
      Write-Log "Server did not become ready within timeout; skipping runtime probes."
    }
  } else {
    Write-Log "php not found on PATH; skipping runtime probes."
  }
}

if ($null -ne $serverProc) {
  try { Stop-Process -Id $serverProc.Id -Force -ErrorAction SilentlyContinue } catch {}
}

# Include CSRF tests in runtime scoring if present
$runtimeTotal = $runtimeResults.Count + ($csrfTests.Count)
$runtimeOkCount = (($runtimeResults | Where-Object { $_.ok }).Count) + (($csrfTests | Where-Object { $_.ok }).Count)

if ($RunServer) {
  $lines += ""
  $lines += "## Runtime Probes"
  if (-not $phpFound) { $lines += "> php executable not found — runtime probes skipped." }
  elseif (-not $serverStarted) { $lines += "> Server failed to start — runtime probes skipped." }
  else {
    $lines += "| Endpoint | Status | Time (ms) | OK |"
    $lines += "|---|---:|---:|:--:|"
    foreach ($r in $runtimeResults) {
      $lines += "| $($r.url) | $($r.status) | $($r.ms) | $(([string]$r.ok).ToUpper()) |"
    }
    if ($csrfTests -and $csrfTests.Count -gt 0) {
      $lines += ""
      $lines += "### CSRF Runtime"
      $lines += "| Test | Status | OK |"
      $lines += "|---|---:|:--:|"
      foreach ($t in $csrfTests) {
        $lines += "| $($t.name) | $($t.status) | $(([string]$t.ok).ToUpper()) |"
      }
    }
  }
}

# ------------------------------
# Scoring and Executive Summary
# ------------------------------

$allMaps = @($m1,$m2,$m3,$m4,$m5,$m6,$m7)
$staticDone = ($allMaps | ForEach-Object { SumTrue $_ } | Measure-Object -Sum).Sum
$staticTotal = ($allMaps | ForEach-Object { CountItems $_ } | Measure-Object -Sum).Sum
$staticPct = if ($staticTotal -gt 0) { [math]::Round(($staticDone / $staticTotal) * 100) } else { 0 }

$runtimePct = if ($runtimeTotal -gt 0) { [math]::Round(($runtimeOkCount / $runtimeTotal) * 100) } else { $null }

# Weighted overall: 70% static, 30% runtime (if runtime available)
if ($null -ne $runtimePct) {
  $overall = [math]::Round(($staticPct * 0.7) + ($runtimePct * 0.3))
} else {
  $overall = $staticPct
}

$summaryLine = if ($null -ne $runtimePct) {
  "Executive summary: static ${staticPct}%, runtime ${runtimePct}%, overall ${overall}."
} else {
  "Executive summary: static ${staticPct}%, overall ${overall}."
}

# Prepend executive summary below H1 (convert to new array to avoid fixed-size insert)
if ($lines.Count -ge 2) {
  $head = $lines[0..1]
  $tail = if ($lines.Count -gt 2) { $lines[2..($lines.Count-1)] } else { @() }
  $lines = @($head + @($summaryLine) + $tail)
} else {
  $lines += $summaryLine
}

$lines += ""
$lines += "## Scores"
$lines += "- Static completion: $staticDone/$staticTotal ($staticPct%)"
if ($null -ne $runtimePct) { $lines += "- Runtime probes: $runtimeOkCount/$runtimeTotal ($runtimePct%)" }
$lines += "- Overall score: $overall"

$lines | Set-Content -Encoding UTF8 -Path $reportPath

# ------------------------------
# Optional: Create/Update Issue (-DraftIssue)
# ------------------------------

if ($DraftIssue) {
  Write-Log "DraftIssue flag detected; preparing to create/update issue."
  $token = $env:ISSUE_TOKEN
  if (-not $token) { $token = $env:GITHUB_TOKEN }
  if (-not $token) { $token = $env:COPILOT_BOT_TOKEN }
  if (-not $token) {
    Write-Log "No token available in env (ISSUE_TOKEN/GITHUB_TOKEN/COPILOT_BOT_TOKEN). Skipping issue creation."
  } else {
    $repoFull = if ($env:GITHUB_REPOSITORY) { $env:GITHUB_REPOSITORY } else { 'jdamhofBBW/good-neighbor-portal' }
    $owner,$repo = $repoFull.Split('/')
    $api = "https://api.github.com"
    $headers = @{ Authorization = "token $token"; 'User-Agent' = 'audit-runner'; Accept = 'application/vnd.github+json' }
    $runUrl = $null
    $artifactUrl = $null
    if ($env:GITHUB_SERVER_URL -and $env:GITHUB_REPOSITORY -and $env:GITHUB_RUN_ID) {
      $runUrl = "$($env:GITHUB_SERVER_URL)/$($env:GITHUB_REPOSITORY)/actions/runs/$($env:GITHUB_RUN_ID)"
      # Try to find artifact named 'audit-report'
      try {
        $arts = Invoke-RestMethod -Headers $headers -Method GET -Uri "$api/repos/$owner/$repo/actions/runs/$($env:GITHUB_RUN_ID)/artifacts" -ErrorAction Stop
        if ($arts -and $arts.total_count -gt 0) {
          $art = ($arts.artifacts | Where-Object { $_.name -eq 'audit-report' } | Select-Object -First 1)
          if ($art) { $artifactUrl = $art.archive_download_url }
        }
      } catch { }
    }
    $title = "[Automated] Repository Audit Report"
    $reportBody = Get-Content -Raw -Path $reportPath
  $links = @()
  if ($runUrl) { $links += "Workflow run: $runUrl" }
  if ($artifactUrl) { $links += "Artifact (zip): $artifactUrl" }
  $linkBlock = if ($links.Count -gt 0) { ($links -join "`n") + "`n`n" } else { "" }
  $body = "${summaryLine}`n`nReport generated: $ts`n`n$linkBlock" + "<details><summary>Full report</summary>\n\n```markdown\n${reportBody}\n```\n\n</details>"

  # Search open issues with this title
  $searchQuery = "repo:$repoFull in:title `"$title`" is:issue is:open"
  $query = [uri]::EscapeDataString($searchQuery)
    $searchUrl = "$api/search/issues?q=$query"
    try {
      $search = Invoke-RestMethod -Headers $headers -Method GET -Uri $searchUrl -ErrorAction Stop
    } catch {
      $search = $null
    }
    $existing = $null
    if ($search -and $search.total_count -gt 0) { $existing = $search.items[0] }
    if ($existing) {
      $issueNo = $existing.number
      $patchUrl = "$api/repos/$owner/$repo/issues/$issueNo"
      Write-Log "Updating existing issue #$issueNo"
      $payload = @{ body = $body } | ConvertTo-Json -Depth 5
      Invoke-RestMethod -Headers $headers -Method PATCH -Uri $patchUrl -Body $payload -ContentType 'application/json' | Out-Null
    } else {
      $createUrl = "$api/repos/$owner/$repo/issues"
      Write-Log "Creating new issue"
      $payload = @{ title = $title; body = $body; labels = @('automation','audit') } | ConvertTo-Json -Depth 5
      Invoke-RestMethod -Headers $headers -Method POST -Uri $createUrl -Body $payload -ContentType 'application/json' | Out-Null
    }
  }
}

if ($Open) {
  Write-Host "Opening $reportPath"; Start-Process $reportPath
} else {
  Write-Host "Wrote report to $reportPath"
}
