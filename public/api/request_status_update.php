<?php
declare(strict_types=1);
use GNP\Lib\Config; use GNP\Lib\Db; use GNP\Lib\Util; use GNP\Lib\Http;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Db.php';
require_once __DIR__ . '/../../src/Lib/Util.php';
require_once __DIR__ . '/../../src/Lib/Http.php';

session_start();
$config = new Config();
Http::method('POST');
Http::requireCsrf($config);

$uid = $_SESSION['user_id'] ?? null;
$tid = $_SESSION['tenant_id'] ?? null;
if (!$uid || !$tid) { Util::json(['ok'=>false,'error'=>'not_authed'],401); exit; }

// Demo staff bypass: require header X-Staff-Key to match config
$key = $_SERVER['HTTP_X_STAFF_KEY'] ?? '';
$expected = $config->get('STAFF_DEMO_KEY', 'demo-staff');
if ($key === '' || $key !== $expected) { Util::json(['ok'=>false,'error'=>'forbidden'],403); exit; }

$body = Http::bodyJson();
$id = (int)($body['id'] ?? 0);
$action = (string)($body['action'] ?? '');
$allowed = ['ack','in_progress','done','cancelled'];
if ($id <= 0 || !in_array($action, $allowed, true)) { Util::json(['ok'=>false,'error'=>'invalid_input'],422); exit; }

$db = new Db($config);
$pdo = $db->pdo();

// Ensure request belongs to tenant
$exist = $pdo->prepare('SELECT id FROM service_requests WHERE id = ? AND tenant_id = ? LIMIT 1');
$exist->execute([$id, $tid]);
if (!$exist->fetchColumn()) { Util::json(['ok'=>false,'error'=>'not_found'],404); exit; }

$now = (new DateTimeImmutable('now'))->format('Y-m-d H:i:s');
$upd = $pdo->prepare('UPDATE service_requests SET status = ?, updated_at = ? WHERE id = ?');
$upd->execute([$action, $now, $id]);

Util::json(['ok'=>true,'id'=>$id,'status'=>$action,'updated_at'=>$now]);
