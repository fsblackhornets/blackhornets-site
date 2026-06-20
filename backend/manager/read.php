<?php
ini_set('display_errors', 0);
if (session_status() === PHP_SESSION_NONE) session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$role = $_SESSION['role'] ?? '';
$user_id = $_SESSION['user_id'];

$status_filter = $_GET['status'] ?? 'all';
$type_filter   = $_GET['type']   ?? 'all';

$where = [];
$params = [];
$types  = '';

// Admin sees all; manager sees only their own
if ($role !== 'admin') {
    $where[] = 'submitted_by = ?';
    $params[] = $user_id;
    $types .= 'i';
}

if ($status_filter !== 'all') {
    $where[] = 'status = ?';
    $params[] = $status_filter;
    $types .= 's';
}

if ($type_filter !== 'all') {
    $where[] = 'type = ?';
    $params[] = $type_filter;
    $types .= 's';
}

$sql = "SELECT id, type, data, submitted_by, submitter_name, status, admin_notes, reviewed_by, created_at, reviewed_at
        FROM content_requests";

if ($where) {
    $sql .= ' WHERE ' . implode(' AND ', $where);
}

$sql .= ' ORDER BY created_at DESC';

$stmt = $conn->prepare($sql);

if ($params) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$requests = [];
while ($row = $result->fetch_assoc()) {
    $row['data'] = json_decode($row['data'], true);
    // Strip profile pictures / file paths from manager view for privacy
    $requests[] = $row;
}

echo json_encode(['success' => true, 'data' => $requests, 'total' => count($requests)]);
$stmt->close();
