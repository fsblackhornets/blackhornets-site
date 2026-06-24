<?php
require_once '../auth.php';
$user = checkAuth('admin');

header('Content-Type: application/json');

// Database connection settings
require_once __DIR__ . '/../../../backend/config/database.php';

try {
    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id']) || !isset($data['action'])) {
        throw new Exception('Missing required parameters');
    }

    $id = (int)$data['id'];
    $action = $data['action'];

    // Validate action
    if (!in_array($action, ['accept', 'reject'])) {
        throw new Exception('Invalid action');
    }

    // Create database connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Update application status
    $status = ($action === 'accept') ? 'accepted' : 'rejected';
    
    $stmt = $conn->prepare("UPDATE applications SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => "Application has been {$status} successfully"
        ]);
    } else {
        throw new Exception("Error updating application status");
    }

} catch (Exception $e) {
    http_response_code(400);
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