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

$uid = $_SESSION['user_id'] ?? null;
$tid = $_SESSION['tenant_id'] ?? null;
if (!$uid || !$tid) { Util::json(['ok'=>false,'error'=>'not_authed'],401); exit; }

$db = new Db($config);
$pdo = $db->pdo();

// Recent service requests (limit 5)
$req = $pdo->prepare('SELECT id, category as type, status, created_at FROM service_requests WHERE tenant_id=? AND resident_id=? ORDER BY created_at DESC, id DESC LIMIT 5');
$req->execute([$tid, $uid]);
$requests = array_map(function($r){
  return [
    'kind' => 'request',
    'id' => (int)$r['id'],
    'type' => $r['type'],
    'status' => $r['status'],
    'created_at' => $r['created_at'],
  ];
}, $req->fetchAll());

// Recent billing charges (limit 5)
$bil = $pdo->prepare('SELECT id, amount_cents, description, created_at FROM billing_charges WHERE tenant_id=? AND resident_id=? ORDER BY created_at DESC, id DESC LIMIT 5');
$bil->execute([$tid, $uid]);
$bills = array_map(function($b){
  return [
    'kind' => 'billing',
    'id' => (int)$b['id'],
    'amount_cents' => (int)$b['amount_cents'],
    'description' => $b['description'],
    'created_at' => $b['created_at'],
  ];
}, $bil->fetchAll());

// Merge and sort by created_at desc then id desc
$items = array_merge($requests, $bills);
usort($items, function($a,$b){
  if ($a['created_at'] === $b['created_at']) return ($b['id'] <=> $a['id']);
  return strcmp($b['created_at'], $a['created_at']);
});

Util::json(['ok'=>true,'items'=>$items]);