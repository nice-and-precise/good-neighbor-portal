<?php
declare(strict_types=1);
use GNP\Lib\Config; use GNP\Lib\Util; use GNP\Lib\Http;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Util.php';
require_once __DIR__ . '/../../src/Lib/Http.php';

$config = new Config();
Http::startSession($config);
$secret = $config->get('CSRF_SECRET', 'dev');
Util::json(['ok' => true, 'csrf' => GNP\Lib\Util::csrfToken($secret)]);
