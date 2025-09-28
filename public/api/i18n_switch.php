<?php
declare(strict_types=1);
use GNP\Lib\Config; use GNP\Lib\Util; use GNP\Lib\Http;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Util.php';
require_once __DIR__ . '/../../src/Lib/Http.php';

$config = new Config();
Http::startSession($config);
Http::method('POST');
Http::requireCsrf($config);

$body = Http::bodyJson();
$lang = (string)($body['lang'] ?? 'en');
if (!in_array($lang, ['en','es'], true)) { Util::json(['ok'=>false,'error'=>'invalid_lang'],422); exit; }
$_SESSION['lang'] = $lang;
Util::json(['ok'=>true, 'lang'=>$lang]);
