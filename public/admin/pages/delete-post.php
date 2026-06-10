<?php
require_once '../auth.php';
require_once __DIR__ . '/../../../src/config/database.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('Location: add-edit-post.php?msg=Invalid+post+ID');
    exit;
}

$id = intval($_GET['id']);
$stmt = $conn->prepare('DELETE FROM posts WHERE id = ?');
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    header('Location: add-edit-post.php?msg=Post+deleted+successfully');
    exit;
} else {
    header('Location: add-edit-post.php?msg=Error+deleting+post');
    exit;
}
?> 