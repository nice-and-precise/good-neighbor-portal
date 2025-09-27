<?php
// src/Lib/Util.php
namespace GNP\Lib;

class Util {
    public static function json(array $data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
    }

    public static function csrfToken(string $secret): string {
        // simple HMAC with session id; improves in later milestones
        $sid = session_id();
        return hash_hmac('sha256', $sid, $secret);
    }

    public static function logError(string $message, array $context = []): void {
        // Sanitize obvious PII keys
        $filtered = [];
        foreach ($context as $k => $v) {
            if (in_array($k, ['email','token','password','session'], true)) continue;
            $filtered[$k] = is_scalar($v) ? $v : json_encode($v);
        }
        $line = sprintf('[%s] %s %s' . "\n", date('c'), $message, $filtered ? json_encode($filtered) : '');
        $base = dirname(__DIR__, 2);
        $logDir = $base . DIRECTORY_SEPARATOR . 'logs';
        if (!is_dir($logDir)) @mkdir($logDir, 0777, true);
        @file_put_contents($logDir . DIRECTORY_SEPARATOR . 'app-error.log', $line, FILE_APPEND);
    }
}
