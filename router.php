<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route all /backend/api/* requests through the front controller
if (str_starts_with($uri, '/backend/api/')) {
    require __DIR__ . '/backend/index.php';
    return;
}

// Serve existing files/directories normally
if (is_file(__DIR__ . $uri) || is_dir(__DIR__ . $uri)) {
    return false;
}

// Fallback: let PHP serve it
return false;
