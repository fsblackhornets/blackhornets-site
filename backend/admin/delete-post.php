<?php
require_once __DIR__ . '/../../panel/admin/auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../config/database.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('Location: /panel/admin/pages/posts.php?msg=Invalid+post+ID');
    exit;
}

$id   = intval($_GET['id']);
$stmt = $conn->prepare('DELETE FROM posts WHERE id = ?');
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    header('Location: /panel/admin/pages/posts.php?msg=Post+deleted+successfully');
    exit;
} else {
    header('Location: /panel/admin/pages/posts.php?msg=Error+deleting+post');
    exit;
}
