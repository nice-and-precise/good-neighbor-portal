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

$requestId = isset($_GET['request_id']) ? (int)$_GET['request_id'] : 0;
if ($requestId <= 0) { Util::json(['ok'=>false,'error'=>'invalid_id'],422); exit; }

$db = new Db($config);
$pdo = $db->pdo();

// Validate request exists within tenant
$check = $pdo->prepare('SELECT id FROM service_requests WHERE id=? AND tenant_id=?');
$check->execute([$requestId, $tid]);
if (!$check->fetchColumn()) { Util::json(['ok'=>false,'error'=>'not_found'],404); exit; }

$sel = $pdo->prepare('SELECT n.id, u.display_name as staff_name, n.note, n.created_at
                      FROM staff_notes n
                      JOIN users u ON u.id = n.staff_id
                      WHERE n.tenant_id = ? AND n.request_id = ?
                      ORDER BY n.created_at ASC, n.id ASC');
$sel->execute([$tid, $requestId]);
$items = $sel->fetchAll();

Util::json(['ok'=>true, 'notes'=>$items]);
