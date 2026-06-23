<?php
require_once __DIR__ . '/../config/database.php';

$username = 'manager';
$password = 'Manager123!';
$email    = 'manager@blackhornets.rs';
$fullName = 'Test Manager';

// Check if already exists
$check = $conn->prepare("SELECT id FROM users WHERE username = ?");
$check->bind_param('s', $username);
$check->execute();
if ($check->get_result()->num_rows > 0) {
    echo "Manager user already exists.\n";
    exit;
}
$check->close();

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("
    INSERT INTO users (username, password, email, full_name, role, status, created_at)
    VALUES (?, ?, ?, ?, 'manager', 'active', NOW())
");
$stmt->bind_param('ssss', $username, $hash, $email, $fullName);

if ($stmt->execute()) {
    echo "Manager user created.\n";
    echo "Username: $username\n";
    echo "Password: $password\n";
    echo "Login at: /panel/admin/login.php\n";
} else {
    echo "Error: " . $stmt->error . "\n";
}
$stmt->close();
