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

$lines | Set-Content -Encoding UTF8 -Path $reportPath

if ($Open) {
  Write-Host "Opening $reportPath"; Start-Process $reportPath
} else {
  Write-Host "Wrote report to $reportPath"
}
