<?php
// Ensure the root URL renders a landing page when using PHP's built-in server
// Send no-cache headers so browsers don't stick to old HTML/JS
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

$index = __DIR__ . '/index.html';
if (is_file($index)) {
  readfile($index);
  exit;
}
?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Good Neighbor Portal</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1rem; }
    .note { background:#eef; padding:.5rem; border-radius:.25rem; }
  </style>
</head>
<body>
  <h1>Good Neighbor Portal</h1>
  <p class="note">Scaffold ready. Use the PowerShell scripts to setup and run the app.</p>
  <p><a href="/api/ping.php">Ping API</a></p>
</body>
</html>
