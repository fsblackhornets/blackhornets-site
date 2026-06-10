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

        $project_id = intval($_GET['id']);
        
        // Get project info before deletion
        $stmt = $conn->prepare("SELECT image FROM projects WHERE id = ?");
        $stmt->bind_param("i", $project_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $project = $result->fetch_assoc();
        
        if ($project) {
            // Delete the project
            $delete_stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
            $delete_stmt->bind_param("i", $project_id);
            
            if ($delete_stmt->execute()) {
                // Delete image file if exists
                if ($project['image'] && file_exists('../uploads/projects/' . basename($project['image']))) {
                    unlink('../uploads/projects/' . basename($project['image']));
                }
                
                header("Location: manage-projects.php?deleted=1");
                exit();
            } else {
                header("Location: manage-projects.php?error=delete_failed");
                exit();
            }
        } else {
            header("Location: manage-projects.php?error=not_found");
            exit();
        }
    } else {
        header("Location: manage-projects.php");
        exit();
    }
    
} catch (Exception $e) {
    header("Location: manage-projects.php?error=db_error");
    exit();
}

if (isset($conn)) {
    $conn->close();
}
?> 