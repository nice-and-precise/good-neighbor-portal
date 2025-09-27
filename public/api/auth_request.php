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

$body = Http::bodyJson();
$tenant = $body['tenant'] ?? 'willmar-mn';
$who = trim((string)($body['email'] ?? ''));
if (!Validator::email($who)) {
  Util::json(['ok' => false, 'error' => 'invalid_email'], 400);
  exit;
}

$db = new Db($config);
$pdo = $db->pdo();

// Ensure user exists
$pdo->beginTransaction();
$tenantId = (int)$pdo->query("SELECT id FROM tenants WHERE slug=".$pdo->quote($tenant))->fetchColumn();
if (!$tenantId) { $pdo->rollBack(); Util::json(['ok' => false, 'error' => 'tenant_not_found'], 404); exit; }

$stmt = $pdo->prepare('SELECT id FROM users WHERE tenant_id = ? AND email = ? LIMIT 1');
$stmt->execute([$tenantId, $who]);
$userId = (int)($stmt->fetchColumn() ?: 0);
$isNew = false;
if (!$userId) {
  // Role hardcoded to resident for demo
  $ins = $pdo->prepare('INSERT INTO users (tenant_id, role, email, display_name) VALUES (?,"resident",?,?)');
  $ins->execute([$tenantId, $who, $who]);
  $userId = (int)$pdo->lastInsertId();
  $isNew = true;
}

// Seed demo billing for new users (add a few charges once)
if ($isNew) {
  $checkStmt = $pdo->prepare('SELECT COUNT(1) FROM billing_charges WHERE tenant_id = ? AND resident_id = ?');
  $checkStmt->execute([$tenantId, $userId]);
  $hasCharges = (int)$checkStmt->fetchColumn();
  if ($hasCharges === 0) {
    $charges = [
      [2500, 'Quarterly dues'],
      [1899, 'Overage fee'],
      [3200, 'Container swap fee'],
    ];
    $ci = $pdo->prepare('INSERT INTO billing_charges (tenant_id, resident_id, amount_cents, description) VALUES (?,?,?,?)');
    foreach ($charges as $c) { $ci->execute([$tenantId, $userId, $c[0], $c[1]]); }
  }
}

$token = bin2hex(random_bytes(16));
$ttl = 15; // minutes
$exp = (new DateTimeImmutable("+{$ttl} minutes"))->format('Y-m-d H:i:s');
$ins2 = $pdo->prepare('INSERT INTO magic_links (tenant_id, user_id, token, expires_at) VALUES (?,?,?,?)');
$ins2->execute([$tenantId, $userId, $token, $exp]);
$pdo->commit();

// Offline demo: return the token (would be emailed in prod)
Util::json(['ok' => true, 'token' => $token, 'expires_at' => $exp, 'tenant' => $tenant]);
