<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Include database connection
require_once '../../../src/config/database.php';

// Connection is already established in database.php as $conn
try {
    // Get all sponsors ordered by tier_order and creation date
    $query = "SELECT id, name, description, description_en, tier, website, logo, tier_order, created_at FROM sponsors ORDER BY tier_order ASC, created_at DESC";
    $result = $conn->query($query);
    
    $sponsors = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Add full URL to logo if exists
            if ($row['logo']) {
                $row['logo_url'] = 'admin/uploads/sponsors/' . $row['logo'];
            } else {
                $row['logo_url'] = null;
            }
            
            $sponsors[] = $row;
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $sponsors,
        'count' => count($sponsors)
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