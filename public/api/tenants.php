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

$tenantSlug = isset($_GET['tenant']) && $_GET['tenant'] !== '' ? $_GET['tenant'] : 'willmar-mn';
try {
  $db = new Db($config);
  $db->ensureBootstrapped(__DIR__ . '/../../data/schema.sql', __DIR__ . '/../../data/seed.sql');
  $pdo = $db->pdo();
} catch (Throwable $e) {
  http_response_code(500);
  Util::json([
    'ok' => false,
    'error' => 'db_driver_missing',
    'message' => 'SQLite driver not available on server. Enable pdo_sqlite and sqlite3 in php.ini.',
    'details' => $e->getMessage(),
    'docs' => '/docs/troubleshooting.md#enable-sqlite-on-windows'
  ], 500);
  exit;
}

$stmt = $pdo->prepare('SELECT id, slug, name FROM tenants ORDER BY name');
$stmt->execute();
$tenants = $stmt->fetchAll();

Util::json([
  'ok' => true,
  'tenants' => $tenants,
  'active' => $tenantSlug,
]);
