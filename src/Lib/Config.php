<?php
// src/Lib/Config.php
namespace GNP\Lib;

class Config {
    private array $env;

    public function __construct(?string $envFile = null) {
        $this->env = [];
        $this->loadEnv($envFile ?? __DIR__ . '/../../config/app.env');
    }

    private function loadEnv(string $path): void {
        if (!file_exists($path)) {
            // fallback to example to keep first-run easy
            $example = __DIR__ . '/../../config/app.example.env';
            if (file_exists($example)) {
                $path = $example;
            }
        }
        if (file_exists($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#')) continue;
                $parts = explode('=', $line, 2);
                if (count($parts) === 2) {
                    $this->env[$parts[0]] = $parts[1];
                }
            }
        }
    }

    public function get(string $key, ?string $default = null): ?string {
        return $this->env[$key] ?? $default;
    }
}
