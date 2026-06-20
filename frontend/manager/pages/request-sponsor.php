<?php require_once __DIR__ . '/../auth_check.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request: Add Sponsor</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/frontend/manager/manager.css">
    <?php include __DIR__ . '/../_form-styles.php'; ?>
</head>
<body>
<div class="m-layout">
    <?php include __DIR__ . '/../_sidebar.php'; ?>
    <main class="m-main">
        <div class="page-header">
            <h1><i class="fas fa-handshake"></i> Request: Add Sponsor</h1>
            <a href="../dashboard.php" class="back-btn"><i class="fas fa-arrow-left"></i> Dashboard</a>
        </div>

        <div class="alert alert-info"><i class="fas fa-info-circle"></i> Sponsor will be added to the site only after admin approval.</div>

        <form id="requestForm" enctype="multipart/form-data">
            <input type="hidden" name="type" value="sponsor">
            <div class="form-section" style="max-width:900px;">
                <h3><i class="fas fa-handshake"></i> Sponsor Details</h3>
                <div class="form-grid">
                    <div class="form-group"><label>Sponsor Name *</label><input type="text" name="name" required></div>
                    <div class="form-group">
                        <label>Tier *</label>
                        <select name="tier" required>
                            <option value="">Select tier</option>
                            <option value="Institucija">Institucija</option>
                            <option value="F1 - Platinum">F1 - Platinum</option>
                            <option value="F2 - Gold">F2 - Gold</option>
                            <option value="F3 - Silver">F3 - Silver</option>
                            <option value="F4 - Bronze">F4 - Bronze</option>
                            <option value="Friends of the Project">Friends of the Project</option>
                        </select>
                    </div>
                    <div class="form-group"><label>Website</label><input type="url" name="website" placeholder="https://..."></div>
                    <div class="form-group"><label>Logo</label><input type="file" name="logo" accept="image/*,.svg"></div>
                </div>
                <div class="form-group"><label>Description (Serbian)</label><textarea name="description_sr" rows="3" style="width:100%;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-family:Poppins,sans-serif;resize:vertical;"></textarea></div>
                <div class="form-group"><label>Description (English)</label><textarea name="description_en" rows="3" style="width:100%;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-family:Poppins,sans-serif;resize:vertical;"></textarea></div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-submit"><i class="fas fa-paper-plane"></i> Submit Request</button>
                <a href="../dashboard.php" class="btn-cancel">Cancel</a>
            </div>
        </form>
    </main>
</div>
<?php include __DIR__ . '/../_form-script.php'; ?>
</body>
</html>
