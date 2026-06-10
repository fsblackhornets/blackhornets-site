<?php
require_once '../auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../../../src/config/database.php';
require_once __DIR__ . '/../../../src/utils/SecureFileUpload.php';
require_once __DIR__ . '/../../../src/utils/Translator.php';
require_once __DIR__ . '/../../../src/helpers/csrf_helper.php';

$is_edit = false;
$sponsor = null;

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Auto-migrate: add description_en column if it doesn't exist
    $col_check = $conn->query("SHOW COLUMNS FROM sponsors LIKE 'description_en'");
    if ($col_check && $col_check->num_rows === 0) {
        $conn->query("ALTER TABLE sponsors ADD COLUMN description_en TEXT NULL AFTER description");
    }

    // Check if editing existing sponsor
    if (isset($_GET['id'])) {
        $is_edit = true;
        $sponsor_id = intval($_GET['id']);
        $stmt = $conn->prepare("SELECT * FROM sponsors WHERE id = ?");
        $stmt->bind_param("i", $sponsor_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $sponsor = $result->fetch_assoc();
        
        if (!$sponsor) {
            header("Location: manage-sponsors.php");
            exit();
        }
    }

    // Handle form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        csrf_check();
        $name = trim($_POST['name']);
        $description = trim($_POST['description']);
        $tier = $_POST['tier'];
        $website = trim($_POST['website']);
        $tier_order = $_POST['tier_order'];
        
        // Validate required fields
        if (empty($name) || empty($description) || empty($tier)) {
            $error_message = "Please fill in all required fields.";
        } else {
            // Auto-translate description to English
            $description_en = '';
            if (!empty($description)) {
                $translated = Translator::translate($description, 'sr', 'en');
                $description_en = ($translated !== false) ? $translated : $description;
            }

            $logo = '';

            // Handle file upload with security validation
            if (isset($_FILES['logo']) && $_FILES['logo']['error'] !== UPLOAD_ERR_NO_FILE) {
                $upload_dir = __DIR__ . '/../uploads/sponsors/';
                $uploader = new SecureFileUpload($upload_dir, ['image'], 5 * 1024 * 1024); // 5MB max

                $logo = $uploader->upload($_FILES['logo'], 'sponsor_' . time());

                if (!$logo) {
                    $error_message = $uploader->getLastError();
                }
            } elseif ($is_edit && !isset($_FILES['logo'])) {
                // Keep existing logo if no new file uploaded
                $logo = $sponsor['logo'];
            }

            if (!isset($error_message)) {
                if ($is_edit) {
                    // Update existing sponsor
                    if ($logo) {
                        $stmt = $conn->prepare("UPDATE sponsors SET name = ?, description = ?, description_en = ?, tier = ?, website = ?, tier_order = ?, logo = ? WHERE id = ?");
                        $stmt->bind_param("sssssisi", $name, $description, $description_en, $tier, $website, $tier_order, $logo, $sponsor_id);
                    } else {
                        $stmt = $conn->prepare("UPDATE sponsors SET name = ?, description = ?, description_en = ?, tier = ?, website = ?, tier_order = ? WHERE id = ?");
                        $stmt->bind_param("sssssii", $name, $description, $description_en, $tier, $website, $tier_order, $sponsor_id);
                    }
                } else {
                    // Insert new sponsor
                    $stmt = $conn->prepare("INSERT INTO sponsors (name, description, description_en, tier, website, tier_order, logo, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
                    $stmt->bind_param("sssssis", $name, $description, $description_en, $tier, $website, $tier_order, $logo);
                }
                
                if ($stmt->execute()) {
                    header("Location: manage-sponsors.php?success=1");
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
    <title><?= $is_edit ? 'Edit' : 'Add' ?> Sponsor - Admin Dashboard</title>
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
        
        .current-logo {
            margin-top: 12px;
            padding: 12px;
            background: #222;
            border-radius: 8px;
            text-align: center;
        }
        
        .current-logo img {
            max-width: 100px;
            max-height: 100px;
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
                <h2><?= $is_edit ? 'Edit Sponsor' : 'Add New Sponsor' ?></h2>
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
                    <label class="form-label">Sponsor Name *</label>
                    <input type="text" name="name" class="form-input" 
                           value="<?= $is_edit ? htmlspecialchars($sponsor['name']) : '' ?>" 
                           required>
                </div>

                <div class="form-group">
                    <label class="form-label" data-i18n="descriptionSr">Description (Serbian) *</label>
                    <textarea name="description" class="form-input form-textarea" required><?= $is_edit ? htmlspecialchars($sponsor['description']) : '' ?></textarea>
                    <small style="color:#999; font-style:italic;" data-i18n="autoTranslateNote">English version will be auto-generated from Serbian content.</small>
                </div>

                <div class="form-group">
                    <label class="form-label">Tier *</label>
                    <select name="tier" class="form-select" required>
                        <option value="">Select Tier</option>
                        <option value="F1 - Platinum" <?= ($is_edit && $sponsor['tier'] === 'F1 - Platinum') ? 'selected' : '' ?>>F1 -  Platinum</option>
                        <option value="F2 - Gold" <?= ($is_edit && $sponsor['tier'] === 'F2 - Gold') ? 'selected' : '' ?>>F2 - Gold</option>
                        <option value="F3 - Silver" <?= ($is_edit && $sponsor['tier'] === 'F3 - Silver') ? 'selected' : '' ?>>F3 - Silver</option>
                        <option value="F4 - Bronze" <?= ($is_edit && $sponsor['tier'] === 'F4 - Bronze') ? 'selected' : '' ?>>F4 - Bronze</option>
                        <option value="Institucija" <?= ($is_edit && $sponsor['tier'] === 'Institucija') ? 'selected' : '' ?>>Institucija</option>
                        <option value="Friends of the Project" <?= ($is_edit && $sponsor['tier'] === 'Friends of the Project') ? 'selected' : '' ?>>Friends of the Project</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Tier Order</label>
                    <input type="number" name="tier_order" class="form-input" 
                           value="<?= $is_edit ? $sponsor['tier_order'] : '1' ?>" 
                           min="1" max="10">
                    <small style="color: #bbb; font-size: 0.9em;">Lower numbers appear first</small>
                </div>

                <div class="form-group">
                    <label class="form-label">Website URL</label>
                    <input type="url" name="website" class="form-input" 
                           value="<?= $is_edit ? htmlspecialchars($sponsor['website']) : '' ?>" 
                           placeholder="https://example.com">
                </div>

                <div class="form-group">
                    <label class="form-label">Logo <?= $is_edit ? '(Leave empty to keep current)' : '*' ?></label>
                    <div class="file-input-container">
                        <input type="file" name="logo" class="file-input" 
                               accept="image/*" <?= $is_edit ? '' : 'required' ?>>
                        <label class="file-input-label">
                            <i class="fas fa-upload"></i>
                            Choose Logo Image
                        </label>
                    </div>
                    
                    <?php if ($is_edit && $sponsor['logo']): ?>
                        <div class="current-logo">
                            <p>Current Logo:</p>
                            <img src="../uploads/sponsors/<?= htmlspecialchars($sponsor['logo']) ?>" 
                                 alt="Current logo">
                        </div>
                    <?php endif; ?>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-save"></i>
                        <?= $is_edit ? 'Update Sponsor' : 'Add Sponsor' ?>
                    </button>
                    <a href="manage-sponsors.php" class="btn-cancel">
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