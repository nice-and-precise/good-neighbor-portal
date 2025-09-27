<?php
// src/Lib/Validator.php
namespace GNP\Lib;

class Validator {
    public static function email(?string $v): bool {
        if ($v === null) return false;
        return (bool)filter_var($v, FILTER_VALIDATE_EMAIL);
    }

    public static function nonEmpty(?string $v): bool {
        return $v !== null && trim($v) !== '';
    }

    public static function in(array $allowed, ?string $v): bool {
        return $v !== null && in_array($v, $allowed, true);
    }
}
