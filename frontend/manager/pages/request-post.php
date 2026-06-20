<?php require_once __DIR__ . '/../auth_check.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request: Add News Post</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/frontend/manager/manager.css">
    <?php include __DIR__ . '/../_form-styles.php'; ?>
</head>
<body>
<div class="m-layout">
    <?php include __DIR__ . '/../_sidebar.php'; ?>
    <main class="m-main">
        <div class="page-header">
            <h1><i class="fas fa-newspaper"></i> Request: Add News Post</h1>
            <a href="../dashboard.php" class="back-btn"><i class="fas fa-arrow-left"></i> Dashboard</a>
        </div>

        <div class="alert alert-info"><i class="fas fa-info-circle"></i> Post will be published only after admin approval.</div>

        <form id="requestForm" enctype="multipart/form-data">
            <input type="hidden" name="type" value="post">
            <div class="form-section" style="max-width:900px;">
                <h3><i class="fas fa-newspaper"></i> Post Content</h3>
                <div class="form-grid">
                    <div class="form-group"><label>Title (Serbian) *</label><input type="text" name="title_sr" required></div>
                    <div class="form-group"><label>Title (English)</label><input type="text" name="title_en"></div>
                </div>
                <div class="form-group"><label>Content (Serbian) *</label><textarea name="content_sr" rows="6" required style="width:100%;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-family:Poppins,sans-serif;resize:vertical;"></textarea></div>
                <div class="form-group"><label>Content (English)</label><textarea name="content_en" rows="6" style="width:100%;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-family:Poppins,sans-serif;resize:vertical;"></textarea></div>
                <div class="form-grid">
                    <div class="form-group"><label>Category</label><input type="text" name="category" placeholder="e.g. News, Event, Update"></div>
                    <div class="form-group"><label>Cover Image</label><input type="file" name="image" accept="image/*"></div>
                </div>
                <div class="form-group">
                    <label><input type="checkbox" name="featured" value="1" style="width:auto;margin-right:8px;"> Mark as Featured</label>
                </div>
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
