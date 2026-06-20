<?php require_once __DIR__ . '/../auth_check.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request: Add Project</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/frontend/manager/manager.css">
    <?php include __DIR__ . '/../_form-styles.php'; ?>
</head>
<body>
<div class="m-layout">
    <?php include __DIR__ . '/../_sidebar.php'; ?>
    <main class="m-main">
        <div class="page-header">
            <h1><i class="fas fa-project-diagram"></i> Request: Add Project</h1>
            <a href="../dashboard.php" class="back-btn"><i class="fas fa-arrow-left"></i> Dashboard</a>
        </div>

        <div class="alert alert-info"><i class="fas fa-info-circle"></i> Project will appear on site only after admin approval.</div>

        <form id="requestForm" enctype="multipart/form-data">
            <input type="hidden" name="type" value="project">
            <div class="form-section" style="max-width:900px;">
                <h3><i class="fas fa-project-diagram"></i> Project Details</h3>
                <div class="form-group"><label>Project Name *</label><input type="text" name="name" required></div>
                <div class="form-group"><label>Description *</label><textarea name="description" rows="4" required style="width:100%;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-family:Poppins,sans-serif;resize:vertical;"></textarea></div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Status</label>
                        <select name="status">
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div class="form-group"><label>Progress (%)</label><input type="number" name="progress" min="0" max="100" value="0"></div>
                    <div class="form-group"><label>Due Date</label><input type="date" name="due_date"></div>
                    <div class="form-group"><label>Duration</label><input type="text" name="duration" placeholder="e.g. 6 months"></div>
                </div>
                <div class="form-group"><label>Project Image</label><input type="file" name="image" accept="image/*"></div>
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
