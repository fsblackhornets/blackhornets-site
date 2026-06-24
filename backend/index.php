<?php
ini_set('display_errors', 0);
if (session_status() === PHP_SESSION_NONE) session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/schemas/Response.php';
require_once __DIR__ . '/routes/Router.php';

spl_autoload_register(function (string $class): void {
    $dirs = [
        __DIR__ . '/controllers/',
        __DIR__ . '/services/',
        __DIR__ . '/repositories/',
        __DIR__ . '/validators/',
        __DIR__ . '/models/',
    ];
    foreach ($dirs as $dir) {
        $file = $dir . $class . '.php';
        if (file_exists($file)) { require_once $file; return; }
    }
});

$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$prefix = '/backend/api';
$path   = str_starts_with($uri, $prefix) ? substr($uri, strlen($prefix)) : $uri;
$path   = '/' . trim($path, '/');
if ($path === '/') $path = '/';

$method = $_SERVER['REQUEST_METHOD'];
$router = new Router();

require_once __DIR__ . '/routes/api.php';

try {
    $router->dispatch($method, $path, $conn);
} catch (Exception $e) {
    Response::error($e->getMessage(), 500);
}
