<?php
// src/Lib/Http.php
namespace GNP\Lib;

class Http {
    public static function startSession(Config $config): void {
        // Dev-only header-based session id fallback (for embedded previews without cookies)
        $allow = ($config->get('APP_ENV', 'dev') === 'dev') || ($config->get('DEV_SESSION_HEADER', '1') === '1');
        if ($allow) {
            $sid = $_SERVER['HTTP_X_DEV_SESSION'] ?? '';
            if ($sid !== '' && preg_match('/^[A-Za-z0-9,-]{16,}$/', $sid)) {
                @session_id($sid);
            }
        }
        if (session_status() !== PHP_SESSION_ACTIVE) {
            @session_start();
        }
    }
    public static function method(string $expected): void {
        if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== strtoupper($expected)) {
            Util::json(['ok' => false, 'error' => 'method_not_allowed'], 405);
            exit;
        }
    }

    public static function bodyJson(): array {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw ?: 'null', true);
        return is_array($data) ? $data : [];
    }

    public static function requireCsrf(Config $config): void {
        $secret = $config->get('CSRF_SECRET', 'dev');
        $hdr = $_SERVER['HTTP_X_CSRF'] ?? '';
        if ($hdr === '' || $hdr !== Util::csrfToken($secret)) {
            Util::json(['ok' => false, 'error' => 'bad_csrf'], 403);
            exit;
        }
    }
}
