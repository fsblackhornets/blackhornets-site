<?php
/**
 * Admin Password Change API
 * POST: { current_password, new_password }
 */
session_start();
header('Content-Type: application/json');

// Must be logged in as admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/../../src/config/database.php';

try {
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    $new_username = trim($_POST['new_username'] ?? '');

    if (empty($current_password)) {
        throw new Exception("Current password is required.");
    }

    // Verify current password
    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE id = ? AND role = 'admin'");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $admin = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$admin || !password_verify($current_password, $admin['password'])) {
        throw new Exception("Current password is incorrect.");
    }

    // Build update query
    $updates = [];
    $params = [];
    $types = '';

    if (!empty($new_password)) {
        if (strlen($new_password) < 8) {
            throw new Exception("New password must be at least 8 characters.");
        }
        $updates[] = "password = ?";
        $params[] = password_hash($new_password, PASSWORD_DEFAULT);
        $types .= 's';
    }

    if (!empty($new_username) && $new_username !== $admin['username']) {
        if (strlen($new_username) < 3) {
            throw new Exception("Username must be at least 3 characters.");
        }
        // Check uniqueness
        $check = $conn->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
        $check->bind_param("si", $new_username, $_SESSION['user_id']);
        $check->execute();
        if ($check->get_result()->num_rows > 0) {
            throw new Exception("Username already taken.");
        }
        $check->close();

        $updates[] = "username = ?";
        $params[] = $new_username;
        $types .= 's';
    }

    if (empty($updates)) {
        throw new Exception("No changes to save.");
    }

    $params[] = $_SESSION['user_id'];
    $types .= 'i';

    $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if (!$stmt->execute()) {
        throw new Exception("Failed to update: " . $stmt->error);
    }
    $stmt->close();

    // Update session if username changed
    if (!empty($new_username)) {
        $_SESSION['username'] = $new_username;
    }

    echo json_encode(['success' => true, 'message' => 'Account updated successfully.']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($conn)) $conn->close();
}
