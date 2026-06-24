<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/config/database.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Invalid request method");

    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) throw new Exception("Please enter both username and password");

    $stmt = $conn->prepare("SELECT id, username, password, role, status, full_name FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$user || !password_verify($password, $user['password'])) throw new Exception("Invalid username or password");
    if ($user['status'] !== 'active') throw new Exception("Account is not active");
    if (!in_array($user['role'], ['admin', 'manager'])) throw new Exception("Invalid username or password");

    session_regenerate_id(true);
    $_SESSION['user_id']       = $user['id'];
    $_SESSION['username']      = $user['username'];
    $_SESSION['full_name']     = $user['full_name'];
    $_SESSION['role']          = $user['role'];
    $_SESSION['last_activity'] = time();

    if ($user['role'] === 'admin') {
        $_SESSION['admin_logged_in'] = true;
        $redirect = '/panel/admin/pages/dashboard.php';
    } else {
        $redirect = '/panel/manager/dashboard.php';
    }

    echo json_encode(['status' => 'success', 'message' => 'Login successful', 'redirect' => $redirect]);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    if (isset($conn)) $conn->close();
}
