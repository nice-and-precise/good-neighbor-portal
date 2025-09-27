#!/usr/bin/env pwsh
# tools/audit-runner.ps1
# Runs the Autonomous Audit Phase 1 probes and writes tools/audit-report.md

param(
  [switch]$Open
)

$ErrorActionPreference = 'Stop'

# Ensure Spec Kit prereqs tolerate running on main by selecting first specs/* feature
$prereqRaw = & .\.specify\scripts\powershell\check-prerequisites.ps1 -Json -IncludeTasks 2>&1
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

# Phase 1: Data collection
$structureSample = & pwsh -NoProfile -Command "Get-ChildItem -Recurse -File -Include *.php,*.md,*.sql,*.ps1 | Select-Object -First 50 | ForEach-Object FullName" 2>$null
$configTemplate = Test-Path 'config/app.example.env'
$schemaExists  = Test-Path 'data/schema.sql'

# Script check
$prereqOutput = $prereqRaw
$prereqOk = $LASTEXITCODE -eq 0

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
$m1.gitignore = (Get-Content -Raw .gitignore | Select-String -SimpleMatch "config/app.env","/data/app.db","logs/","tmp/","exports/" | Measure-Object).Count -ge 5

# M2
$m2 = CheckItems @{
  models = @("src/Model/UserModel.php","src/Model/MagicLinkModel.php","src/Model/NeighborhoodModel.php")
  controller = "src/Controller/AuthController.php"
  view = "public/auth_login.php"
  tenantsEndpoint = "public/api/tenants.php"
  sessionEndpoint = "public/api/session.php"
}

# M3
$m3 = CheckItems @{
  models = @("src/Model/ScheduleModel.php","src/Model/BillingModel.php")
  controller = "src/Controller/ResidentController.php"
  dashboardView = "public/resident_dashboard.php"
  billingView = "public/resident_billing.php"
  billingEndpoint = "public/api/billing_get.php"
}

# M4
$m4 = CheckItems @{
  requestModel = "src/Model/RequestModel.php"
  newView = "public/resident_request_new.php"
  createEndpoint = "public/api/request_create.php"
  statusTracking = "public/api/request_get.php"
}

# M5
$m5 = CheckItems @{
  staffController = "src/Controller/StaffController.php"
  queueView = "public/staff_queue.php"
  queueEndpoint = "public/api/staff_queue.php"
  statusUpdate = "public/api/request_status_update.php"
  notesCreate = "public/api/request_note_create.php"
}
# CSRF and logging static signal
$m5_csrf = (Get-Content -Raw "src/Lib/Http.php" 2>$null) -match "X-CSRF"
$m5_log = (Get-Content -Raw "src/Lib/Util.php" 2>$null) -match "log"  # heuristic

# M6
$m6 = CheckItems @{
  routeModel = "src/Model/RouteModel.php"
  exportController = "src/Controller/ExportController.php"
  csvUtil = "src/Lib/Csv.php"
  csvEndpoint = "public/api/route_summary.csv.php"
}

# M7
$m7 = CheckItems @{
  i18nFiles = @("public/i18n/en.json","public/i18n/es.json")
  i18nLib = "src/Lib/I18n.php"
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

$lines += (Row "M1 Scaffold + DB + Scripts" $m1 "")
$lines += (Row "M2 Auth + Neighborhood Switcher" $m2 "")
$lines += (Row "M3 Resident Dashboard + Billing" $m3 "")
$lines += (Row "M4 Service Requests + Confirmations" $m4 "")
$lines += (Row "M5 Staff Queue + Notes + Polling" $m5 ("csrf=" + ($m5_csrf) + ", log=" + ($m5_log)))
$lines += (Row "M6 Route Summary + CSV Export" $m6 "")
$lines += (Row "M7 i18n + Toggle + Tests" $m7 "")

$lines | Set-Content -Encoding UTF8 -Path $reportPath

if ($Open) {
  Write-Host "Opening $reportPath"; Start-Process $reportPath
} else {
  Write-Host "Wrote report to $reportPath"
}
