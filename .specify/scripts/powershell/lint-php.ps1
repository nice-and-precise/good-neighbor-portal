Param(
  [string]$Root = "$(Split-Path -Parent (Split-Path -Parent $PSScriptRoot))"
)
$ErrorActionPreference = 'Stop'
Write-Host "==> PHP lint under $Root" -ForegroundColor Cyan
$files = Get-ChildItem -Recurse -File -Path $Root -Filter *.php
$fail = @()
foreach ($f in $files) {
  $res = & php -l -- $f.FullName 2>&1
  if ($LASTEXITCODE -ne 0) {
    Write-Host ("FAIL  {0}" -f $f.FullName) -ForegroundColor Red
    $fail += $res
  } else {
    Write-Host ("OK    {0}" -f $f.FullName) -ForegroundColor DarkGray
  }
}
if ($fail.Count -gt 0) {
  Write-Host "PHP lint failures:" -ForegroundColor Red
  $fail | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  exit 1
}
Write-Host "PHP lint: all files OK" -ForegroundColor Green
