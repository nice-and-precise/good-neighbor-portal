<?php
// Minimal deterministic behavior test for pay_demo.php (even/odd cents) without requiring curl extension.
// Uses file_get_contents with stream context and manual cookie handling.

$base = getenv('BASE_URL') ?: 'http://127.0.0.1:8080';

$cookieJar = [];

function build_cookie_header(array $jar): string {
  if (empty($jar)) return '';
  $pairs = [];
  foreach ($jar as $k => $v) { $pairs[] = $k.'='.$v; }
  return 'Cookie: '.implode('; ', $pairs);
}

function capture_set_cookies(array $headers, array &$jar): void {
  foreach ($headers as $h) {
    if (stripos($h, 'Set-Cookie:') === 0) {
      // Format: Set-Cookie: name=value; Path=/; HttpOnly
      $rest = trim(substr($h, strlen('Set-Cookie:')));
      $parts = explode(';', $rest);
      if (!empty($parts[0])) {
        $kv = explode('=', trim($parts[0]), 2);
        if (count($kv) === 2) { $jar[$kv[0]] = $kv[1]; }
      }
    }
  }
}

function http_get_json(string $url, array &$cookieJar): array {
  $headers = [];
  $cookieHeader = build_cookie_header($cookieJar);
  if ($cookieHeader) { $headers[] = $cookieHeader; }
  $ctx = stream_context_create([
    'http' => [
      'method' => 'GET',
      'header' => implode("\r\n", $headers),
      'ignore_errors' => true,
      'timeout' => 10,
    ]
  ]);
  $out = @file_get_contents($url, false, $ctx);
  if ($out === false) { fwrite(STDERR, "GET failed: $url\n"); return []; }
  global $http_response_header;
  capture_set_cookies($http_response_header ?? [], $cookieJar);
  return json_decode($out, true) ?: [];
}

function http_post_json(string $url, array $data, array $extraHeaders, array &$cookieJar): array {
  $headers = ['Content-Type: application/json'];
  foreach ($extraHeaders as $h) { $headers[] = $h; }
  $cookieHeader = build_cookie_header($cookieJar);
  if ($cookieHeader) { $headers[] = $cookieHeader; }
  $ctx = stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => implode("\r\n", $headers),
      'content' => json_encode($data),
      'ignore_errors' => true,
      'timeout' => 10,
    ]
  ]);
  $out = @file_get_contents($url, false, $ctx);
  if ($out === false) { fwrite(STDERR, "POST failed: $url\n"); return []; }
  global $http_response_header;
  capture_set_cookies($http_response_header ?? [], $cookieJar);
  return json_decode($out, true) ?: [];
}

// Get CSRF (establishes session cookie as well)
$csrf = http_get_json($base.'/api/csrf.php', $cookieJar);
if (!$csrf || empty($csrf['ok'])) { fwrite(STDERR, "CSRF failed\n"); exit(1); }
$token = $csrf['csrf'];
$hdr = ['X-CSRF: '.$token];

// Authenticate via demo magic link flow
$tenant = 'willmar-mn';
$email = 'ci@example.com';
$req = http_post_json($base.'/api/auth_request.php', ['email'=>$email,'tenant'=>$tenant], $hdr, $cookieJar);
if (!$req || empty($req['ok']) || empty($req['token'])) { fwrite(STDERR, "auth_request failed\n"); exit(1); }
$verify = http_post_json($base.'/api/auth_verify.php', ['token'=>$req['token'],'tenant'=>$tenant], $hdr, $cookieJar);
if (!$verify || empty($verify['ok'])) { fwrite(STDERR, "auth_verify failed\n"); exit(1); }

// Now exercise pay endpoint
$even = http_post_json($base.'/api/pay_demo.php', ['amount_cents'=>2000,'method'=>'card'], $hdr, $cookieJar);
$odd  = http_post_json($base.'/api/pay_demo.php', ['amount_cents'=>2001,'method'=>'card'], $hdr, $cookieJar);

$fails = 0;
if (!$even || empty($even['ok'])) { fwrite(STDERR, "Even amount should succeed\n"); $fails++; }
if (!$odd || !empty($odd['ok'])) { fwrite(STDERR, "Odd amount should fail\n"); $fails++; }

exit($fails);
