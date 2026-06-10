<?php
require_once '../auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../../../src/config/database.php';

// جلب جميع الأخبار
$stmt = $conn->query("SELECT * FROM posts ORDER BY created_at DESC");
$posts = [];
while ($row = $stmt->fetch_assoc()) {
    $posts[] = $row;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/public/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage News - Admin</title>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <link rel="stylesheet" href="../../assets/css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .admin-container {
            max-width: 1100px;
            margin: 40px auto;
            background: rgba(30,30,30,0.95);
            border-radius: 16px;
            padding: 32px 24px;
            box-shadow: 0 0 30px #0008;
        }
        .admin-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            background: #181818;
            color: #fff;
        }
        .admin-table th, .admin-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #333;
            text-align: left;
        }
        .admin-table th {
            background: #222;
            font-weight: 600;
            letter-spacing: 1px;
        }
        .admin-table tr:last-child td {
            border-bottom: none;
        }
        .btn {
            display: inline-block;
            padding: 7px 18px;
            border-radius: 6px;
            background: #FFD700;
            color: #222;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.2s;
            border: none;
            cursor: pointer;
        }
        .btn-primary { background: #FFD700; color: #222; }
        .btn-warning { background: #ff9800; color: #fff; }
        .btn-danger { background: #e53935; color: #fff; }
        .btn-sm { padding: 5px 12px; font-size: 0.95em; }
        .btn:hover { opacity: 0.85; }
        .actions { display: flex; gap: 8px; }
        .no-posts {
            text-align: center;
            color: #aaa;
            padding: 32px 0;
            font-size: 1.2em;
        }
        
        .admin-alert {
            padding: 14px 18px;
            border-radius: 8px;
            margin-bottom: 18px;
            font-size: 1.08em;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .admin-alert.success {
            background: #e6f9e6;
            color: #1b5e20;
            border: 1px solid #43a047;
        }
        .admin-alert.error {
            background: #ffeaea;
            color: #b71c1c;
            border: 1px solid #e53935;
        }
        .admin-alert i {
            font-size: 1.3em;
        }
        @media (max-width: 700px) {
            .admin-container { padding: 10px; }
            .admin-table th, .admin-table td { padding: 7px 4px; font-size: 0.95em; }
        }
    </style>
</head>
<body>
    <?php include __DIR__ . '/../components/admin_navbar.php'; ?>
 <div class="admin-container">
        <h1 style="margin-bottom: 18px;">Manage News</h1>
        <?php if (isset($_GET['msg']) && $_GET['msg']): ?>
            <?php $isSuccess = (stripos($_GET['msg'], 'success') !== false); ?>
            <div class="admin-alert <?= $isSuccess ? 'success' : 'error' ?>">
                <i class="fas <?= $isSuccess ? 'fa-check-circle' : 'fa-exclamation-triangle' ?>"></i>
                <?= htmlspecialchars(str_replace('+', ' ', $_GET['msg'])) ?>
            </div>
        <?php endif; ?>
        <a href="add-edit-post.php" class="btn btn-primary" style="margin-bottom: 18px;">
            <i class="fas fa-plus"></i> Add New Post
        </a>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (count($posts) === 0): ?>
                    <tr>
                        <td colspan="6" class="no-posts">No news posts found.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($posts as $post): ?>
                    <tr>
                        <td><?= htmlspecialchars($post['id']) ?></td>
                        <td><?= htmlspecialchars($post['title_sr'] ?? $post['title']) ?></td>
                        <td><?= htmlspecialchars($post['category']) ?></td>
                        <td><?= htmlspecialchars($post['author']) ?></td>
                        <td><?= htmlspecialchars($post['created_at']) ?></td>
                        <td class="actions">
                            <a href="add-edit-post.php?id=<?= $post['id'] ?>" class="btn btn-sm btn-warning"><i class="fas fa-edit"></i> Edit</a>
                            <a href="delete-post.php?id=<?= $post['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this post?');"><i class="fas fa-trash"></i> Delete</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <footer></footer>
</body>
</html> 