<?php
declare(strict_types=1);
use GNP\Lib\Config; use GNP\Lib\Db; use GNP\Lib\Http;
require_once __DIR__ . '/../../src/Lib/Config.php';
require_once __DIR__ . '/../../src/Lib/Db.php';
require_once __DIR__ . '/../../src/Lib/Http.php';

// CSV export of route summary derived from service_requests by service day (demo approximation)
session_start();
$config = new Config();
Http::method('GET');

$uid = $_SESSION['user_id'] ?? null;
$tid = $_SESSION['tenant_id'] ?? null;
if (!$uid || !$tid) { http_response_code(401); echo "not_authed"; exit; }

$db = new Db($config);
$pdo = $db->pdo();

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="route-summary.csv"');

$out = fopen('php://output', 'w');
fputcsv($out, ['service_day','neighborhood_name','route_name','pickup_count','area_code','generated_at']);

// Demo: fabricate service_day from created_at weekday; join neighborhoods by address neighborhood_id
$sql = "
SELECT
  CASE strftime('%w', r.created_at)
    WHEN '1' THEN 'Monday' WHEN '2' THEN 'Tuesday' WHEN '3' THEN 'Wednesday'
    WHEN '4' THEN 'Thursday' WHEN '5' THEN 'Friday' ELSE 'Saturday' END AS service_day,
  n.name AS neighborhood_name,
  ('Route ' || printf('%02d', (a.id % 7)+1)) AS route_name,
  COUNT(r.id) AS pickup_count,
  n.code AS area_code,
  datetime('now') AS generated_at
FROM service_requests r
JOIN addresses a ON a.id = r.address_id AND a.tenant_id = r.tenant_id
JOIN neighborhoods n ON n.id = a.neighborhood_id AND n.tenant_id = r.tenant_id
WHERE r.tenant_id = :tid
GROUP BY service_day, neighborhood_name, route_name, area_code
ORDER BY service_day, neighborhood_name, route_name
";

$stmt = $pdo->prepare($sql);
$stmt->execute([':tid'=>$tid]);
while ($row = $stmt->fetch(\PDO::FETCH_NUM)) {
  fputcsv($out, $row);
}
fclose($out);
