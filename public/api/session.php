<?php
declare(strict_types=1);
use GNP\Lib\Config; use GNP\Lib\Util;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Util.php';

session_start();
$config = new Config();
$auth = [
  'user_id' => $_SESSION['user_id'] ?? null,
  'tenant_id' => $_SESSION['tenant_id'] ?? null,
];
Util::json(['ok'=>true,'auth'=>$auth]);
