<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../config/database.php';

try {
    // Accept language parameter (default: sr)
    $lang = isset($_GET['lang']) && $_GET['lang'] === 'en' ? 'en' : 'sr';
    $setting_key = 'brochure_pdf_' . $lang;

    // Try language-specific key first, fall back to old key for migration
    $stmt = $conn->prepare("SELECT setting_value, updated_at FROM site_settings WHERE setting_key = ?");
    $stmt->bind_param("s", $setting_key);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    // Fallback: if requesting SR and no lang-specific key, try old 'brochure_pdf' key
    if (!$row && $lang === 'sr') {
        $stmt2 = $conn->prepare("SELECT setting_value, updated_at FROM site_settings WHERE setting_key = 'brochure_pdf'");
        $stmt2->execute();
        $row = $stmt2->get_result()->fetch_assoc();
    }

    if ($row) {
        echo json_encode([
            'success' => true,
            'data' => [
                'pdf_url' => 'admin/' . $row['setting_value'],
                'updated_at' => $row['updated_at']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'data' => null,
            'message' => 'No brochure uploaded yet'
        ]);
    }
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
