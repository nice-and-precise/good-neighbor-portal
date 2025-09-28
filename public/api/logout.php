<?php
declare(strict_types=1);
use GNP\Lib\Util; use GNP\Lib\Http; use GNP\Lib\Config;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Http.php';
require_once __DIR__ . '/../../src/Lib/Util.php';

$config = new Config();
Http::startSession($config);
session_unset();
session_destroy();
Util::json(['ok'=>true]);
