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

$body = GNP\Lib\Http::bodyJson();
$tenant = $body['tenant'] ?? 'willmar-mn';
$token = (string)($body['token'] ?? '');
if ($token === '') { Util::json(['ok' => false, 'error' => 'missing_token'], 400); exit; }

$db = new Db($config);
$pdo = $db->pdo();

$stmt = $pdo->prepare('SELECT ml.id, ml.user_id, ml.expires_at, u.tenant_id FROM magic_links ml JOIN users u ON u.id=ml.user_id WHERE ml.token=? LIMIT 1');
$stmt->execute([$token]);
$row = $stmt->fetch();
if (!$row) { Util::json(['ok'=>false,'error'=>'invalid_token'], 400); exit; }

if ($row['expires_at'] < gmdate('Y-m-d H:i:s')) { Util::json(['ok'=>false,'error'=>'expired_token'], 400); exit; }

// bind session
$_SESSION['user_id'] = (int)$row['user_id'];
$_SESSION['tenant_id'] = (int)$row['tenant_id'];

$upd = $pdo->prepare('UPDATE magic_links SET used_at=datetime("now") WHERE id=?');
$upd->execute([(int)$row['id']]);

Util::json(['ok'=>true,'user_id'=>$_SESSION['user_id'],'tenant_id'=>$_SESSION['tenant_id']]);
