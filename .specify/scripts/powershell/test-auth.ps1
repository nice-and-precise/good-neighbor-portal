Param(
    [string]$Email = 'resident@example.com',
    [string]$Base = 'http://127.0.0.1:8080'
)
$ErrorActionPreference = 'Stop'

Write-Host "==> Testing auth flow against $Base" -ForegroundColor Cyan
$session = $null
$csrfResp = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/csrf.php" -SessionVariable session
$csrf = ($csrfResp.Content | ConvertFrom-Json).csrf
if (-not $csrf) { throw 'Failed to get CSRF' }
Write-Host "CSRF: $csrf" -ForegroundColor DarkGray

$headers = @{ 'X-CSRF' = $csrf }
$bodyReq = @{ email = $Email; tenant = 'willmar-mn' } | ConvertTo-Json
$reqResp = Invoke-WebRequest -UseBasicParsing -Uri "$Base/api/auth_request.php" -Method Post -Body $bodyReq -ContentType 'application/json' -Headers $headers -WebSession $session
$req = $reqResp.Content | ConvertFrom-Json
if (-not $req.ok) { throw "auth_request failed: $($req.error)" }
Write-Host "Token: $($req.token)" -ForegroundColor DarkGray

$bodyVerify = @{ token = $req.token; tenant = 'willmar-mn' } | ConvertTo-Json
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
Write-Host "Auth flow OK" -ForegroundColor Green
