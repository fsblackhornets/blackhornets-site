<?php
require_once '../auth.php';
checkAuth('admin');

require_once __DIR__ . '/../../../backend/config/database.php';
require_once __DIR__ . '/../../../backend/utils/SecureFileUpload.php';
require_once __DIR__ . '/../../../backend/utils/Translator.php';
require_once __DIR__ . '/../../../backend/helpers/csrf_helper.php';

// Get user data from session
$user_id = $_SESSION['user_id'] ?? 1;
$user_role = $_SESSION['role'] ?? 'admin';

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Auto-migrate: add description_en column if it doesn't exist
    $col_check = $conn->query("SHOW COLUMNS FROM gallery_images LIKE 'description_en'");
    if ($col_check && $col_check->num_rows === 0) {
        $conn->query("ALTER TABLE gallery_images ADD COLUMN description_en TEXT NULL AFTER description");
    }

    // Handle image upload
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
        csrf_check();

        if ($_POST['action'] === 'add_image') {
            $title = $_POST['title'];
            $description = $_POST['description'];
            $category = $_POST['category'];
            $alt_text = $_POST['alt_text'];
            $sort_order = (int)$_POST['sort_order'];

            // Auto-translate description to English
            $description_en = '';
            if (!empty(trim($_POST['description']))) {
                $translated = Translator::translate(trim($_POST['description']), 'sr', 'en');
                $description_en = ($translated !== false) ? $translated : $description;
            }

            // Handle file upload with security validation
            if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
                $upload_dir = __DIR__ . '/../uploads/gallery/';
                $uploader = new SecureFileUpload($upload_dir, ['image'], 10 * 1024 * 1024); // 10MB max for gallery

                $filename = $uploader->upload($_FILES['image']);

                if ($filename) {
                    $image_path = 'uploads/gallery/' . $filename;

                        $stmt = $conn->prepare("INSERT INTO gallery_images (title, description, description_en, image_path, category, alt_text, sort_order, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                        $stmt->bind_param("ssssssii", $title, $description, $description_en, $image_path, $category, $alt_text, $sort_order, $user_id);

                        if ($stmt->execute()) {
                            $success_message = "Image added successfully!";
                        } else {
                            $error_message = "Error adding image to database.";
                        }
                        $stmt->close();
                } else {
                    $error_message = $uploader->getLastError();
                }
            } else {
                $error_message = "Please select an image file.";
            }
        } elseif ($_POST['action'] === 'delete_image') {
            $image_id = (int)$_POST['image_id'];
            
            // Get image path before deletion
            $stmt = $conn->prepare("SELECT image_path FROM gallery_images WHERE id = ?");
            $stmt->bind_param("i", $image_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $image = $result->fetch_assoc();
            
            if ($image) {
                // Delete file from server
                $file_path = '../' . $image['image_path'];
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
                
                // Delete from database
                $stmt = $conn->prepare("DELETE FROM gallery_images WHERE id = ?");
                $stmt->bind_param("i", $image_id);
                if ($stmt->execute()) {
                    $success_message = "Image deleted successfully!";
                } else {
                    $error_message = "Error deleting image.";
                }
            }
        } elseif ($_POST['action'] === 'edit_image') {
            $image_id = (int)$_POST['image_id'];
            $title = $_POST['title'];
            $description = $_POST['description'];
            $category = $_POST['category'];
            $alt_text = $_POST['alt_text'];
            $sort_order = (int)$_POST['sort_order'];

            // Auto-translate description to English
            $description_en = '';
            if (!empty(trim($_POST['description']))) {
                $translated = Translator::translate(trim($_POST['description']), 'sr', 'en');
                $description_en = ($translated !== false) ? $translated : $description;
            }

            // Check if a new image was uploaded
            if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
                $upload_dir = __DIR__ . '/../uploads/gallery/';
                $uploader = new SecureFileUpload($upload_dir, ['image'], 10 * 1024 * 1024);
                $filename = $uploader->upload($_FILES['image']);

                if ($filename) {
                    // Delete old file
                    $old = $conn->prepare("SELECT image_path FROM gallery_images WHERE id = ?");
                    $old->bind_param("i", $image_id);
                    $old->execute();
                    $old_row = $old->get_result()->fetch_assoc();
                    if ($old_row) {
                        $old_file = '../' . $old_row['image_path'];
                        if (file_exists($old_file)) unlink($old_file);
                    }
                    $old->close();

                    $image_path = 'uploads/gallery/' . $filename;
                    $stmt = $conn->prepare("UPDATE gallery_images SET title=?, description=?, description_en=?, image_path=?, category=?, alt_text=?, sort_order=? WHERE id=?");
                    $stmt->bind_param("ssssssii", $title, $description, $description_en, $image_path, $category, $alt_text, $sort_order, $image_id);
                } else {
                    $error_message = $uploader->getLastError();
                    $stmt = null;
                }
            } else {
                $stmt = $conn->prepare("UPDATE gallery_images SET title=?, description=?, description_en=?, category=?, alt_text=?, sort_order=? WHERE id=?");
                $stmt->bind_param("sssssii", $title, $description, $description_en, $category, $alt_text, $sort_order, $image_id);
            }

            if (isset($stmt) && $stmt) {
                if ($stmt->execute()) {
                    $success_message = "Image updated successfully!";
                } else {
                    $error_message = "Error updating image.";
                }
                $stmt->close();
            }
        } elseif ($_POST['action'] === 'toggle_status') {
            $image_id = (int)$_POST['image_id'];
            $new_status = $_POST['status'] === '1' ? 0 : 1;
            
            $stmt = $conn->prepare("UPDATE gallery_images SET is_active = ? WHERE id = ?");
            $stmt->bind_param("ii", $new_status, $image_id);
            if ($stmt->execute()) {
                $success_message = "Image status updated successfully!";
            } else {
                $error_message = "Error updating image status.";
            }
        }
    }

    // Get all images
    $images_result = $conn->query("SELECT * FROM gallery_images ORDER BY category, sort_order, created_at DESC");

} catch (Exception $e) {
    error_log("Gallery error: " . $e->getMessage());
    $error_message = "An error occurred. Please try again.";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/frontend/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Gallery - Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../assets/css/dashboard.css">
    <style>
        *, *::before, *::after {
            box-sizing: border-box;
        }

        .gallery-container {
            padding: 20px;
        }
        
        .add-image-form {
            background: rgba(30,30,30,0.95);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 30px;
            box-shadow: 0 0 18px #0005;
        }
        
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #FFD700;
            font-weight: 600;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #333;
            border-radius: 8px;
            background: #1a1a1a;
            color: #fff;
            font-size: 14px;
        }
        
        .form-group textarea {
            height: 80px;
            resize: vertical;
        }
        
        .btn-submit {
            background: #FFD700;
            color: #222;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .btn-submit:hover {
            background: #ffe066;
        }
        
        .images-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .image-card {
            background: rgba(30,30,30,0.95);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .image-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(255,215,0,0.15);
        }
        
        .image-preview {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        
        .image-info {
            padding: 15px;
        }
        
        .image-title {
            font-weight: 600;
            color: #FFD700;
            margin-bottom: 5px;
        }
        
        .image-category {
            color: #bbb;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .image-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        
        .btn-edit,
        .btn-delete,
        .btn-toggle {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .btn-edit {
            background: #FFD700;
            color: #222;
        }
        
        .btn-delete {
            background: #e53935;
            color: #fff;
        }
        
        .btn-toggle {
            background: #4CAF50;
            color: #fff;
        }
        
        .btn-toggle.inactive {
            background: #666;
        }
        
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .status-active {
            background: #4CAF50;
            color: #fff;
        }
        
        .status-inactive {
            background: #666;
            color: #fff;
        }
        
        .alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .alert-success {
            background: #4CAF50;
            color: #fff;
        }
        
        .alert-error {
            background: #e53935;
            color: #fff;
        }
        
        .btn-edit:hover {
            background: #ffe066;
        }

        /* Edit Modal */
        .edit-modal {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(6px);
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .edit-modal-content {
            background: #1e1e1e;
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 16px;
            width: 100%;
            max-width: 650px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .edit-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid #333;
        }

        .edit-modal-header h3 {
            color: #FFD700;
            margin: 0;
            font-size: 1.2rem;
        }

        .edit-modal-close {
            background: none;
            border: none;
            color: #999;
            font-size: 1.8rem;
            cursor: pointer;
            line-height: 1;
            transition: color 0.2s;
        }

        .edit-modal-close:hover {
            color: #FFD700;
        }

        .edit-modal-body {
            padding: 24px;
        }

        .edit-preview {
            text-align: center;
            margin-bottom: 20px;
        }

        .edit-preview img {
            max-width: 100%;
            max-height: 200px;
            object-fit: cover;
            border-radius: 10px;
            border: 2px solid #333;
        }

        .edit-modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding: 16px 24px;
            border-top: 1px solid #333;
        }

        .btn-cancel {
            background: transparent;
            color: #999;
            border: 1px solid #555;
            border-radius: 8px;
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-cancel:hover {
            color: #fff;
            border-color: #999;
        }

        .edit-modal-content::-webkit-scrollbar {
            width: 6px;
        }

        .edit-modal-content::-webkit-scrollbar-thumb {
            background: rgba(255, 215, 0, 0.3);
            border-radius: 3px;
        }

        @media (max-width: 768px) {
            .form-grid {
                grid-template-columns: 1fr;
            }

            .images-grid {
                grid-template-columns: 1fr;
            }

            .edit-modal-content {
                max-height: 95vh;
            }

            .edit-modal-footer {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <?php include __DIR__ . '/../components/admin_navbar.php'; ?>

        <div class="gallery-container">
            <?php if (isset($success_message)): ?>
                <div class="alert alert-success"><?php echo $success_message; ?></div>
            <?php endif; ?>
            
            <?php if (isset($error_message)): ?>
                <div class="alert alert-error"><?php echo $error_message; ?></div>
            <?php endif; ?>

            <!-- Add Image Form -->
            <div class="add-image-form">
                <h2><i class="fas fa-plus"></i> <span data-i18n="addNewImage">Add New Image</span></h2>
                <form method="POST" enctype="multipart/form-data">
                    <?= csrf_token_field() ?>
                    <input type="hidden" name="action" value="add_image">
                    
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="title" data-i18n="imageTitle">Image Title</label>
                            <input type="text" id="title" name="title" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="category" data-i18n="category">Category</label>
                            <select id="category" name="category" required>
                                <option value="" data-i18n="selectCategory">Select Category</option>
                                <option value="race_cars" data-i18n="categoryRaceCars">Race Cars</option>
                                <option value="team" data-i18n="categoryTeam">Team</option>
                                <option value="events" data-i18n="categoryEventsComp">Events & Competitions</option>
                                <option value="workshop" data-i18n="categoryWorkshop">Workshop</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="alt_text" data-i18n="altText">Alt Text</label>
                            <input type="text" id="alt_text" name="alt_text" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="sort_order" data-i18n="sortOrder">Sort Order</label>
                            <input type="number" id="sort_order" name="sort_order" value="0" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label for="image" data-i18n="imageFile">Image File</label>
                            <input type="file" id="image" name="image" accept="image/*" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="description" data-i18n="descriptionSr">Description (Serbian)</label>
                        <textarea id="description" name="description" placeholder="Opis slike na srpskom jeziku"></textarea>
                        <small style="color:#999; font-style:italic;" data-i18n="autoTranslateNote">English version will be auto-generated from Serbian content.</small>
                    </div>
                    
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-upload"></i> <span data-i18n="uploadImage">Upload Image</span>
                    </button>
                </form>
            </div>

            <!-- Images Grid -->
            <h2><i class="fas fa-images"></i> <span data-i18n="galleryImages">Gallery Images</span></h2>
            <div class="images-grid">
                <?php if ($images_result && $images_result->num_rows > 0): ?>
                    <?php while ($image = $images_result->fetch_assoc()): ?>
                        <div class="image-card">
                            <img src="../<?php echo htmlspecialchars($image['image_path']); ?>" 
                                 alt="<?php echo htmlspecialchars($image['alt_text']); ?>" 
                                 class="image-preview">
                            
                            <div class="image-info">
                                <div class="image-title"><?php echo htmlspecialchars($image['title']); ?></div>
                                <div class="image-category">
                                    <span class="status-badge <?php echo $image['is_active'] ? 'status-active' : 'status-inactive'; ?>" data-i18n="<?php echo $image['is_active'] ? 'active' : 'inactive'; ?>">
                                        <?php echo $image['is_active'] ? 'Active' : 'Inactive'; ?>
                                    </span>
                                    • <?php echo ucfirst(str_replace('_', ' ', $image['category'])); ?>
                                </div>
                                
                                <?php if ($image['description']): ?>
                                    <p style="color: #ccc; font-size: 14px; margin: 10px 0;">
                                        <?php echo htmlspecialchars($image['description']); ?>
                                    </p>
                                <?php endif; ?>
                                
                                <div class="image-actions">
                                    <button type="button" class="btn-edit" onclick="openEditModal(<?php echo htmlspecialchars(json_encode($image)); ?>)">
                                        <i class="fas fa-edit"></i> <span data-i18n="edit">Edit</span>
                                    </button>

                                    <form method="POST" style="display: inline;">
                                        <?= csrf_token_field() ?>
                                        <input type="hidden" name="action" value="toggle_status">
                                        <input type="hidden" name="image_id" value="<?php echo $image['id']; ?>">
                                        <input type="hidden" name="status" value="<?php echo $image['is_active']; ?>">
                                        <button type="submit" class="btn-toggle <?php echo $image['is_active'] ? '' : 'inactive'; ?>" data-i18n="<?php echo $image['is_active'] ? 'deactivate' : 'activate'; ?>">
                                            <?php echo $image['is_active'] ? 'Deactivate' : 'Activate'; ?>
                                        </button>
                                    </form>

                                    <form method="POST" style="display: inline;" onsubmit="return confirm(getT().confirmDeleteImage);">
                                        <?= csrf_token_field() ?>
                                        <input type="hidden" name="action" value="delete_image">
                                        <input type="hidden" name="image_id" value="<?php echo $image['id']; ?>">
                                        <button type="submit" class="btn-delete">
                                            <i class="fas fa-trash"></i> <span data-i18n="delete">Delete</span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    <?php endwhile; ?>
                <?php else: ?>
                    <div style="text-align: center; color: #aaa; padding: 40px;">
                        <i class="fas fa-images" style="font-size: 48px; margin-bottom: 20px;"></i>
                        <p data-i18n="noImagesFound">No images found. Add your first image above!</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Edit Modal -->
    <div id="editModal" class="edit-modal">
        <div class="edit-modal-content">
            <div class="edit-modal-header">
                <h3><i class="fas fa-edit"></i> <span data-i18n="editImage">Edit Image</span></h3>
                <button class="edit-modal-close" onclick="closeEditModal()">&times;</button>
            </div>
            <form method="POST" enctype="multipart/form-data">
                <?= csrf_token_field() ?>
                <input type="hidden" name="action" value="edit_image">
                <input type="hidden" name="image_id" id="edit_image_id">

                <div class="edit-modal-body">
                    <div class="edit-preview">
                        <img id="edit_preview_img" src="" alt="Preview">
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="edit_title" data-i18n="title">Title</label>
                            <input type="text" id="edit_title" name="title" required>
                        </div>

                        <div class="form-group">
                            <label for="edit_category" data-i18n="category">Category</label>
                            <select id="edit_category" name="category" required>
                                <option value="race_cars" data-i18n="categoryRaceCars">Race Cars</option>
                                <option value="team" data-i18n="categoryTeam">Team</option>
                                <option value="events" data-i18n="categoryEventsComp">Events & Competitions</option>
                                <option value="workshop" data-i18n="categoryWorkshop">Workshop</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="edit_alt_text" data-i18n="altText">Alt Text</label>
                            <input type="text" id="edit_alt_text" name="alt_text" required>
                        </div>

                        <div class="form-group">
                            <label for="edit_sort_order" data-i18n="sortOrder">Sort Order</label>
                            <input type="number" id="edit_sort_order" name="sort_order" min="0">
                        </div>

                        <div class="form-group">
                            <label for="edit_image_file" data-i18n="replaceImage">Replace Image (optional)</label>
                            <input type="file" id="edit_image_file" name="image" accept="image/*">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="edit_description" data-i18n="descriptionSr">Description (Serbian)</label>
                        <textarea id="edit_description" name="description"></textarea>
                        <small style="color:#999; font-style:italic;" data-i18n="autoTranslateNote">English version will be auto-generated from Serbian content.</small>
                    </div>
                </div>

                <div class="edit-modal-footer">
                    <button type="button" class="btn-cancel" onclick="closeEditModal()" data-i18n="cancel">Cancel</button>
                    <button type="submit" class="btn-submit"><i class="fas fa-save"></i> <span data-i18n="saveChanges">Save Changes</span></button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function getT() {
            const lang = localStorage.getItem('language') || 'en';
            return adminTranslations[lang] || adminTranslations.en;
        }

        // Preview image before upload
        document.getElementById('image').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                console.log('Image selected:', file.name);
            }
        });

        function openEditModal(image) {
            document.getElementById('edit_image_id').value = image.id;
            document.getElementById('edit_title').value = image.title || '';
            document.getElementById('edit_description').value = image.description || '';
            document.getElementById('edit_category').value = image.category || '';
            document.getElementById('edit_alt_text').value = image.alt_text || '';
            document.getElementById('edit_sort_order').value = image.sort_order || 0;
            document.getElementById('edit_preview_img').src = '../' + image.image_path;
            document.getElementById('edit_image_file').value = '';
            document.getElementById('editModal').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function closeEditModal() {
            document.getElementById('editModal').style.display = 'none';
            document.body.style.overflow = '';
        }

        // Close on backdrop click
        document.getElementById('editModal').addEventListener('click', function(e) {
            if (e.target === this) closeEditModal();
        });

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeEditModal();
        });

        // Preview replacement image
        document.getElementById('edit_image_file').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    document.getElementById('edit_preview_img').src = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    </script>
</body>
</html>

<?php
if (isset($conn)) {
    $conn->close();
}
?> 