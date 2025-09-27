<?php
declare(strict_types=1);
use GNP\Lib\Config; use GNP\Lib\Db; use GNP\Lib\Util;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Db.php';
require_once __DIR__ . '/../../src/Lib/Util.php';

session_start();
$config = new Config();

$userId = $_SESSION['user_id'] ?? null;
$tenantId = $_SESSION['tenant_id'] ?? null;
if (!$userId || !$tenantId) {
  Util::json(['ok' => false, 'error' => 'not_authed'], 401);
  exit;
}

// Compute a deterministic next pickup date Mon-Fri using user_id
function nextPickupDate(int $userId): string {
  $dow = ($userId % 5); // 0..4 => Mon..Fri
  $today = new DateTimeImmutable('today');
  $todayDow = (int)$today->format('N') - 1; // 0..6 => Mon..Sun
  $delta = $dow - $todayDow;
  if ($delta < 0) { $delta += 7; }
  if ($delta === 0) { $delta = 7; } // always next occurrence
  return $today->modify("+{$delta} days")->format('Y-m-d');
}

$db = new Db($config);
$pdo = $db->pdo();

// Profile
$stmt = $pdo->prepare('SELECT display_name, email FROM users WHERE id = ? AND tenant_id = ? LIMIT 1');
$stmt->execute([$userId, $tenantId]);
$profile = $stmt->fetch() ?: ['display_name' => 'Resident', 'email' => null];

// Billing history (last 10)
$stmt2 = $pdo->prepare('SELECT id, amount_cents, description, created_at FROM billing_charges WHERE tenant_id = ? AND resident_id = ? ORDER BY created_at DESC, id DESC LIMIT 10');
$stmt2->execute([$tenantId, $userId]);
$billing = $stmt2->fetchAll();

$stmt3 = $pdo->prepare('SELECT id, category, status, created_at FROM service_requests WHERE tenant_id = ? AND resident_id = ? ORDER BY id DESC LIMIT 1');
$stmt3->execute([$tenantId, $userId]);
$lastReq = $stmt3->fetch() ?: null;

Util::json([
  'ok' => true,
  'profile' => $profile,
  'next_pickup_date' => nextPickupDate((int)$userId),
  'billing' => $billing,
  'last_request' => $lastReq,
]);
