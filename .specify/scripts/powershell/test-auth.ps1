Param(
    [string]$Email = 'resident@example.com',
    [string]$Base = 'http://127.0.0.1:8080',
    [string]$Tenant = 'willmar-mn'
)
$ErrorActionPreference = 'Stop'

Write-Host "==> Testing auth flow against $Base (tenant=$Tenant)" -ForegroundColor Cyan
$session = $null
$csrfResp = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/csrf.php" -SessionVariable session
$csrf = ($csrfResp.Content | ConvertFrom-Json).csrf
if (-not $csrf) { throw 'Failed to get CSRF' }
Write-Host "CSRF: $csrf" -ForegroundColor DarkGray

$headers = @{ 'X-CSRF' = $csrf }
$bodyReq = @{ email = $Email; tenant = $Tenant } | ConvertTo-Json
$reqResp = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/auth_request.php" -Method Post -Body $bodyReq -ContentType 'application/json' -Headers $headers -WebSession $session
$req = $reqResp.Content | ConvertFrom-Json
if (-not $req.ok) { throw "auth_request failed: $($req.error)" }
Write-Host "Token: $($req.token)" -ForegroundColor DarkGray

$bodyVerify = @{ token = $req.token; tenant = $Tenant } | ConvertTo-Json
$verResp = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/auth_verify.php" -Method Post -Body $bodyVerify -ContentType 'application/json' -Headers $headers -WebSession $session
$ver = $verResp.Content | ConvertFrom-Json
if (-not $ver.ok) { throw "auth_verify failed: $($ver.error)" }

$sessResp = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/session.php" -WebSession $session
$sess = $sessResp.Content | ConvertFrom-Json
Write-Host "Session: user_id=$($sess.auth.user_id) tenant_id=$($sess.auth.tenant_id)" -ForegroundColor Green
 
# Dashboard
$dashResp = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/dashboard.php" -WebSession $session
$dash = $dashResp.Content | ConvertFrom-Json
if (-not $dash.ok) { throw 'dashboard failed' }
Write-Host "Dashboard OK: next_pickup_date=$($dash.next_pickup_date) bills=$($dash.billing.Count)" -ForegroundColor Green

# Create a service request
$headers = @{ 'X-CSRF' = $csrf }
$bodyReq = @{ category = 'issue_report'; description = 'Broken lid' } | ConvertTo-Json
$reqCreate = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/request_create.php" -Method Post -Body $bodyReq -ContentType 'application/json' -Headers $headers -WebSession $session
$rc = $reqCreate.Content | ConvertFrom-Json
if (-not $rc.ok) { throw 'request_create failed' }

$dash2 = (Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/dashboard.php" -WebSession $session).Content | ConvertFrom-Json
if (-not $dash2.ok -or -not $dash2.last_request) { throw 'dashboard last_request missing' }
Write-Host "Request OK: id=$($rc.id) last_request=$($dash2.last_request.category) ($($dash2.last_request.status))" -ForegroundColor Green

# Request detail
$reqDetail = (Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/request_get.php?id=$($rc.id)" -WebSession $session).Content | ConvertFrom-Json
if (-not $reqDetail.ok) { throw 'request_get failed' }
if (-not $reqDetail.request -or $reqDetail.request.id -ne $rc.id) { throw 'request_get returned wrong id' }
Write-Host "Request detail OK: address='$($reqDetail.request.address)' status=$($reqDetail.request.status)" -ForegroundColor Green

# Recent activity
$act = (Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/recent_activity.php" -WebSession $session).Content | ConvertFrom-Json
if (-not $act.ok -or $act.items.Count -lt 1) { throw 'recent_activity failed' }
Write-Host "Activity OK: items=$($act.items.Count)" -ForegroundColor Green
# Staff lifecycle (demo)
$staffKey = 'demo-staff'
$headersStaff = @{ 'X-CSRF' = $csrf; 'X-Staff-Key' = $staffKey }

# Transition status to ack
$bodyAck = @{ id = $rc.id; action = 'ack' } | ConvertTo-Json
$ackResp = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/request_status_update.php" -Method Post -Body $bodyAck -ContentType 'application/json' -Headers $headersStaff -WebSession $session
$ack = $ackResp.Content | ConvertFrom-Json
if (-not $ack.ok -or $ack.status -ne 'ack') { throw 'request_status_update ack failed' }
Write-Host "Status update OK: $($ack.status)" -ForegroundColor Green

# Add a staff note
$noteText = "Arriving soon for request #$($rc.id)"
$bodyNote = @{ request_id = $rc.id; note = $noteText } | ConvertTo-Json
$noteResp = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/request_note_create.php" -Method Post -Body $bodyNote -ContentType 'application/json' -Headers $headersStaff -WebSession $session
$note = $noteResp.Content | ConvertFrom-Json
if (-not $note.ok) { throw 'request_note_create failed' }
Write-Host "Note create OK: id=$($note.id)" -ForegroundColor Green

# Verify notes list contains our note
$notesList = (Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/request_notes.php?request_id=$($rc.id)" -Headers @{ } -WebSession $session).Content | ConvertFrom-Json
if (-not $notesList.ok -or -not ($notesList.notes | Where-Object { $_.note -eq $noteText })) { throw 'request_notes missing expected note' }
Write-Host "Notes list OK: count=$($notesList.notes.Count)" -ForegroundColor Green
Write-Host "Auth flow OK" -ForegroundColor Green
