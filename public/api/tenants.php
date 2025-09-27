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

$tenantSlug = $_GET['tenant'] ?? 'willmar-mn';
$db = new Db($config);
$pdo = $db->pdo();

$stmt = $pdo->prepare('SELECT id, slug, name FROM tenants ORDER BY name');
$stmt->execute();
$tenants = $stmt->fetchAll();

Util::json([
  'ok' => true,
  'tenants' => $tenants,
  'active' => $tenantSlug,
]);
