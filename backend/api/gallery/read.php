<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Include database connection
require_once '../../config/database.php';

// Connection is already established in database.php as $conn
try {
    // Get category filter if provided
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    
    // Build query
    $query = "SELECT * FROM gallery_images WHERE is_active = 1";
    $params = [];
    $types = "";
    
    if ($category) {
        $query .= " AND category = ?";
        $params[] = $category;
        $types .= "s";
    }
    
    $query .= " ORDER BY category, sort_order, created_at DESC";
    
    $stmt = $conn->prepare($query);
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $images = [];
    while ($row = $result->fetch_assoc()) {
        $images[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'description_en' => $row['description_en'] ?? '',
            'image_path' => $row['image_path'],
            'category' => $row['category'],
            'alt_text' => $row['alt_text'],
            'sort_order' => $row['sort_order'],
            'created_at' => $row['created_at']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $images,
        'count' => count($images)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

if (isset($conn)) {
    $conn->close();
}
?> 