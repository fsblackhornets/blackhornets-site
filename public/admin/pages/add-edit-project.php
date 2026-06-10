<?php
require_once '../auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../../../src/config/database.php';
require_once __DIR__ . '/../../../src/utils/SecureFileUpload.php';
require_once __DIR__ . '/../../../src/helpers/csrf_helper.php';

$project = null;
$is_edit = false;

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Check if editing existing project
    if (isset($_GET['id'])) {
        $is_edit = true;
        $project_id = intval($_GET['id']);
        $stmt = $conn->prepare("SELECT * FROM projects WHERE id = ?");
        $stmt->bind_param("i", $project_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $project = $result->fetch_assoc();
        
        if (!$project) {
            header("Location: manage-projects.php");
            exit();
        }
    }

    // Handle form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        csrf_check();
        $name = trim($_POST['name']);
        $description = trim($_POST['description']);
        $status = $_POST['status'];
        $due_date = $_POST['due_date'];
        $duration = trim($_POST['duration']);
        $progress = intval($_POST['progress']);
        
        // Validate required fields
        if (empty($name) || empty($description) || empty($status) || empty($due_date) || empty($duration)) {
            $error_message = "Please fill in all required fields.";
        } elseif ($progress < 0 || $progress > 100) {
            $error_message = "Progress must be between 0 and 100.";
        } else {
            $image = '';
            
            // Handle file upload with security validation
            if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
                $upload_dir = __DIR__ . '/../uploads/projects/';
                $uploader = new SecureFileUpload($upload_dir, ['image'], 5 * 1024 * 1024); // 5MB max
                
                $image = $uploader->upload($_FILES['image'], 'project_' . time());
                
                if (!$image) {
                    $error_message = $uploader->getLastError();
                }
            } elseif ($is_edit && !isset($_FILES['image'])) {
                // Keep existing image if no new file uploaded
                $image = $project['image'];
            }
            
            if (!isset($error_message)) {
                if ($is_edit) {
                    // Update existing project
                    if ($image) {
                        $stmt = $conn->prepare("UPDATE projects SET name = ?, description = ?, status = ?, due_date = ?, duration = ?, progress = ?, image = ? WHERE id = ?");
                        $stmt->bind_param("ssssssis", $name, $description, $status, $due_date, $duration, $progress, $image, $project_id);
                    } else {
                        $stmt = $conn->prepare("UPDATE projects SET name = ?, description = ?, status = ?, due_date = ?, duration = ?, progress = ? WHERE id = ?");
                        $stmt->bind_param("ssssssi", $name, $description, $status, $due_date, $duration, $progress, $project_id);
                    }
                } else {
                    // Insert new project
                    $stmt = $conn->prepare("INSERT INTO projects (name, description, status, due_date, duration, progress, image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
                    $stmt->bind_param("sssssss", $name, $description, $status, $due_date, $duration, $progress, $image);
                }
                
                if ($stmt->execute()) {
                    header("Location: manage-projects.php?success=1");
                    exit();
                } else {
                    $error_message = "Database error: " . $stmt->error;
                }
            }
        }
    }
    
} catch (Exception $e) {
    $error_message = $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/public/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $is_edit ? 'Edit' : 'Add' ?> Project - Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../assets/css/dashboard.css">
    <style>
        .form-container {
            background: rgba(30,30,30,0.95);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 0 18px #0005;
            margin-bottom: 40px;
        }
        
        .form-header {
            margin-bottom: 24px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            color: #FFD700;
            font-weight: 600;
        }
        
        .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #333;
            border-radius: 8px;
            background: #181818;
            color: #fff;
            font-size: 1em;
            transition: border-color 0.2s;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #FFD700;
        }
        
        .form-textarea {
            min-height: 120px;
            resize: vertical;
        }
        
        .form-select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #333;
            border-radius: 8px;
            background: #181818;
            color: #fff;
            font-size: 1em;
            transition: border-color 0.2s;
        }
        
        .form-select:focus {
            outline: none;
            border-color: #FFD700;
        }
        
        .file-input-container {
            position: relative;
            display: inline-block;
            width: 100%;
        }
        
        .file-input {
            position: absolute;
            opacity: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
        
        .file-input-label {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px 16px;
            border: 2px dashed #333;
            border-radius: 8px;
            background: #181818;
            color: #bbb;
            font-size: 1em;
            cursor: pointer;
            transition: border-color 0.2s;
        }
        
        .file-input-label:hover {
            border-color: #FFD700;
            color: #FFD700;
        }
        
        .current-image {
            margin-top: 12px;
            padding: 12px;
            background: #222;
            border-radius: 8px;
            text-align: center;
        }
        
        .current-image img {
            max-width: 200px;
            max-height: 150px;
            border-radius: 4px;
        }
        
        .form-actions {
            display: flex;
            gap: 16px;
            margin-top: 24px;
        }
        
        .btn-submit {
            background: #FFD700;
            color: #222;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 1em;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .btn-submit:hover {
            background: #ffe066;
        }
        
        .btn-cancel {
            background: #666;
            color: #fff;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 1em;
            text-decoration: none;
            display: flex;
            align-items: center;
            transition: background 0.2s;
        }
        
        .btn-cancel:hover {
            background: #888;
        }
        
        .error-message {
            background: #e53935;
            color: #fff;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .progress-slider {
            width: 100%;
            height: 8px;
            border-radius: 4px;
            background: #333;
            outline: none;
            -webkit-appearance: none;
        }
        
        .progress-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #FFD700;
            cursor: pointer;
        }
        
        .progress-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #FFD700;
            cursor: pointer;
            border: none;
        }
        
        .progress-value {
            color: #FFD700;
            font-weight: 600;
            margin-top: 8px;
        }
        
        @media (max-width: 768px) {
            .form-actions {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <?php include __DIR__ . '/../components/admin_navbar.php'; ?>

        <div class="form-container">
            <div class="form-header">
                <h2><?= $is_edit ? 'Edit Project' : 'Add New Project' ?></h2>
            </div>

            <?php if (isset($error_message)): ?>
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <?= htmlspecialchars($error_message) ?>
                </div>
            <?php endif; ?>

            <form method="POST" enctype="multipart/form-data">
                <?= csrf_token_field() ?>
                <div class="form-group">
                    <label class="form-label">Project Name *</label>
                    <input type="text" name="name" class="form-input" 
                           value="<?= $is_edit ? htmlspecialchars($project['name']) : '' ?>" 
                           required>
                </div>

                <div class="form-group">
                    <label class="form-label">Description *</label>
                    <textarea name="description" class="form-input form-textarea" required><?= $is_edit ? htmlspecialchars($project['description']) : '' ?></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Status *</label>
                    <select name="status" class="form-select" required>
                        <option value="">Select Status</option>
                        <option value="Active" <?= ($is_edit && $project['status'] === 'Active') ? 'selected' : '' ?>>Active</option>
                        <option value="Pending" <?= ($is_edit && $project['status'] === 'Pending') ? 'selected' : '' ?>>Pending</option>
                        <option value="Completed" <?= ($is_edit && $project['status'] === 'Completed') ? 'selected' : '' ?>>Completed</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Due Date *</label>
                    <input type="date" name="due_date" class="form-input" 
                           value="<?= $is_edit ? $project['due_date'] : '' ?>" 
                           required>
                </div>

                <div class="form-group">
                    <label class="form-label">Duration *</label>
                    <input type="text" name="duration" class="form-input" 
                           value="<?= $is_edit ? htmlspecialchars($project['duration']) : '' ?>" 
                           placeholder="e.g., 6 months, 1 year" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Progress (%)</label>
                    <input type="range" name="progress" class="progress-slider" 
                           min="0" max="100" 
                           value="<?= $is_edit ? $project['progress'] : '0' ?>" 
                           oninput="updateProgress(this.value)">
                    <div class="progress-value" id="progressValue"><?= $is_edit ? $project['progress'] : '0' ?>%</div>
                </div>

                <div class="form-group">
                    <label class="form-label">Project Image <?= $is_edit ? '(Leave empty to keep current)' : '' ?></label>
                    <div class="file-input-container">
                        <input type="file" name="image" class="file-input" 
                               accept="image/*" <?= $is_edit ? '' : '' ?>>
                        <label class="file-input-label">
                            <i class="fas fa-upload"></i>
                            Choose Project Image
                        </label>
                    </div>
                    
                    <?php if ($is_edit && $project['image']): ?>
                        <div class="current-image">
                            <p>Current Image:</p>
                            <img src="../uploads/projects/<?= htmlspecialchars($project['image']) ?>" 
                                 alt="Current project image">
                        </div>
                    <?php endif; ?>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-save"></i>
                        <?= $is_edit ? 'Update Project' : 'Add Project' ?>
                    </button>
                    <a href="manage-projects.php" class="btn-cancel">
                        <i class="fas fa-times"></i>
                        Cancel
                    </a>
                </div>
            </form>
        </div>
    </div>

    <div class="loading-overlay">
        <div class="loading-spinner"></div>
    </div>

    <script>
        // File input preview
        document.querySelector('.file-input').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const label = document.querySelector('.file-input-label');
                label.innerHTML = `<i class="fas fa-check"></i> ${file.name}`;
                label.style.borderColor = '#FFD700';
                label.style.color = '#FFD700';
            }
        });

        // Progress slider
        function updateProgress(value) {
            document.getElementById('progressValue').textContent = value + '%';
        }

        window.addEventListener('load', function() {
            document.querySelector('.loading-overlay').style.display = 'none';
        });
    </script>
</body>
</html>

<?php
if (isset($conn)) {
    $conn->close();
}
?> 