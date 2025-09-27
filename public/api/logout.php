<?php
declare(strict_types=1);
use GNP\Lib\Util;

session_start();
session_unset();
session_destroy();
Util::json(['ok'=>true]);
