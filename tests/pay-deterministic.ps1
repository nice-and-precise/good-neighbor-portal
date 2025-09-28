Param(
  [string]$BaseUrl = 'http://127.0.0.1:8080',
  [string]$Email = 'ci@example.com',
  [string]$Tenant = 'willmar-mn'
)

$ProgressPreference = 'SilentlyContinue'
$script:sess = $null
function Get-Json($url) { (Invoke-WebRequest -Uri $url -UseBasicParsing -WebSession $script:sess).Content | ConvertFrom-Json }
function Invoke-PostJson($url, $obj, $headers=@{}) {
  $json = $obj | ConvertTo-Json -Compress
  $resp = $null
  try {
    $resp = Invoke-WebRequest -Uri $url -Method Post -Body $json -ContentType 'application/json' -Headers $headers -UseBasicParsing -WebSession $script:sess -ErrorAction Stop
    return ($resp.Content | ConvertFrom-Json)
  } catch {
    # Attempt to read the error response body (e.g., 4xx with JSON payload)
    $ex = $_.Exception
    if ($ex -and $ex.Response) {
      try {
        $stream = $ex.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $body = $reader.ReadToEnd()
        if ($reader) { $reader.Dispose() }
        if ($stream) { $stream.Dispose() }
        if ($body) {
          return ($body | ConvertFrom-Json)
        }
      } catch {
        # Fall through to rethrow
      }
    }
    throw
  }
}

# Init session/CSRF
$csrfResp = Invoke-WebRequest -Uri "$BaseUrl/api/csrf.php" -UseBasicParsing -SessionVariable sess
$script:sess = $sess
$csrf = ($csrfResp.Content | ConvertFrom-Json)
if (-not $csrf.ok) { throw 'CSRF failed' }
$token = $csrf.csrf
$headers = @{ 'X-CSRF' = $token }

# Auth flow (required for pay endpoint)
$req = Invoke-PostJson "$BaseUrl/api/auth_request.php" @{ email=$Email; tenant=$Tenant } $headers
if (-not $req.ok) { throw "auth_request failed: $($req | ConvertTo-Json -Compress)" }
$verify = Invoke-PostJson "$BaseUrl/api/auth_verify.php" @{ token=$($req.token); tenant=$Tenant } $headers
if (-not $verify.ok) { throw "auth_verify failed: $($verify | ConvertTo-Json -Compress)" }

# Pay - even should succeed
$even = Invoke-PostJson "$BaseUrl/api/pay_demo.php" @{ amount_cents=2000; method='card' } $headers
if (-not $even.ok) { throw 'Even amount should succeed' }

# Pay - odd should fail
$odd = Invoke-PostJson "$BaseUrl/api/pay_demo.php" @{ amount_cents=2001; method='card' } $headers
if ($odd.ok) { throw 'Odd amount should fail' }

Write-Host 'Pay deterministic test OK'