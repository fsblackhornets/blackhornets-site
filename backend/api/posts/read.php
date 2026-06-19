<?php
header('Content-Type: application/json');
require_once '../../config/database.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $conn->prepare("SELECT * FROM posts WHERE id = ? LIMIT 1");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
        $post = $result->fetch_assoc();
        echo json_encode(['status' => 'success', 'data' => $post]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Post not found']);
    }
    $stmt->close();
    exit;
}

$sql = "SELECT * FROM posts ORDER BY created_at DESC";
$result = $conn->query($sql);

$posts = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
}
echo json_encode(['status' => 'success', 'data' => $posts]);
?>
