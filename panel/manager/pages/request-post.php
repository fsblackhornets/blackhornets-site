<?php require_once __DIR__ . '/../auth_check.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request: Add News Post</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/panel/manager/manager.css">
    <?php include __DIR__ . '/../_form-styles.php'; ?>
    <style>
    .post-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: start;
    }
    /* ── Preview — exact blog card match ── */
    .post-preview-wrap { position: sticky; top: 80px; }
    .preview-label {
        font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase;
        color: #555; margin-bottom: 0.8rem; font-family: 'Michroma', sans-serif;
    }
    .post-preview-card {
        background: #23231f;
        border: 2.5px solid #232323;
        border-radius: 22px;
        overflow: hidden;
        box-shadow: 0 12px 40px rgba(255,215,0,0.13), 0 2px 8px rgba(0,0,0,0.18);
        transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        display: flex; flex-direction: column; height: 380px;
    }
    .post-preview-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(255,215,0,0.18); border-color: #ffd700; }

    /* Image area — flex:7 like blog */
    .preview-cover { flex: 7; overflow: hidden; position: relative; background: #222; }
    .preview-cover img { width: 100%; height: 100%; object-fit: cover; display: block; border-bottom: 2.5px solid #ffd700; }
    .preview-cover-placeholder {
        height: 100%; width: 100%;
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 60%, rgba(255,215,0,0.04) 100%);
        border-bottom: 2.5px solid #ffd700;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.8rem;
    }
    .preview-cover-placeholder img { width: auto; height: 40px; opacity: 0.08; filter: brightness(10); border: none; border-radius: 0; }
    .preview-cover-placeholder span { font-family: 'Michroma', sans-serif; font-size: 0.65rem; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,215,0,0.35); border: 1px solid rgba(255,215,0,0.15); padding: 3px 12px; border-radius: 20px; }

    /* Category badge — top-right, matches .post-category */
    .preview-badges { position: absolute; top: 12px; right: 12px; display: flex; gap: 6px; flex-wrap: wrap; z-index: 2; }
    .preview-badge-category {
        background: #ffd700; color: #23231f;
        font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
        padding: 3px 10px; border-radius: 20px; font-family: 'Michroma', sans-serif;
    }

    /* Content area — flex:3 like blog */
    .preview-body { flex: 3; padding: 14px 18px 14px; display: flex; flex-direction: column; min-height: 0; justify-content: space-between; overflow: hidden; }
    .preview-meta { display: flex; gap: 16px; color: #ffd700; font-size: 0.8rem; margin-bottom: 10px; opacity: 0.8; }
    .preview-meta i { color: #ffd700; margin-right: 4px; }
    .preview-title {
        font-family: 'Michroma', sans-serif; color: #ffd700;
        font-size: 1rem; margin: 0 0 8px; line-height: 1.3; font-weight: 700; letter-spacing: 1px;
        display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
    }
    .preview-title.empty { color: #333; }
    .preview-readmore {
        display: inline-flex; align-items: center; gap: 6px;
        color: #ffd700; font-size: 0.8rem;
        letter-spacing: 1px; text-transform: uppercase;
        font-family: 'Michroma', sans-serif;
        border-bottom: 1px solid rgba(255,215,0,0.3);
        padding-bottom: 2px; align-self: flex-start;
    }
    </style>
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
            <div class="post-layout">

                <!-- Left: Form -->
                <div class="form-section">
                    <h3><i class="fas fa-newspaper"></i> Post Content</h3>
                    <div class="form-grid">
                        <div class="form-group"><label>Title (Serbian) *</label><input type="text" id="f_title_sr" name="title_sr" required></div>
                        <div class="form-group"><label>Title (English)</label><input type="text" id="f_title_en" name="title_en"></div>
                    </div>
                    <!-- Hidden content fields -->
                    <textarea id="f_content_sr" name="content_sr" style="display:none;"></textarea>
                    <textarea id="f_content_en" name="content_en" style="display:none;"></textarea>

                    <div class="form-group">
                        <label>Category</label>
                        <select id="f_category" name="category">
                            <option value="">Select category</option>
                            <option value="Technology">Technology</option>
                            <option value="Events">Events</option>
                            <option value="Competitions">Competitions</option>
                            <option value="Team Updates">Team Updates</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Cover Image *</label>
                        <input type="file" id="f_image" name="image" accept="image/*" onchange="onImagePick(this)" required>
                        <p id="imageHint" style="color:#555;font-size:0.75rem;margin-top:4px;font-family:'Rajdhani',sans-serif;">Required before building content</p>
                    </div>

                    <!-- Build button — disabled until title + image filled -->
                    <div class="form-group" style="margin-top:0.5rem;">
                        <button type="button" id="buildBtn" onclick="goToBuilder()" disabled style="
                            width:100%;padding:12px;background:rgba(255,215,0,0.03);
                            border:1px dashed rgba(255,215,0,0.15);border-radius:8px;
                            color:#555;font-family:'Michroma',sans-serif;font-size:0.78rem;
                            letter-spacing:2px;text-transform:uppercase;cursor:not-allowed;
                            display:flex;align-items:center;justify-content:center;gap:10px;
                            transition:all 0.2s;
                        ">
                            <i class="fas fa-tools"></i> Build Post Content
                        </button>
                        <p id="buildHint" style="color:#555;font-size:0.75rem;text-align:center;margin-top:6px;font-family:'Rajdhani',sans-serif;">Fill title and cover image to continue</p>
                    </div>
                </div>

                <!-- Right: Live Preview -->
                <div class="post-preview-wrap">
                    <div class="preview-label">Live Preview</div>
                    <div class="post-preview-card">
                        <!-- Image area (flex:7) -->
                        <div class="preview-cover" id="pCoverWrap">
                            <div class="preview-badges">
                                <span class="preview-badge-category" id="pCategoryBadge" style="display:none;"></span>
                            </div>
                            <div class="preview-cover-placeholder" id="pCoverPlaceholder">
                                <img src="/frontend/assets/images/Tipografija_belo.png" alt="">
                                <span id="pCoverLabel">Black Hornets</span>
                            </div>
                            <div id="pCoverImgWrap" style="display:none;width:100%;overflow:hidden;border-bottom:2.5px solid #ffd700;cursor:grab;user-select:none;position:relative;">
                                <img id="pCoverImg" src="" alt="" style="width:100%;height:auto;display:block;transform-origin:center;transition:none;">
                                <div style="position:absolute;bottom:5px;right:8px;background:rgba(0,0,0,0.5);padding:2px 7px;border-radius:4px;">
                                    <span style="color:rgba(255,215,0,0.7);font-size:0.6rem;font-family:Michroma,sans-serif;letter-spacing:1px;">DRAG · SCROLL TO ZOOM</span>
                                </div>
                            </div>
                        </div>
                        <!-- Content area (flex:3) -->
                        <div class="preview-body">
                            <div class="preview-meta">
                                <span><i class="fa-regular fa-calendar"></i> <span id="pDate"></span></span>
                                <span><i class="fa-regular fa-user"></i> Manager</span>
                            </div>
                            <div class="preview-title empty" id="pTitle">Title will appear here...</div>
                            <span class="preview-readmore">Read More <i class="fas fa-arrow-right"></i></span>
                        </div>
                    </div>
                    <input type="hidden" name="image_position" value="50% 50%">
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
    const pTitle          = document.getElementById('pTitle');
    const pCategoryBadge  = document.getElementById('pCategoryBadge');
    const pCoverImg         = document.getElementById('pCoverImg');
    const pCoverPlaceholder = document.getElementById('pCoverPlaceholder');
    const pCoverLabel       = document.getElementById('pCoverLabel');
    const pDate             = document.getElementById('pDate');

    pDate.textContent = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

    function update() {
        const titleSr = document.getElementById('f_title_sr').value.trim();
        const titleEn = document.getElementById('f_title_en').value.trim();
        const category  = document.getElementById('f_category').value.trim();
        const title   = titleSr || titleEn || '';

        pTitle.textContent = title || 'Title will appear here...';
        pTitle.className   = 'preview-title' + (title ? '' : ' empty');

        pCategoryBadge.style.display  = category  ? '' : 'none';
        pCategoryBadge.textContent    = category;
        pCoverLabel.textContent       = category  || 'Black Hornets';
    }

    const imgWrap = document.getElementById('pCoverImgWrap');
    const posInput = document.querySelector('[name="image_position"]');
    let isDragging = false, startX = 0, startY = 0, tx = 0, ty = 0, imgScale = 1;

    function applyImgTransform() {
        pCoverImg.style.transform = `translateX(${tx}px) translateY(${ty}px) scale(${imgScale})`;
        if (posInput) posInput.value = `${Math.round(50 - tx)}% ${Math.round(50 - ty)}%`;
    }

    imgWrap.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; startY = e.clientY; imgWrap.style.cursor = 'grabbing'; e.preventDefault(); });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        tx += e.clientX - startX; ty += e.clientY - startY;
        startX = e.clientX; startY = e.clientY; applyImgTransform();
    });
    window.addEventListener('mouseup', () => { isDragging = false; imgWrap.style.cursor = 'grab'; });
    imgWrap.addEventListener('wheel', e => { e.preventDefault(); imgScale = Math.max(0.5, Math.min(4, imgScale - e.deltaY * 0.002)); applyImgTransform(); }, { passive: false });

    let coverImageDataUrl = null;

    window.onImagePick = function(input) {
        const file = input.files[0];
        if (!file) { coverImageDataUrl = null; checkReady(); return; }
        const reader = new FileReader();
        reader.onload = e => {
            coverImageDataUrl = e.target.result;
            document.getElementById('imageHint').style.color = '#5cb85c';
            document.getElementById('imageHint').textContent = file.name;
            pCoverImg.src = e.target.result;
            imgWrap.style.display = 'block';
            pCoverPlaceholder.style.display = 'none';
            tx = 0; ty = 0; imgScale = 1; applyImgTransform();
            checkReady();
        };
        reader.readAsDataURL(file);
    };

    function checkReady() {
        const titleFilled = document.getElementById('f_title_sr').value.trim() || document.getElementById('f_title_en').value.trim();
        const ready = !!(titleFilled && coverImageDataUrl);
        const btn   = document.getElementById('buildBtn');
        btn.disabled = !ready;
        btn.style.cursor     = ready ? 'pointer' : 'not-allowed';
        btn.style.color      = ready ? '#FFD700' : '#555';
        btn.style.borderColor = ready ? 'rgba(255,215,0,0.4)' : 'rgba(255,215,0,0.15)';
        btn.style.background  = ready ? 'rgba(255,215,0,0.08)' : 'rgba(255,215,0,0.03)';
        document.getElementById('buildHint').textContent = ready ? 'Ready — click to open builder' : 'Fill title and cover image to continue';
        document.getElementById('buildHint').style.color = ready ? '#5cb85c' : '#555';
    }

    window.goToBuilder = function() {
        const titleSr  = document.getElementById('f_title_sr').value.trim();
        const titleEn  = document.getElementById('f_title_en').value.trim();
        const category = document.getElementById('f_category').value;
        if (!titleSr && !titleEn) { alert('Enter a title first.'); return; }
        if (!coverImageDataUrl)   { alert('Choose a cover image first.'); return; }
        sessionStorage.setItem('postDraft', JSON.stringify({ titleSr, titleEn, category, coverImage: coverImageDataUrl }));
        window.location.href = 'request-post-builder.php';
    };

    ['f_title_sr','f_title_en'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', () => { update(); checkReady(); });
    });
    document.getElementById('f_category')?.addEventListener('change', update);
    document.getElementById('f_featured').addEventListener('change', update);

    update();
})();
</script>
</body>
</html>
