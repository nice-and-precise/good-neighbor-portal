<?php
// public/api/ping.php
declare(strict_types=1);

use GNP\Lib\Config;
use GNP\Lib\Util;

require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Util.php';

session_start();
$config = new Config();
Util::json([
    'ok' => true,
    'env' => $config->get('APP_ENV', 'dev'),
]);
