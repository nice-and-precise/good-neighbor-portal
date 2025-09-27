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
}
