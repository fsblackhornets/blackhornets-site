<?php
require_once '../auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../../../src/config/database.php';
require_once __DIR__ . '/../../../src/helpers/csrf_helper.php';

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    if (isset($_GET['id'])) {
        // Validate CSRF token
        csrf_check();

        $sponsor_id = intval($_GET['id']);
        
        // Get sponsor info before deletion
        $stmt = $conn->prepare("SELECT logo FROM sponsors WHERE id = ?");
        $stmt->bind_param("i", $sponsor_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $sponsor = $result->fetch_assoc();
        
        if ($sponsor) {
            // Delete the sponsor
            $delete_stmt = $conn->prepare("DELETE FROM sponsors WHERE id = ?");
            $delete_stmt->bind_param("i", $sponsor_id);
            
            if ($delete_stmt->execute()) {
                // Delete logo file if exists
                if ($sponsor['logo'] && file_exists('../uploads/sponsors/' . basename($sponsor['logo']))) {
                    unlink('../uploads/sponsors/' . basename($sponsor['logo']));
                }
                
                header("Location: manage-sponsors.php?deleted=1");
                exit();
            } else {
                header("Location: manage-sponsors.php?error=delete_failed");
                exit();
            }
        } else {
            header("Location: manage-sponsors.php?error=not_found");
            exit();
        }
    } else {
        header("Location: manage-sponsors.php");
        exit();
    }
    
} catch (Exception $e) {
    header("Location: manage-sponsors.php?error=db_error");
    exit();
}

if (isset($conn)) {
    $conn->close();
}
?> 