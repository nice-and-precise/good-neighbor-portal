<?php
declare(strict_types=1);
use GNP\Lib\Config; use GNP\Lib\Db; use GNP\Lib\Util; use GNP\Lib\Http; use GNP\Lib\Validator;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Db.php';
require_once __DIR__ . '/../../src/Lib/Util.php';
require_once __DIR__ . '/../../src/Lib/Http.php';
require_once __DIR__ . '/../../src/Lib/Validator.php';

session_start();
$config = new Config();
Http::method('POST');
Http::requireCsrf($config);

$uid = $_SESSION['user_id'] ?? null;
$tid = $_SESSION['tenant_id'] ?? null;
if (!$uid || !$tid) { Util::json(['ok'=>false,'error'=>'not_authed'],401); exit; }

$body = Http::bodyJson();
$amount = (int)($body['amount_cents'] ?? 0);
$method = (string)($body['method'] ?? 'card');

if ($amount <= 0) { Util::json(['ok'=>false,'error'=>'invalid_amount'],422); exit; }

// Deterministic sandbox: even cents = success, odd = failure
$success = ($amount % 2 === 0);
if ($method !== 'card' && $method !== 'ach') $method = 'card';

$result = [
  'ok' => $success,
  'method' => $method,
  'amount_cents' => $amount,
  'sandbox' => true,
  'message' => $success ? 'Payment accepted (demo)' : 'Payment failed (demo)'
];

// Optionally record a demo charge when success for better visibility
if ($success) {
  $db = new Db($config);
  $pdo = $db->pdo();
  $ins = $pdo->prepare('INSERT INTO billing_charges (tenant_id, resident_id, amount_cents, description) VALUES (?,?,?,?)');
  $ins->execute([$tid, $uid, $amount, 'Demo payment receipt']);
}

Util::json($result, $success ? 200 : 402);
