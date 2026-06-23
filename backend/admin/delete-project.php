<?php
require_once __DIR__ . '/../../panel/admin/auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/csrf_helper.php';

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    if (isset($_GET['id'])) {
        csrf_check();

        $project_id = intval($_GET['id']);

        $stmt = $conn->prepare("SELECT image FROM projects WHERE id = ?");
        $stmt->bind_param("i", $project_id);
        $stmt->execute();
        $project = $stmt->get_result()->fetch_assoc();

        if ($project) {
            $delete_stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
            $delete_stmt->bind_param("i", $project_id);

            if ($delete_stmt->execute()) {
                $imgPath = __DIR__ . '/../../frontend/uploads/projects/' . basename($project['image'] ?? '');
                if (!empty($project['image']) && file_exists($imgPath)) {
                    unlink($imgPath);
                }
                header("Location: /panel/admin/pages/manage-projects.php?deleted=1");
                exit();
            } else {
                header("Location: /panel/admin/pages/manage-projects.php?error=delete_failed");
                exit();
            }
        } else {
            header("Location: /panel/admin/pages/manage-projects.php?error=not_found");
            exit();
        }
    } else {
        header("Location: /panel/admin/pages/manage-projects.php");
        exit();
    }

} catch (Exception $e) {
    header("Location: /panel/admin/pages/manage-projects.php?error=db_error");
    exit();
}

if (isset($conn)) {
    $conn->close();
}
