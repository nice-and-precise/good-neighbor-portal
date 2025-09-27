Param(
  [string]$BaseUrl = 'http://127.0.0.1:8080',
  [string]$Email = 'resident@example.com',
  [string]$Tenant = 'willmar-mn'
)

$ProgressPreference = 'SilentlyContinue'
# Maintain a single WebSession across requests so CSRF token matches the session
$script:sess = $null
function Get-Json($url) { (Invoke-WebRequest -Uri $url -UseBasicParsing -WebSession $script:sess).Content | ConvertFrom-Json }
function Invoke-PostJson($url, $obj, $headers=@{}) {
  $json = $obj | ConvertTo-Json -Compress
  (Invoke-WebRequest -Uri $url -Method Post -Body $json -ContentType 'application/json' -Headers $headers -UseBasicParsing -WebSession $script:sess).Content | ConvertFrom-Json
}

# Initialize session and get CSRF
$csrfResp = Invoke-WebRequest -Uri "$BaseUrl/api/csrf.php" -UseBasicParsing -SessionVariable sess
$script:sess = $sess
$csrf = ($csrfResp.Content | ConvertFrom-Json)
if (-not $csrf.ok) { throw 'CSRF failed' }
$token = $csrf.csrf
$headers = @{ 'X-CSRF' = $token }

$ten = Get-Json "$BaseUrl/api/tenants.php?tenant=$Tenant"
if (-not $ten.ok) { throw 'Tenants failed' }

$req = Invoke-PostJson "$BaseUrl/api/auth_request.php" @{ email=$Email; tenant=$Tenant } $headers
if (-not $req.ok) { throw 'Auth request failed' }
$verify = Invoke-PostJson "$BaseUrl/api/auth_verify.php" @{ token=$req.token; tenant=$Tenant } $headers
if (-not $verify.ok) { throw 'Auth verify failed' }

$newReq = Invoke-PostJson "$BaseUrl/api/request_create.php" @{ category='bulk_pickup'; description='Smoke test request' } $headers
if (-not $newReq.ok) { throw 'Create request failed' }

$status = Invoke-PostJson "$BaseUrl/api/request_status_update.php" @{ id=$newReq.id; action='ack' } (@{ 'X-Staff-Key'='demo-staff'; 'X-CSRF'=$token })
if (-not $status.ok) { throw 'Status update failed' }

$csv = Invoke-WebRequest -Uri "$BaseUrl/api/route_summary.csv.php" -UseBasicParsing -WebSession $script:sess
if ($csv.StatusCode -ne 200) { throw 'CSV export failed' }

Write-Host 'Smoke OK'
