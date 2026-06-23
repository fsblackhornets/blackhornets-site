<?php
// Load SMTP config from .env.php
$_env = file_exists(__DIR__ . '/../../.env.php')
    ? require __DIR__ . '/../../.env.php'
    : [];

define('SMTP_HOST',      $_env['SMTP_HOST']      ?? 'smtp.gmail.com');
define('SMTP_PORT',      $_env['SMTP_PORT']      ?? 587);
define('SMTP_USERNAME',  $_env['SMTP_USERNAME']  ?? '');
define('SMTP_PASSWORD',  $_env['SMTP_PASSWORD']  ?? '');
define('SMTP_FROM',      $_env['SMTP_FROM']      ?? '');
define('SMTP_FROM_NAME', $_env['SMTP_FROM_NAME'] ?? 'Black Hornets Racing');
