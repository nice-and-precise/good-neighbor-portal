<?php
declare(strict_types=1);
require_once __DIR__ . '/../../src/Lib/Validator.php';
use GNP\Lib\Validator;

$cases = [
  ['a@b.com', true],
  ['bad', false],
  ['', false],
  ['john.doe@example.org', true],
];

$fails = 0;
foreach ($cases as [$email, $expected]) {
  $ok = Validator::email($email);
  if ($ok !== $expected) {
    fwrite(STDERR, "Validator::email failed for $email\n");
    $fails++;
  }
}

exit($fails);
