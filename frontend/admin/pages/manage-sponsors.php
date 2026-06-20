<?php
require_once '../auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../../../backend/config/database.php';
require_once __DIR__ . '/../../../backend/helpers/csrf_helper.php';

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Get all sponsors
    $sponsors_result = $conn->query("SELECT * FROM sponsors ORDER BY tier_order, created_at DESC");

    // --- Auto-migrate old brochure_pdf key to brochure_pdf_sr ---
    $migrate_check = $conn->query("SELECT id FROM site_settings WHERE setting_key = 'brochure_pdf'");
    if ($migrate_check && $migrate_check->num_rows > 0) {
        $conn->query("UPDATE site_settings SET setting_key = 'brochure_pdf_sr' WHERE setting_key = 'brochure_pdf'");
    }

    // --- Brochure Upload Handler ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'upload_brochure') {
        csrf_check();
        require_once __DIR__ . '/../../../backend/utils/SecureFileUpload.php';

        $brochure_lang = isset($_POST['brochure_lang']) && $_POST['brochure_lang'] === 'en' ? 'en' : 'sr';
        $setting_key = 'brochure_pdf_' . $brochure_lang;

        if (isset($_FILES['brochure_pdf']) && $_FILES['brochure_pdf']['error'] !== UPLOAD_ERR_NO_FILE) {
            $upload_dir = __DIR__ . '/../uploads/brochure/';
            $uploader = new SecureFileUpload($upload_dir, ['pdf'], 20 * 1024 * 1024);

            $filename = $uploader->upload($_FILES['brochure_pdf'], 'brochure_' . $brochure_lang . '_' . time());

            if ($filename) {
                $brochure_path = 'uploads/brochure/' . $filename;
                $user_id = $_SESSION['user_id'] ?? 1;

                $check = $conn->prepare("SELECT id, setting_value FROM site_settings WHERE setting_key = ?");
                $check->bind_param("s", $setting_key);
                $check->execute();
                $existing = $check->get_result()->fetch_assoc();

                if ($existing) {
                    $old_file = __DIR__ . '/../' . $existing['setting_value'];
                    if (file_exists($old_file)) {
                        unlink($old_file);
                    }
                    $stmt = $conn->prepare("UPDATE site_settings SET setting_value = ?, updated_by = ? WHERE setting_key = ?");
                    $stmt->bind_param("sis", $brochure_path, $user_id, $setting_key);
                } else {
                    $stmt = $conn->prepare("INSERT INTO site_settings (setting_key, setting_value, updated_by) VALUES (?, ?, ?)");
                    $stmt->bind_param("ssi", $setting_key, $brochure_path, $user_id);
                }

                if ($stmt->execute()) {
                    $brochure_success = ($brochure_lang === 'sr' ? 'Serbian' : 'English') . " brochure uploaded successfully!";
                } else {
                    $brochure_error = "Error saving brochure to database.";
                }
            } else {
                $brochure_error = $uploader->getLastError();
            }
        } else {
            $brochure_error = "Please select a PDF file.";
        }
    }

    // Fetch brochure info for both languages
    $brochure_sr = null;
    $brochure_en = null;
    $br_sr = $conn->query("SELECT setting_value, updated_at FROM site_settings WHERE setting_key = 'brochure_pdf_sr'");
    if ($br_sr && $br_sr->num_rows > 0) $brochure_sr = $br_sr->fetch_assoc();
    $br_en = $conn->query("SELECT setting_value, updated_at FROM site_settings WHERE setting_key = 'brochure_pdf_en'");
    if ($br_en && $br_en->num_rows > 0) $brochure_en = $br_en->fetch_assoc();

} catch (Exception $e) {
    $error_message = $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/frontend/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Sponsors - Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../css/dashboard.css">
    <style>
        .sponsors-container {
            background: rgba(30,30,30,0.95);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 0 18px #0005;
            margin-bottom: 40px;
        }
        
        .sponsors-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        
        .add-sponsor-btn {
            background: #FFD700;
            color: #222;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 1em;
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            transition: background 0.2s;
        }
        
        .add-sponsor-btn:hover {
            background: #ffe066;
        }
        
        .sponsors-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .sponsor-card {
            background: #181818;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: box-shadow 0.2s, transform 0.2s;
        }
        
        .sponsor-card:hover {
            box-shadow: 0 6px 24px rgba(255,215,0,0.13), 0 2px 8px rgba(0,0,0,0.18);
            transform: translateY(-2px);
        }
        
        .sponsor-logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        
        .sponsor-name {
            font-weight: 700;
            color: #FFD700;
            font-size: 1.2em;
            margin-bottom: 8px;
        }
        
        .sponsor-tier {
            color: #bbb;
            font-size: 0.9em;
            margin-bottom: 8px;
        }
        
        .sponsor-description {
            color: #ddd;
            font-size: 0.95em;
            margin-bottom: 16px;
            line-height: 1.4;
        }
        
        .sponsor-actions {
            display: flex;
            gap: 10px;
        }
        
        .btn-edit-sponsor {
            background: #FFD700;
            color: #222;
            font-weight: 600;
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 0.9em;
            display: flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
            transition: background 0.2s;
        }
        
        .btn-edit-sponsor:hover {
            background: #ffe066;
        }
        
        .btn-delete-sponsor {
            background: #e53935;
            color: #fff;
            font-weight: 600;
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 0.9em;
            display: flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
            transition: background 0.2s;
        }
        
        .btn-delete-sponsor:hover {
            background: #b71c1c;
        }
        
        .no-sponsors {
            text-align: center;
            color: #aaa;
            padding: 40px;
            font-size: 1.1em;
        }
        
        @media (max-width: 768px) {
            .sponsors-header {
                flex-direction: column;
                gap: 16px;
                align-items: stretch;
            }
            
            .sponsors-grid {
                grid-template-columns: 1fr;
            }
            
            .sponsor-actions {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <?php include __DIR__ . '/../components/admin_navbar.php'; ?>

        <div class="sponsors-container">
            <div class="sponsors-header">
                <h2 data-i18n="sponsorsManagement">Sponsors Management</h2>
                <a href="add-edit-sponsor.php" class="add-sponsor-btn">
                    <i class="fas fa-plus"></i>
                    <span data-i18n="addNewSponsor">Add New Sponsor</span>
                </a>
            </div>

            <div class="sponsors-grid">
                <?php if ($sponsors_result && $sponsors_result->num_rows > 0): ?>
                    <?php while ($sponsor = $sponsors_result->fetch_assoc()): ?>
                        <div class="sponsor-card">
                            <img src="../uploads/sponsors/<?= htmlspecialchars($sponsor['logo']) ?>" 
                                 alt="<?= htmlspecialchars($sponsor['name']) ?>" 
                                 class="sponsor-logo">
                            
                            <div class="sponsor-name"><?= htmlspecialchars($sponsor['name']) ?></div>
                            <div class="sponsor-tier"><?= htmlspecialchars($sponsor['tier']) ?></div>
                            <div class="sponsor-description"><?= htmlspecialchars($sponsor['description']) ?></div>
                            
                            <div class="sponsor-actions">
                                <a href="add-edit-sponsor.php?id=<?= $sponsor['id'] ?>" class="btn-edit-sponsor">
                                    <i class="fas fa-edit"></i> <span data-i18n="edit">Edit</span>
                                </a>
                                <a href="delete-sponsor.php?id=<?= $sponsor['id'] ?>&csrf_token=<?= htmlspecialchars(csrf_generate_token()) ?>"
                                   class="btn-delete-sponsor"
                                   onclick="return confirm(getT().confirmDeleteSponsor);">
                                    <i class="fas fa-trash"></i> <span data-i18n="delete">Delete</span>
                                </a>
                            </div>
                        </div>
                    <?php endwhile; ?>
                <?php else: ?>
                    <div class="no-sponsors">
                        <i class="fas fa-users" style="font-size: 3em; margin-bottom: 16px; color: #666;"></i>
                        <p data-i18n="noSponsorsFound">No sponsors found.</p>
                        <p data-i18n="addFirstSponsor">Add your first sponsor to get started!</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- Brochure Upload Section -->
        <div id="brochure-section" class="sponsors-container" style="margin-top:0;">
            <h2 style="margin-bottom:18px;"><i class="fas fa-file-pdf" style="color:#e53935;"></i> <span data-i18n="partnerBrochure">Partner Brochure</span></h2>

            <?php if (isset($brochure_success)): ?>
                <div style="background:#4CAF50;color:#fff;padding:12px;border-radius:8px;margin-bottom:20px;">
                    <i class="fas fa-check-circle"></i> <?= htmlspecialchars($brochure_success) ?>
                </div>
            <?php endif; ?>

            <?php if (isset($brochure_error)): ?>
                <div style="background:#e53935;color:#fff;padding:12px;border-radius:8px;margin-bottom:20px;">
                    <i class="fas fa-exclamation-triangle"></i> <?= htmlspecialchars($brochure_error) ?>
                </div>
            <?php endif; ?>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                <!-- Serbian Brochure -->
                <div style="background:#181818;border-radius:12px;padding:20px;border:1px solid rgba(255,179,0,0.15);">
                    <h3 style="color:#FFD700;margin:0 0 15px;font-size:1.1em;">
                        <i class="fas fa-flag"></i> <span data-i18n="serbianBrochure">Serbian Brochure</span>
                    </h3>
                    <?php if ($brochure_sr): ?>
                        <div style="background:#111;border-radius:8px;padding:12px;margin-bottom:15px;">
                            <p style="color:#bbb;margin:0 0 5px;font-size:0.9em;">
                                <i class="fas fa-file-pdf" style="color:#e53935;"></i>
                                <strong style="color:#FFD700;"><?= htmlspecialchars(basename($brochure_sr['setting_value'])) ?></strong>
                            </p>
                            <p style="color:#666;margin:0;font-size:0.8em;"><?= htmlspecialchars($brochure_sr['updated_at']) ?></p>
                        </div>
                    <?php else: ?>
                        <p style="color:#666;font-size:0.9em;margin-bottom:15px;"><i class="fas fa-info-circle"></i> <span data-i18n="noBrochureUploaded">No brochure uploaded yet.</span></p>
                    <?php endif; ?>
                    <form method="POST" enctype="multipart/form-data">
                        <?= csrf_token_field() ?>
                        <input type="hidden" name="action" value="upload_brochure">
                        <input type="hidden" name="brochure_lang" value="sr">
                        <input type="file" name="brochure_pdf" accept="application/pdf,.pdf" required
                               style="width:100%;padding:8px;border:2px dashed #333;border-radius:8px;background:#1a1a1a;color:#fff;margin-bottom:10px;box-sizing:border-box;">
                        <small style="color:#666;font-size:0.8em;display:block;margin-bottom:10px;" data-i18n="maxFileSize">Maximum file size: 20MB. PDF files only.</small>
                        <button type="submit" style="background:#FFD700;color:#222;font-weight:600;border:none;border-radius:8px;padding:10px 20px;font-size:0.9em;cursor:pointer;width:100%;">
                            <i class="fas fa-upload"></i> <span data-i18n="uploadBrochure">Upload Brochure</span>
                        </button>
                    </form>
                </div>

                <!-- English Brochure -->
                <div style="background:#181818;border-radius:12px;padding:20px;border:1px solid rgba(255,179,0,0.15);">
                    <h3 style="color:#FFD700;margin:0 0 15px;font-size:1.1em;">
                        <i class="fas fa-flag"></i> <span data-i18n="englishBrochure">English Brochure</span>
                    </h3>
                    <?php if ($brochure_en): ?>
                        <div style="background:#111;border-radius:8px;padding:12px;margin-bottom:15px;">
                            <p style="color:#bbb;margin:0 0 5px;font-size:0.9em;">
                                <i class="fas fa-file-pdf" style="color:#e53935;"></i>
                                <strong style="color:#FFD700;"><?= htmlspecialchars(basename($brochure_en['setting_value'])) ?></strong>
                            </p>
                            <p style="color:#666;margin:0;font-size:0.8em;"><?= htmlspecialchars($brochure_en['updated_at']) ?></p>
                        </div>
                    <?php else: ?>
                        <p style="color:#666;font-size:0.9em;margin-bottom:15px;"><i class="fas fa-info-circle"></i> <span data-i18n="noBrochureUploaded">No brochure uploaded yet.</span></p>
                    <?php endif; ?>
                    <form method="POST" enctype="multipart/form-data">
                        <?= csrf_token_field() ?>
                        <input type="hidden" name="action" value="upload_brochure">
                        <input type="hidden" name="brochure_lang" value="en">
                        <input type="file" name="brochure_pdf" accept="application/pdf,.pdf" required
                               style="width:100%;padding:8px;border:2px dashed #333;border-radius:8px;background:#1a1a1a;color:#fff;margin-bottom:10px;box-sizing:border-box;">
                        <small style="color:#666;font-size:0.8em;display:block;margin-bottom:10px;" data-i18n="maxFileSize">Maximum file size: 20MB. PDF files only.</small>
                        <button type="submit" style="background:#FFD700;color:#222;font-weight:600;border:none;border-radius:8px;padding:10px 20px;font-size:0.9em;cursor:pointer;width:100%;">
                            <i class="fas fa-upload"></i> <span data-i18n="uploadBrochure">Upload Brochure</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="loading-overlay">
        <div class="loading-spinner"></div>
    </div>

    <script>
        function getT() {
            const lang = localStorage.getItem('language') || 'en';
            return adminTranslations[lang] || adminTranslations.en;
        }

        document.querySelectorAll('.sponsor-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('a')) {
                    e.preventDefault();
                }
            });
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