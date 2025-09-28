<?php
declare(strict_types=1);
use GNP\Lib\Util; use GNP\Lib\Http; use GNP\Lib\Config;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Util.php';
require_once __DIR__ . '/../../src/Lib/Http.php';

$config = new Config();
Http::startSession($config);
// Set a diagnostic cookie
setcookie('gnp_cookie_diag', '1', 0, '/', '', false, true);
Util::json([
  'ok' => true,
  'session_id' => session_id(),
  'has_session' => isset($_SESSION) && session_id() !== '',
  'cookies' => $_COOKIE,
]);
