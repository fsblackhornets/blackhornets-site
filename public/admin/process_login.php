<?php
session_start();
header('Content-Type: application/json');

// Include centralized database configuration
require_once __DIR__ . '/../../src/config/database.php';

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed");
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($password)) {
            throw new Exception("Please enter both username and password");
        }

        $stmt = $conn->prepare("
            SELECT id, username, password, role, status, full_name
            FROM users
            WHERE username = ?
        ");

        if (!$stmt) {
            throw new Exception("Database error occurred");
        }

        $stmt->bind_param("s", $username);
        if (!$stmt->execute()) {
            throw new Exception("Database error occurred");
        }

        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if (!$user) {
            throw new Exception("Invalid username or password");
        }

        if (!password_verify($password, $user['password'])) {
            throw new Exception("Invalid username or password");
        }

        if ($user['status'] !== 'active') {
            throw new Exception("Your account is not active. Please contact administrator.");
        }

        // Only admin accounts can log in
        if ($user['role'] !== 'admin') {
            throw new Exception("Invalid username or password");
        }

        // Regenerate session ID to prevent session fixation
        session_regenerate_id(true);

        // Store session data
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['full_name'] = $user['full_name'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['last_activity'] = time();

        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'redirect' => 'pages/dashboard.php'
        ]);

    } else {
        throw new Exception("Invalid request method");
    }

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
