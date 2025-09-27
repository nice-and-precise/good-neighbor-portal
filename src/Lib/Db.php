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
