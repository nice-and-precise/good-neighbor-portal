<?php
declare(strict_types=1);
use GNP\Lib\Config; use GNP\Lib\Db; use GNP\Lib\Util; use GNP\Lib\Http;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Db.php';
require_once __DIR__ . '/../../src/Lib/Util.php';
require_once __DIR__ . '/../../src/Lib/Http.php';

session_start();
$config = new Config();
Http::method('GET');

$uid = $_SESSION['user_id'] ?? null;
$tid = $_SESSION['tenant_id'] ?? null;
if (!$uid || !$tid) { Util::json(['ok'=>false,'error'=>'not_authed'],401); exit; }

// Demo staff gate: require header X-Staff-Key to match config
$key = $_SERVER['HTTP_X_STAFF_KEY'] ?? '';
$expected = $config->get('STAFF_DEMO_KEY', 'demo-staff');
if ($key === '' || $key !== $expected) { Util::json(['ok'=>false,'error'=>'forbidden'],403); exit; }

$status = isset($_GET['status']) ? (string)$_GET['status'] : 'new';
$allowed = ['new','ack','assigned','in_progress','done','cancelled'];
if (!in_array($status, $allowed, true)) { Util::json(['ok'=>false,'error'=>'invalid_status'],422); exit; }

$db = new Db($config);
$pdo = $db->pdo();

$stmt = $pdo->prepare('SELECT r.id, r.category, r.description, r.status, r.created_at, r.updated_at,
  a.street AS address
  FROM service_requests r
  JOIN addresses a ON a.id = r.address_id AND a.tenant_id = r.tenant_id
  WHERE r.tenant_id = ? AND r.status = ?
  ORDER BY r.updated_at IS NULL DESC, r.updated_at DESC, r.created_at DESC
  LIMIT 100');
$stmt->execute([$tid, $status]);
$rows = $stmt->fetchAll();

Util::json(['ok'=>true, 'items'=>$rows, 'status'=>$status]);
