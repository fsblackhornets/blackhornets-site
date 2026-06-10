<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Include database connection
require_once '../../../src/config/database.php';

// Connection is already established in database.php as $conn
try {

    // Get all projects ordered by creation date
    $query = "SELECT id, name, description, status, due_date, duration, progress, image, created_at FROM projects ORDER BY created_at DESC";
    $result = $conn->query($query);
    
    $projects = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Add full URL to image if exists
            if ($row['image']) {
                $row['image_url'] = 'admin/uploads/projects/' . $row['image'];
            } else {
                $row['image_url'] = null;
            }
            
            // Calculate days remaining
            $due_date = new DateTime($row['due_date']);
            $today = new DateTime();
            $days_remaining = $today->diff($due_date)->days;
            $row['days_remaining'] = $days_remaining;
            $row['is_overdue'] = $due_date < $today;
            
            $projects[] = $row;
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $projects,
        'count' => count($projects)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}

if (isset($conn)) {
    $conn->close();
}
?> 