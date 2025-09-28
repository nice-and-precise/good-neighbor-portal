<?php
// public/app.php
// Small shim to serve app.js with no-cache headers.
// This helps environments like VS Code Simple Browser avoid stale caching.
declare(strict_types=1);

$path = __DIR__ . '/app.js';
if (!is_file($path)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo "app.js not found";
    exit;
}

header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

// Strong ETag tied to file mtime/size to aid dev tools while still no-storing
$mtime = filemtime($path) ?: time();
$size  = filesize($path) ?: 0;
$etag  = 'W/"' . md5($mtime . ':' . $size) . '"';
header('ETag: ' . $etag);

readfile($path);
