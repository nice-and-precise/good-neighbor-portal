Param(
  [string]$Base = 'http://127.0.0.1:8080'
)
$ErrorActionPreference = 'Stop'
Write-Host "==> Negative test: staff status update without key" -ForegroundColor Cyan
$csrfResp = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/csrf.php" -SessionVariable sess
$csrf = ($csrfResp.Content | ConvertFrom-Json).csrf
if (-not $csrf) { throw 'Failed CSRF' }
$headers = @{ 'X-CSRF' = $csrf }
$body = @{ id = 9999; action = 'ack' } | ConvertTo-Json
$resp = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/request_status_update.php" -Method Post -Body $body -ContentType 'application/json' -Headers $headers -WebSession $sess -SkipHttpErrorCheck
if ($resp.StatusCode -lt 400) { throw "Expected failure, got $($resp.StatusCode)" }
Write-Host "Negative test OK: status=$($resp.StatusCode)" -ForegroundColor Green

Write-Host "==> Negative test: staff note create without key" -ForegroundColor Cyan
$noteBody = @{ request_id = 9999; note = 'test' } | ConvertTo-Json
$resp2 = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/request_note_create.php" -Method Post -Body $noteBody -ContentType 'application/json' -Headers $headers -WebSession $sess -SkipHttpErrorCheck
if ($resp2.StatusCode -lt 400) { throw "Expected failure, got $($resp2.StatusCode)" }
Write-Host "Negative test OK (note): status=$($resp2.StatusCode)" -ForegroundColor Green
