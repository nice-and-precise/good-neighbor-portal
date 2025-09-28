<?php
declare(strict_types=1);
use GNP\Lib\Config; use GNP\Lib\Db; use GNP\Lib\Util; use GNP\Lib\Http;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Db.php';
require_once __DIR__ . '/../../src/Lib/Util.php';
require_once __DIR__ . '/../../src/Lib/Http.php';

$config = new Config();
Http::startSession($config);
Http::method('POST');
Http::requireCsrf($config);

$uid = $_SESSION['user_id'] ?? null;
$tid = $_SESSION['tenant_id'] ?? null;
if (!$uid || !$tid) { Util::json(['ok'=>false,'error'=>'not_authed'],401); exit; }

// Demo staff auth via header
$key = $_SERVER['HTTP_X_STAFF_KEY'] ?? '';
$expected = $config->get('STAFF_DEMO_KEY', 'demo-staff');
if ($key === '' || $key !== $expected) { Util::json(['ok'=>false,'error'=>'forbidden'],403); exit; }

$body = Http::bodyJson();
$requestId = (int)($body['request_id'] ?? 0);
$note = trim((string)($body['note'] ?? ''));
if ($requestId <= 0 || $note === '') { Util::json(['ok'=>false,'error'=>'invalid_input'],422); exit; }

$db = new Db($config);
$pdo = $db->pdo();

// Validate request exists within tenant
$check = $pdo->prepare('SELECT id FROM service_requests WHERE id=? AND tenant_id=?');
$check->execute([$requestId, $tid]);
if (!$check->fetchColumn()) { Util::json(['ok'=>false,'error'=>'not_found'],404); exit; }

$ins = $pdo->prepare('INSERT INTO staff_notes (tenant_id, request_id, staff_id, note) VALUES (?,?,?,?)');
$ins->execute([$tid, $requestId, $uid, $note]);
$id = (int)$pdo->lastInsertId();

Util::json(['ok'=>true,'id'=>$id]);
