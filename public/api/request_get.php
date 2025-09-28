<?php
declare(strict_types=1);
use GNP\Lib\Config; use GNP\Lib\Db; use GNP\Lib\Util; use GNP\Lib\Http;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Db.php';
require_once __DIR__ . '/../../src/Lib/Util.php';
require_once __DIR__ . '/../../src/Lib/Http.php';

$config = new Config();
Http::startSession($config);
Http::method('GET');

$uid = $_SESSION['user_id'] ?? null;
$tid = $_SESSION['tenant_id'] ?? null;
if (!$uid || !$tid) { Util::json(['ok'=>false,'error'=>'not_authed'],401); exit; }

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) { Util::json(['ok'=>false,'error'=>'invalid_id'],422); exit; }

$db = new Db($config);
$pdo = $db->pdo();

$sql = 'SELECT r.id, r.category, r.description, r.status, r.created_at, r.updated_at,
               a.street, a.unit
        FROM service_requests r
        JOIN addresses a ON a.id = r.address_id
        WHERE r.id = ? AND r.tenant_id = ? AND r.resident_id = ?
        LIMIT 1';
$stmt = $pdo->prepare($sql);
$stmt->execute([$id, $tid, $uid]);
$row = $stmt->fetch();
if (!$row) { Util::json(['ok'=>false,'error'=>'not_found'],404); exit; }

$address = $row['street'] . ($row['unit'] ? (' #' . $row['unit']) : '');

Util::json([
  'ok' => true,
  'request' => [
    'id' => (int)$row['id'],
    'category' => $row['category'],
    'description' => $row['description'],
    'status' => $row['status'],
    'address' => $address,
    'created_at' => $row['created_at'],
    'updated_at' => $row['updated_at'],
  ],
]);
