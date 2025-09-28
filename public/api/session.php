<?php
declare(strict_types=1);
use GNP\Lib\Config; use GNP\Lib\Util; use GNP\Lib\Http;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Util.php';
require_once __DIR__ . '/../../src/Lib/Http.php';

$config = new Config();
Http::startSession($config);
$auth = [
  'user_id' => $_SESSION['user_id'] ?? null,
  'tenant_id' => $_SESSION['tenant_id'] ?? null,
];
Util::json(['ok'=>true,'auth'=>$auth]);
