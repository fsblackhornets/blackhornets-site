<?php
require_once '../auth.php';
require_once __DIR__ . '/../../../src/config/database.php';
require_once __DIR__ . '/../../../src/helpers/csrf_helper.php';

// Handle toggle status action
if (isset($_GET['action']) && $_GET['action'] === 'toggle' && isset($_GET['id']) && is_numeric($_GET['id'])) {
    csrf_check();
    $toggleId = intval($_GET['id']);
    $stmt = $conn->prepare("UPDATE posts SET status = IF(status='published','draft','published') WHERE id = ?");
    $stmt->bind_param('i', $toggleId);
    $stmt->execute();
    header('Location: add-edit-post.php?msgKey=statusUpdated');
    exit;
}

// Handle delete action
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id']) && is_numeric($_GET['id'])) {
    csrf_check();
    $deleteId = intval($_GET['id']);
    $stmt = $conn->prepare('DELETE FROM posts WHERE id = ?');
    $stmt->bind_param('i', $deleteId);
    $stmt->execute();
    header('Location: add-edit-post.php?msgKey=postDeleted');
    exit;
}

// Edit mode
$editMode = false;
$postData = [
    'id' => '',
    'title_sr' => '',
    'title_en' => '',
    'category' => '',
    'image' => '',
    'content_sr' => '',
    'content_en' => '',
    'author' => '',
    'featured' => 0
];
if (isset($_GET['id']) && is_numeric($_GET['id']) && !isset($_GET['action'])) {
    $editMode = true;
    $id = intval($_GET['id']);
    $stmt = $conn->prepare('SELECT * FROM posts WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
        $postData = $result->fetch_assoc();
        if (isset($postData['title']) && !isset($postData['title_sr'])) {
            $postData['title_sr'] = $postData['title'];
            $postData['title_en'] = $postData['title'];
        }
        if (isset($postData['content']) && !isset($postData['content_sr'])) {
            $postData['content_sr'] = $postData['content'];
            $postData['content_en'] = $postData['content'];
        }
    } else {
        header('Location: add-edit-post.php?msg=Post+not+found');
        exit;
    }
}

// Fetch active team members for author selection
$members = [];
$membersResult = $conn->query("SELECT id, full_name, role, team FROM users WHERE status = 'active' ORDER BY full_name ASC");
if ($membersResult && $membersResult->num_rows > 0) {
    while ($row = $membersResult->fetch_assoc()) {
        $members[] = $row;
    }
}

