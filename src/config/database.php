<?php
// Load credentials from environment or config file
$env_file = __DIR__ . '/../../.env.php';
if (file_exists($env_file)) {
    $env = require $env_file;
    $servername = $env['DB_HOST'] ?? 'localhost';
    $username = $env['DB_USER'] ?? 'root';
    $password = $env['DB_PASS'] ?? '';
    $dbname = $env['DB_NAME'] ?? 'blackhornets';
} else {
    // Fallback for local development (XAMPP)
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "blackhornets";
}

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        throw new Exception("Database connection failed");
    }

    // Set UTF-8 character encoding for proper Serbian character support
    $conn->set_charset("utf8mb4");
} catch (Exception $e) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection error. Please try again later.'
    ]));
}
?>
