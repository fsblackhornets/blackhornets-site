<?php require_once __DIR__ . '/../auth_check.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request: Add Project</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/panel/manager/manager.css">
    <?php include __DIR__ . '/../_form-styles.php'; ?>
    <style>
    /* ── Preview card (matches project page) ── */
    .preview-section { margin-top: 2rem; }
    .preview-label {
        font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase;
        color: #555; margin-bottom: 0.8rem; font-family: 'Michroma', sans-serif;
    }
    .p-card {
        background: #1a1a1a;
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid rgba(255,215,0,0.1);
        transition: all 0.3s ease;
    }
    .p-card:hover {
        border-color: #FFD700;
        box-shadow: 0 10px 30px rgba(255,215,0,0.15);
        transform: translateY(-3px);
    }
    .p-content { padding: 20px; }
    .p-image { width: 100%; height: auto; display: block; border-radius: 6px; margin-bottom: 12px; }
    .p-placeholder {
        width: 100%; height: 220px;
        background: linear-gradient(145deg, #FFD700, #ffed4e);
        border-radius: 6px; margin-bottom: 12px;
        display: flex; align-items: center; justify-content: center;
        font-size: 3rem; font-weight: bold; color: #111; text-transform: uppercase;
    }
    .p-status {
        display: inline-block; padding: 5px 12px; border-radius: 15px;
        font-size: 0.75rem; font-weight: 600; margin-bottom: 12px;
        text-transform: uppercase; letter-spacing: 1px;
    }
    .p-status.active    { background: #4caf50; color: #fff; }
    .p-status.pending   { background: #ff9800; color: #fff; }
    .p-status.completed { background: #2196f3; color: #fff; }
    .p-title {
        color: #FFD700; font-family: 'Michroma', sans-serif;
        font-size: 1.2rem; margin-bottom: 10px;
        text-transform: uppercase; letter-spacing: 1px;
        min-height: 1.4em;
    }
    .p-title.empty { color: #333; }
    .p-desc { color: #e0e0e0; font-size: 0.9rem; line-height: 1.5; margin-bottom: 15px; min-height: 2.5em; }
    .p-desc.empty { color: #2a2a2a; }
    .p-meta { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 15px; }
    .p-meta-item { display: flex; align-items: center; gap: 6px; color: #bbb; font-size: 0.8rem; }
    .p-meta-item i { color: #FFD700; }
    .p-progress-wrap { margin-top: 12px; }
    .p-progress-row { display: flex; align-items: center; gap: 10px; }
    .p-progress-label { color: #e0e0e0; font-weight: 600; min-width: 70px; font-size: 0.85rem; }
    .p-progress-bar { flex: 1; height: 8px; background: #333; border-radius: 4px; overflow: hidden; }
    .p-progress-fill { height: 100%; border-radius: 4px; transition: width 0.4s ease, background 0.3s; }
    .p-progress-pct { color: #FFD700; font-weight: 600; min-width: 40px; text-align: right; font-size: 0.85rem; }
    </style>
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

            <!-- Form -->
            <div class="form-section">
                <h3><i class="fas fa-project-diagram"></i> Project Details</h3>
                <div class="form-group"><label>Project Name *</label><input type="text" id="f_name" name="name" required></div>
                <div class="form-group"><label>Description *</label><textarea id="f_desc" name="description" rows="4" required style="width:100%;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-family:Poppins,sans-serif;resize:vertical;"></textarea></div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Status</label>
                        <select id="f_status" name="status">
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div class="form-group"><label>Progress (%)</label><input type="number" id="f_progress" name="progress" min="0" max="100" value="0"></div>
                    <div class="form-group"><label>Due Date</label><input type="date" id="f_due" name="due_date"></div>
                    <div class="form-group"><label>Duration</label><input type="text" id="f_duration" name="duration" placeholder="e.g. 6 months"></div>
                </div>
                <div class="form-group"><label>Project Image</label><input type="file" id="f_image" name="image" accept="image/*"></div>
                <input type="hidden" id="f_image_position" name="image_position" value="50% 50%">
                <div id="posDisplay" style="display:none;font-size:0.65rem;color:#555;font-family:Michroma,sans-serif;letter-spacing:1px;margin-top:4px;">position: <span id="posVal">50% 50%</span></div>
            </div>

            <!-- Live Preview -->
            <div class="preview-section">
                <div class="preview-label">Live Preview</div>
                <div class="p-card">
                    <div class="p-content">
                        <div class="p-placeholder" id="pPlaceholder">P</div>
                        <div id="pImageWrap" style="display:none;border-radius:6px;margin-bottom:12px;overflow:hidden;">
                            <img id="pImage" src="" alt="" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;">
                        </div>
                        <span class="p-status active" id="pStatus">Active</span>
                        <div class="p-title empty" id="pTitle">Project name will appear here...</div>
                        <div class="p-desc empty" id="pDesc">Description will appear here...</div>
                        <div class="p-meta">
                            <div class="p-meta-item"><i class="fas fa-calendar"></i> <span id="pDue">No due date</span></div>
                            <div class="p-meta-item"><i class="fas fa-clock"></i> <span id="pDuration">—</span></div>
                            <div class="p-meta-item"><i class="fas fa-hourglass-half"></i> <span id="pDays">—</span></div>
                        </div>
                        <div class="p-progress-wrap">
                            <div class="p-progress-row">
                                <span class="p-progress-label">Progress</span>
                                <div class="p-progress-bar">
                                    <div class="p-progress-fill" id="pProgressFill" style="width:0%;background:#F44336;"></div>
                                </div>
                                <span class="p-progress-pct" id="pProgressPct">0%</span>
                            </div>
                        </div>
                    </div>
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
<script>
(function () {
    const pTitle       = document.getElementById('pTitle');
    const pDesc        = document.getElementById('pDesc');
    const pStatus      = document.getElementById('pStatus');
    const pDue         = document.getElementById('pDue');
    const pDuration    = document.getElementById('pDuration');
    const pDays        = document.getElementById('pDays');
    const pProgressFill= document.getElementById('pProgressFill');
    const pProgressPct = document.getElementById('pProgressPct');
    const pPlaceholder = document.getElementById('pPlaceholder');
    const pImage       = document.getElementById('pImage');

    const progressColors = [
        { min: 80, color: '#4CAF50' },
        { min: 50, color: '#FFD700' },
        { min: 25, color: '#FF9800' },
        { min: 0,  color: '#F44336' },
    ];

    function getProgressColor(val) {
        return (progressColors.find(c => val >= c.min) || progressColors[progressColors.length - 1]).color;
    }

    function calcDays(dueStr) {
        if (!dueStr) return '—';
        const diff = Math.round((new Date(dueStr) - new Date()) / 86400000);
        if (diff < 0) return `${Math.abs(diff)} days overdue`;
        return `${diff} days remaining`;
    }

    function update() {
        const name     = document.getElementById('f_name').value.trim();
        const desc     = document.getElementById('f_desc').value.trim();
        const status   = document.getElementById('f_status').value;
        const progress = parseInt(document.getElementById('f_progress').value) || 0;
        const due      = document.getElementById('f_due').value;
        const duration = document.getElementById('f_duration').value.trim();

        pTitle.textContent = name || 'Project name will appear here...';
        pTitle.className   = 'p-title' + (name ? '' : ' empty');
        pDesc.textContent  = desc || 'Description will appear here...';
        pDesc.className    = 'p-desc' + (desc ? '' : ' empty');

        pPlaceholder.textContent = name ? name.charAt(0).toUpperCase() : 'P';

        pStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        pStatus.className   = `p-status ${status}`;

        pDue.textContent      = due ? new Date(due).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : 'No due date';
        pDuration.textContent = duration || '—';
        pDays.textContent     = calcDays(due);

        const clampedProg = Math.min(100, Math.max(0, progress));
        pProgressFill.style.width      = clampedProg + '%';
        pProgressFill.style.background = getProgressColor(clampedProg);
        pProgressPct.textContent       = clampedProg + '%';
    }


    document.getElementById('f_image').addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                pImage.src = e.target.result;
                pImageWrap.style.display = 'block';
                pPlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            pImageWrap.style.display = 'none';
            pPlaceholder.style.display = 'flex';
            posDisplay.style.display = 'none';
        }
    });

    ['f_name','f_desc','f_duration'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', update);
    });
    const fProgress = document.getElementById('f_progress');
    const fStatus   = document.getElementById('f_status');

    fStatus.addEventListener('change', () => {
        const s = fStatus.value;
        if (s === 'completed') {
            fProgress.value    = 100;
            fProgress.disabled = true;
        } else if (s === 'pending') {
            fProgress.value    = 0;
            fProgress.disabled = true;
        } else {
            fProgress.disabled = false;
        }
        update();
    });

    fProgress.addEventListener('input', update);
    document.getElementById('f_due')?.addEventListener('change', update);

    update();
})();
</script>
</body>
</html>
