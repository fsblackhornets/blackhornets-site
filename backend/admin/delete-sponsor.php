<?php
require_once __DIR__ . '/../../frontend/admin/auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/csrf_helper.php';

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    if (isset($_GET['id'])) {
        csrf_check();

        $sponsor_id = intval($_GET['id']);

        $stmt = $conn->prepare("SELECT logo FROM sponsors WHERE id = ?");
        $stmt->bind_param("i", $sponsor_id);
        $stmt->execute();
        $sponsor = $stmt->get_result()->fetch_assoc();

        if ($sponsor) {
            $delete_stmt = $conn->prepare("DELETE FROM sponsors WHERE id = ?");
            $delete_stmt->bind_param("i", $sponsor_id);

            if ($delete_stmt->execute()) {
                $logoPath = __DIR__ . '/../../frontend/uploads/sponsors/' . basename($sponsor['logo'] ?? '');
                if (!empty($sponsor['logo']) && file_exists($logoPath)) {
                    unlink($logoPath);
                }
                header("Location: /frontend/admin/pages/manage-sponsors.php?deleted=1");
                exit();
            } else {
                header("Location: /frontend/admin/pages/manage-sponsors.php?error=delete_failed");
                exit();
            }
        } else {
            header("Location: /frontend/admin/pages/manage-sponsors.php?error=not_found");
            exit();
        }
    } else {
        header("Location: /frontend/admin/pages/manage-sponsors.php");
        exit();
    }

} catch (Exception $e) {
    header("Location: /frontend/admin/pages/manage-sponsors.php?error=db_error");
    exit();
}

if (isset($conn)) {
    $conn->close();
}
