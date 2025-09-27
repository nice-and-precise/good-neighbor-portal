<?php
// Lightweight diagnostics to verify SQLite extensions are loaded in the server runtime
header('Content-Type: application/json');
$ini = php_ini_loaded_file();
$extDir = ini_get('extension_dir');
$loaded = get_loaded_extensions();
$hasPdo = extension_loaded('pdo');
$hasSqlite3 = extension_loaded('sqlite3');
$hasPdoSqlite = extension_loaded('pdo_sqlite');
$pdoDrivers = function_exists('pdo_drivers') ? pdo_drivers() : [];
echo json_encode([
    'ok' => true,
    'php' => PHP_VERSION,
    'sapi' => PHP_SAPI,
    'ini' => $ini,
    'extension_dir' => $extDir,
    'has' => [
        'pdo' => $hasPdo,
        'sqlite3' => $hasSqlite3,
        'pdo_sqlite' => $hasPdoSqlite,
    ],
    'pdo_drivers' => $pdoDrivers,
    'loaded_extensions' => $loaded,
]);
?>
