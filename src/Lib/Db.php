<?php
// src/Lib/Db.php
namespace GNP\Lib;

use PDO;
use PDOException;

class Db {
    private PDO $pdo;

    public function __construct(Config $config) {
        $dsn = $config->get('DB_DSN', 'sqlite:./data/app.db');
        $user = $config->get('DB_USER', '');
        $pass = $config->get('DB_PASS', '');
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        // If using SQLite with a relative path, resolve relative to project root (two dirs up from src/Lib)
        if (str_starts_with($dsn, 'sqlite:')) {
            $path = substr($dsn, 7);
            $isMemory = ($path === ':memory:' || $path === 'memory');
            if (!$isMemory) {
                $isAbsoluteUnix = ($path !== '' && ($path[0] === '/' || $path[0] === '\\'));
                $isAbsoluteWin = (strlen($path) >= 2 && ((($path[0] >= 'A' && $path[0] <= 'Z') || ($path[0] >= 'a' && $path[0] <= 'z')) && $path[1] === ':'));
                if (!$isAbsoluteUnix && !$isAbsoluteWin) {
                    $base = dirname(__DIR__, 2); // project root
                    $rel = ltrim($path, "./\\");
                    $abs = $base . DIRECTORY_SEPARATOR . $rel;
                    // Normalize to forward slashes for DSN
                    $abs = str_replace('\\', '/', $abs);
                    $dsn = 'sqlite:' . $abs;
                }
            }
        }

        $this->pdo = new PDO($dsn, $user ?: null, $pass ?: null, $options);
        if (str_starts_with($dsn, 'sqlite:')) {
            $this->pdo->exec('PRAGMA foreign_keys = ON;');
        }
    }

    public function pdo(): PDO { return $this->pdo; }

    public function migrate(string $schemaPath): void {
        $sql = file_get_contents($schemaPath);
        if ($sql === false) throw new \RuntimeException('Cannot read schema.sql');
        $this->pdo->exec($sql);
    }

    public function seed(string $seedPath): void {
        $sql = file_get_contents($seedPath);
        if ($sql === false) throw new \RuntimeException('Cannot read seed.sql');
        $this->pdo->exec($sql);
    }
}