// Fetch all posts for listing
$allPosts = [];
$postsResult = $conn->query("SELECT id, title_sr, title_en, image, category, author, status, featured, created_at FROM posts ORDER BY created_at DESC");
if ($postsResult && $postsResult->num_rows > 0) {
    while ($row = $postsResult->fetch_assoc()) {
        $allPosts[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/public/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $editMode ? 'Edit Post' : 'Add New Post' ?> - Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../assets/css/dashboard.css">
    <style>
        .posts-page-container {
            background: rgba(30,30,30,0.95);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 0 18px #0005;
            margin-bottom: 24px;
        }
        .posts-page-container h1,
        .posts-page-container h2 {
            color: #FFD700;
            margin: 0 0 20px;
        }

        /* Form */
        .post-form .form-group { margin-bottom: 18px; }
        .post-form label { display: block; margin-bottom: 6px; color: #FFD700; font-weight: 600; font-size: 0.95em; }
        .post-form input[type="text"],
        .post-form select,
        .post-form textarea {
            width: 100%; padding: 10px 12px; border-radius: 8px;
            border: 1px solid #333; background: #1a1a1a; color: #fff;
            font-family: 'Poppins', sans-serif; font-size: 0.95em;
            box-sizing: border-box; transition: border-color 0.2s;
        }
        .post-form input[type="text"]:focus,
        .post-form select:focus,
        .post-form textarea:focus { border-color: #FFD700; outline: none; }
        .post-form textarea { min-height: 140px; resize: vertical; }
        .post-form .file-input-label { cursor: pointer; color: #FFD700; }
        .post-form .image-preview img { max-width: 180px; margin-top: 8px; border-radius: 8px; }

        .form-buttons { display: flex; gap: 12px; margin-top: 20px; }
        .btn-submit {
            padding: 10px 24px; border-radius: 8px; background: #FFD700; color: #222;
            font-weight: 600; border: none; cursor: pointer; font-size: 0.95em;
            display: inline-flex; align-items: center; gap: 8px; transition: background 0.2s;
        }
        .btn-submit:hover { background: #ffe066; }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-cancel {
            padding: 10px 24px; border-radius: 8px; background: #e53935; color: #fff;
            font-weight: 600; border: none; cursor: pointer; font-size: 0.95em;
            display: inline-flex; align-items: center; gap: 8px; transition: background 0.2s;
        }
        .btn-cancel:hover { background: #b71c1c; }
        .checkbox-group { margin-top: 10px; color: #ccc; }

        /* Author multi-select */
        .author-select-box {
            max-height: 200px; overflow-y: auto; background: #1a1a1a;
            border: 1px solid #333; border-radius: 8px; padding: 6px;
        }
        .author-select-box::-webkit-scrollbar { width: 6px; }
        .author-select-box::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
        .author-option {
            display: flex; align-items: center; gap: 10px; padding: 8px 10px;
            border-radius: 6px; cursor: pointer; transition: background 0.15s;
            color: #fff; font-weight: 400; font-size: 0.92em;
        }
        .author-option:hover { background: rgba(255,215,0,0.08); }
        .author-option input[type="checkbox"] { accent-color: #FFD700; width: 16px; height: 16px; cursor: pointer; }
        .author-option .author-name { flex: 1; }
        .author-option .author-role { color: #888; font-size: 0.82em; font-style: italic; }
        .selected-authors { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .author-tag {
            background: rgba(255,215,0,0.15); color: #FFD700; padding: 4px 12px;
            border-radius: 14px; font-size: 0.82em; font-weight: 600;
            display: inline-flex; align-items: center; gap: 4px;
        }

        /* (Language tabs removed - auto-translate handles EN) */

        /* Posts Table */
        .posts-table { width: 100%; border-collapse: collapse; }
        .posts-table th, .posts-table td { padding: 12px 10px; border-bottom: 1px solid #333; text-align: left; color: #fff; font-size: 0.9em; }
        .posts-table th { background: #222; color: #FFD700; font-weight: 600; letter-spacing: 0.5px; }
        .posts-table tr:hover { background: rgba(255,215,0,0.04); }
        .posts-table .actions-cell { display: flex; gap: 6px; flex-wrap: wrap; }

        .btn-edit {
            padding: 6px 14px; border-radius: 6px; background: #FFD700; color: #222;
            font-weight: 600; text-decoration: none; font-size: 0.85em;
            display: inline-flex; align-items: center; gap: 5px; transition: background 0.2s;
        }
        .btn-edit:hover { background: #ffe066; }
        .btn-delete {
            padding: 6px 14px; border-radius: 6px; background: #e53935; color: #fff;
            font-weight: 600; text-decoration: none; font-size: 0.85em;
            display: inline-flex; align-items: center; gap: 5px; transition: background 0.2s;
        }
        .btn-delete:hover { background: #b71c1c; }
        .btn-toggle {
            padding: 6px 14px; border-radius: 6px; font-weight: 600; text-decoration: none;
            font-size: 0.85em; display: inline-flex; align-items: center; gap: 5px; transition: opacity 0.2s;
        }
        .btn-toggle.active { background: #43a047; color: #fff; }
        .btn-toggle.draft { background: #555; color: #ccc; }
        .btn-toggle:hover { opacity: 0.85; }

        .status-badge { padding: 3px 10px; border-radius: 12px; font-size: 0.8em; font-weight: 600; }
        .status-published { background: #1b5e20; color: #a5d6a7; }
        .status-draft { background: #424242; color: #bdbdbd; }
        .featured-star { color: #FFD700; }
        .post-thumb { width: 60px; height: 40px; object-fit: cover; border-radius: 6px; border: 1px solid #333; }
        .post-thumb-placeholder { width: 60px; height: 40px; border-radius: 6px; background: #222; border: 1px solid #333; display: flex; align-items: center; justify-content: center; color: #555; font-size: 0.75em; }
        .no-posts-msg { color: #aaa; padding: 24px 0; text-align: center; font-size: 1.1em; }
        .admin-alert { padding: 14px 18px; border-radius: 8px; margin-bottom: 18px; font-size: 1em; font-weight: 600; }
        .admin-alert.success { background: #1b3d1b; color: #a5d6a7; border: 1px solid #43a047; }

        @media (max-width: 700px) {
            .posts-page-container { padding: 16px 12px; }
            .posts-table th, .posts-table td { padding: 8px 5px; font-size: 0.85em; }
            .posts-table .actions-cell { flex-direction: column; }
            .form-buttons { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <?php include __DIR__ . '/../components/admin_navbar.php'; ?>

        <div class="admin-alert success" id="flashMessage" style="display:none;">
            <i class="fas fa-check-circle"></i> <span id="flashMessageText"></span>
        </div>

        <!-- Existing Posts List -->
        <div class="posts-page-container">
            <h2><i class="fas fa-list"></i> <span data-i18n="allPosts">All Posts</span> (<?= count($allPosts) ?>)</h2>
        <?php if (count($allPosts) === 0): ?>
            <div class="no-posts-msg" data-i18n="noPostsYet">No posts yet. Use the form below to create your first post.</div>
        <?php else: ?>
            <table class="posts-table">
                <thead>
                    <tr>
                        <th data-i18n="image">Image</th>
                        <th data-i18n="title">Title</th>
                        <th data-i18n="category">Category</th>
                        <th data-i18n="status">Status</th>
                        <th data-i18n="date">Date</th>
                        <th data-i18n="actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($allPosts as $post): ?>
                    <tr>
                        <td>
                            <?php if (!empty($post['image'])): ?>
                                <img src="/public<?= htmlspecialchars($post['image']) ?>" class="post-thumb" alt="">
                            <?php else: ?>
                                <div class="post-thumb-placeholder"><i class="fas fa-image"></i></div>
                            <?php endif; ?>
                        </td>
                        <td>
                            <?= htmlspecialchars($post['title_sr'] ?: $post['title_en'] ?: '') ?><?php if (empty($post['title_sr']) && empty($post['title_en'])): ?><span data-i18n="noTitle">(No title)</span><?php endif; ?>
                            <?php if ($post['featured']): ?><i class="fas fa-star featured-star" data-i18n-title="featured" title="Featured"></i><?php endif; ?>
                        </td>
                        <td><?= htmlspecialchars($post['category'] ?: '-') ?></td>
                        <td>
                            <span class="status-badge status-<?= $post['status'] ?>" data-i18n="<?= $post['status'] === 'published' ? 'published' : 'draft' ?>">
                                <?= $post['status'] === 'published' ? 'Published' : 'Draft' ?>
                            </span>
                        </td>
                        <td><?= date('d.m.Y', strtotime($post['created_at'])) ?></td>
                        <td class="actions-cell">
                            <a href="add-edit-post.php?id=<?= $post['id'] ?>" class="btn-edit" title="Edit">
                                <i class="fas fa-edit"></i> <span data-i18n="edit">Edit</span>
                            </a>
                            <a href="add-edit-post.php?action=toggle&id=<?= $post['id'] ?>&csrf_token=<?= htmlspecialchars(csrf_generate_token()) ?>" class="btn-toggle <?= $post['status'] === 'published' ? 'active' : 'draft' ?>" title="<?= $post['status'] === 'published' ? 'Deactivate' : 'Activate' ?>">
                                <i class="fas <?= $post['status'] === 'published' ? 'fa-eye-slash' : 'fa-eye' ?>"></i>
                                <span data-i18n="<?= $post['status'] === 'published' ? 'deactivate' : 'activate' ?>"><?= $post['status'] === 'published' ? 'Deactivate' : 'Activate' ?></span>
                            </a>
                            <a href="add-edit-post.php?action=delete&id=<?= $post['id'] ?>&csrf_token=<?= htmlspecialchars(csrf_generate_token()) ?>" class="btn-delete" onclick="return confirm(getT().confirmDeletePost);" title="Delete">
                                <i class="fas fa-trash"></i> <span data-i18n="delete">Delete</span>
                            </a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
        </div>

        <!-- Add/Edit Post Form -->
        <div class="posts-page-container">
            <h1 data-i18n="<?= $editMode ? 'editPost' : 'addNewPost' ?>"><?= $editMode ? 'Edit Post' : 'Add New Post' ?></h1>
        <form id="addPostForm" class="post-form" enctype="multipart/form-data">
            <?php if ($editMode): ?>
                <input type="hidden" name="id" value="<?= htmlspecialchars($postData['id']) ?>">
            <?php endif; ?>

            <div class="form-group">
                <label for="title_sr" data-i18n="postTitle">Title</label>
                <input type="text" id="title_sr" name="title_sr" required value="<?= htmlspecialchars($postData['title_sr']) ?>">
            </div>
            <div class="form-group">
                <label for="content_sr" data-i18n="postContent">Content</label>
                <textarea id="content_sr" name="content_sr" rows="10" required><?= htmlspecialchars($postData['content_sr']) ?></textarea>
            </div>
            <input type="hidden" name="title_en" value="">
            <input type="hidden" name="content_en" value="">
            <p style="color:#888;font-size:0.85em;margin-bottom:18px;">
                <i class="fas fa-language" style="color:#FFD700;"></i>
                <span data-i18n="autoTranslateNote">English version will be auto-generated from Serbian content.</span>
            </p>

            <!-- Common Fields -->
            <div class="form-group">
                <label for="category" data-i18n="category">Category / Kategorija</label>
                <select id="category" name="category" required>
                    <option value="" data-i18n="selectCategory">Select Category</option>
                    <option value="Technology" <?= $postData['category'] == 'Technology' ? 'selected' : '' ?> data-i18n="catTechnology">Technology / Tehnologija</option>
                    <option value="Events" <?= $postData['category'] == 'Events' ? 'selected' : '' ?> data-i18n="catEvents">Events / Događaji</option>
                    <option value="Competitions" <?= $postData['category'] == 'Competitions' ? 'selected' : '' ?> data-i18n="catCompetitions">Competitions / Takmičenja</option>
                    <option value="Team Updates" <?= $postData['category'] == 'Team Updates' ? 'selected' : '' ?> data-i18n="catTeamUpdates">Team Updates / Vesti Tima</option>
                </select>
            </div>
            <div class="form-group">
                <label for="image" class="file-input-label">
                    <i class="fas fa-upload"></i> <span data-i18n="chooseFeaturedImage">Choose Featured Image (optional)</span>
                </label>
                <input type="file" id="image" name="image" accept="image/*">
                <div id="imagePreview" class="image-preview">
                    <?php if ($editMode && $postData['image']): ?>
                        <img src="../../<?= htmlspecialchars($postData['image']) ?>" alt="Current Image">
                    <?php endif; ?>
                </div>
            </div>
            <div class="form-group">
                <label data-i18n="author">Author</label>
                <input type="hidden" id="author" name="author" value="<?= htmlspecialchars($postData['author']) ?>">
                <div class="author-select-box" id="authorSelectBox">
                    <?php
                    $selectedAuthors = array_map('trim', explode(',', $postData['author'] ?? ''));
                    foreach ($members as $member):
                        $isChecked = in_array($member['full_name'], $selectedAuthors) ? 'checked' : '';
                    ?>
                    <label class="author-option">
                        <input type="checkbox" class="author-checkbox" value="<?= htmlspecialchars($member['full_name']) ?>" <?= $isChecked ?>>
                        <span class="author-name"><?= htmlspecialchars($member['full_name']) ?></span>
                        <span class="author-role"><?= htmlspecialchars(ucfirst(str_replace('_', ' ', $member['role']))) ?></span>
                    </label>
                    <?php endforeach; ?>
                    <?php if (empty($members)): ?>
                    <p style="color:#888;padding:8px;" data-i18n="noMembersFound">No members found.</p>
                    <?php endif; ?>
                </div>
                <div class="selected-authors" id="selectedAuthorsDisplay"></div>
            </div>
            <div class="form-group checkbox-group">
                <label>
                    <input type="hidden" name="featured" value="0">
                    <input type="checkbox" name="featured" id="featured" value="1" <?= $postData['featured'] ? 'checked' : '' ?>>
                    <span data-i18n="markAsFeatured">Mark as Featured Post / Označi kao Istaknuto</span>
                </label>
            </div>
            <div class="form-buttons">
                <button type="submit" class="btn btn-submit">
                    <i class="fas <?= $editMode ? 'fa-save' : 'fa-plus' ?>"></i> <span data-i18n="<?= $editMode ? 'updatePost' : 'addPost' ?>"><?= $editMode ? 'Update Post' : 'Add Post' ?></span>
                </button>
                <button type="button" class="btn btn-cancel" onclick="history.back()">
                    <i class="fas fa-times"></i> <span data-i18n="cancel">Cancel</span>
                </button>
            </div>
        </form>
        </div>
    </div>

    <script>
        // Translation helper
        function getT() {
            const lang = localStorage.getItem('language') || 'en';
            return adminTranslations[lang] || adminTranslations.en;
        }

        // Show translated flash message from URL params
        document.addEventListener('DOMContentLoaded', function() {
            var params = new URLSearchParams(window.location.search);
            var msgKey = params.get('msgKey');
            if (msgKey && getT()[msgKey]) {
                var flashEl = document.getElementById('flashMessage');
                var flashText = document.getElementById('flashMessageText');
                flashText.textContent = getT()[msgKey];
                flashEl.style.display = '';
            }
        });

        // Author multi-select logic
        document.addEventListener('DOMContentLoaded', function() {
            var authorHidden = document.getElementById('author');
            var display = document.getElementById('selectedAuthorsDisplay');
            var checkboxes = document.querySelectorAll('.author-checkbox');

            function updateAuthors() {
                var selected = [];
                checkboxes.forEach(function(cb) {
                    if (cb.checked) selected.push(cb.value);
                });
                authorHidden.value = selected.join(', ');
                display.innerHTML = selected.map(function(name) {
                    return '<span class="author-tag"><i class="fas fa-user"></i> ' + name + '</span>';
                }).join('');
            }

            checkboxes.forEach(function(cb) {
                cb.addEventListener('change', updateAuthors);
            });

            // Initialize on load
            updateAuthors();
        });

        // Form submission handler
        document.addEventListener('DOMContentLoaded', function() {
            var form = document.getElementById('addPostForm');
            if (!form) return;

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + getT().saving;
                }

                var authorVal = document.getElementById('author').value.trim();
                if (!authorVal) {
                    alert(getT().selectAtLeastOneAuthor || 'Please select at least one author.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas <?= $editMode ? "fa-save" : "fa-plus" ?>"></i> ' + (<?= $editMode ? 'true' : 'false' ?> ? getT().updatePost : getT().addPost);
                    }
                    return;
                }

                var formData = new FormData(form);
                var isEdit = !!form.querySelector('input[name="id"]');

                fetch('../../api/posts/create.php', {
                    method: 'POST',
                    body: formData
                })
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    if (data.status === 'success') {
                        window.location.href = 'add-edit-post.php?msgKey=' + (isEdit ? 'postUpdated' : 'postAdded');
                    } else {
                        alert(getT().errorPrefix + ': ' + (data.message || 'Unknown error'));
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = '<i class="fas <?= $editMode ? "fa-save" : "fa-plus" ?>"></i> ' + (<?= $editMode ? 'true' : 'false' ?> ? getT().updatePost : getT().addPost);
                        }
                    }
                })
                .catch(function(error) {
                    alert(getT().serverError + ': ' + error.message);
                    console.error('Form submit error:', error);
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas <?= $editMode ? "fa-save" : "fa-plus" ?>"></i> ' + (<?= $editMode ? 'true' : 'false' ?> ? getT().updatePost : getT().addPost);
                    }
                });
            });
        });
    </script>
</body>
</html> 