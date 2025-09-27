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

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) { Util::json(['ok'=>false,'error'=>'invalid_id'],422); exit; }

$db = new Db($config);
$pdo = $db->pdo();

$sql = 'SELECT id, amount_cents, description, created_at
        FROM billing_charges
        WHERE id = ? AND tenant_id = ? AND resident_id = ?
        LIMIT 1';
$stmt = $pdo->prepare($sql);
$stmt->execute([$id, $tid, $uid]);
$row = $stmt->fetch();
if (!$row) { Util::json(['ok'=>false,'error'=>'not_found'],404); exit; }

Util::json([
  'ok' => true,
  'charge' => [
    'id' => (int)$row['id'],
    'amount_cents' => (int)$row['amount_cents'],
    'description' => $row['description'],
    'created_at' => $row['created_at'],
  ],
]);
