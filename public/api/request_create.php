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
$category = trim((string)($body['category'] ?? ''));
$description = trim((string)($body['description'] ?? ''));
$validCats = ['bulk_pickup','container_swap','issue_report'];
if (!in_array($category, $validCats, true)) {
  Util::json(['ok'=>false,'error'=>'invalid_category'],422); exit;
}
if ($description === '') { $description = null; }

$db = new Db($config);
$pdo = $db->pdo();

// Pick a demo address in the tenant (first address)
$addr = $pdo->prepare('SELECT id FROM addresses WHERE tenant_id = ? ORDER BY id ASC LIMIT 1');
$addr->execute([$tid]);
$addressId = (int)($addr->fetchColumn() ?: 0);
if (!$addressId) { Util::json(['ok'=>false,'error'=>'no_address_for_tenant'],500); exit; }

$ins = $pdo->prepare('INSERT INTO service_requests (tenant_id, resident_id, address_id, category, description) VALUES (?,?,?,?,?)');
$ins->execute([$tid, $uid, $addressId, $category, $description]);
$id = (int)$pdo->lastInsertId();

Util::json(['ok'=>true,'id'=>$id,'status'=>'new']);