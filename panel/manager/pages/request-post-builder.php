<?php require_once __DIR__ . '/../auth_check.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Post Builder</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/panel/manager/manager.css">
    <?php include __DIR__ . '/../_form-styles.php'; ?>
    <style>
    /* ── Full-width builder ── */
    .builder-wrap { display: grid; grid-template-columns: 1fr 420px; gap: 2rem; align-items: start; }

    /* ── Page tabs ── */
    .page-tabs { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.2rem; flex-wrap: wrap; }
    .page-tab {
        padding: 7px 20px; border-radius: 8px; cursor: pointer; font-family: 'Michroma', sans-serif;
        font-size: 0.7rem; letter-spacing: 1.5px; text-transform: uppercase; transition: all 0.2s;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #666;
    }
    .page-tab.active { background: rgba(255,215,0,0.1); border-color: #FFD700; color: #FFD700; }
    .page-tab:hover:not(.active) { border-color: rgba(255,215,0,0.3); color: #aaa; }
    .add-page-btn {
        padding: 7px 14px; border-radius: 8px; cursor: pointer;
        background: rgba(255,215,0,0.05); border: 1px dashed rgba(255,215,0,0.25); color: #555;
        font-family: 'Michroma', sans-serif; font-size: 0.7rem; letter-spacing: 1.5px; text-transform: uppercase;
        transition: all 0.2s; display: flex; align-items: center; gap: 6px;
    }
    .add-page-btn:hover { border-color: rgba(255,215,0,0.5); color: #FFD700; }
    .add-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .page-limit-hint { font-size: 0.7rem; color: #444; font-family: 'Rajdhani', sans-serif; }

    /* ── Add section bar ── */
    .add-section-bar { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; align-items: center; }
    .add-btn {
        display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px;
        border-radius: 8px; cursor: pointer; background: rgba(255,215,0,0.06);
        border: 1px solid rgba(255,215,0,0.2); color: #FFD700; font-family: 'Michroma', sans-serif;
        font-size: 0.65rem; letter-spacing: 1.5px; text-transform: uppercase; transition: all 0.2s;
    }
    .add-btn:hover { background: rgba(255,215,0,0.12); border-color: #FFD700; }
    .add-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .section-limit-hint { font-size: 0.72rem; color: #555; font-family: 'Rajdhani', sans-serif; margin-left: auto; }

    /* ── Section blocks ── */
    .section-block {
        background: #111; border: 1px solid rgba(255,215,0,0.12);
        border-radius: 12px; overflow: hidden; margin-bottom: 2rem;
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    .section-block.dragging { opacity: 0.4; border-color: rgba(255,215,0,0.5); }
    .section-block.drag-over { border-color: #FFD700; box-shadow: 0 0 12px rgba(255,215,0,0.15); }
    .section-block-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 9px 14px; background: rgba(255,215,0,0.04);
        border-bottom: 1px solid rgba(255,215,0,0.08);
        cursor: grab; user-select: none;
    }
    .section-block-header:active { cursor: grabbing; }
    .section-block-header .label { font-family: 'Michroma', sans-serif; font-size: 0.68rem; letter-spacing: 1.5px; text-transform: uppercase; color: #FFD700; display: flex; align-items: center; gap: 8px; }
    .section-block-header .drag-handle { color: #444; font-size: 0.8rem; margin-right: 4px; }
    .section-actions { display: flex; gap: 4px; }
    .section-actions button {
        background: none; border: none; color: #555; cursor: pointer;
        font-size: 0.82rem; padding: 3px 7px; border-radius: 4px; transition: color 0.2s;
    }
    .section-actions button:hover { color: #FFD700; }
    .section-actions button.del:hover { color: #e74c3c; }
    .section-block-body { padding: 1rem; }

    textarea.builder-ta, input.builder-ta {
        width: 100%; padding: 10px; resize: vertical;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px; color: #e0e0e0; font-family: 'Rajdhani', sans-serif;
        font-size: 0.95rem; outline: none; transition: border-color 0.2s;
    }
    input.builder-ta { resize: none; }
    textarea.builder-ta:focus, input.builder-ta:focus { border-color: rgba(255,215,0,0.4); }

    /* Photo slots */
    .layout-picker { display: flex; gap: 0.4rem; margin-bottom: 0.8rem; }
    .lp-btn {
        flex: 1; padding: 6px 0; border-radius: 7px; cursor: pointer; text-align: center;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
        color: #666; font-family: 'Michroma', sans-serif; font-size: 0.62rem;
        letter-spacing: 1px; transition: all 0.2s;
    }
    .lp-btn.active, .lp-btn:hover { border-color: rgba(255,215,0,0.4); color: #FFD700; background: rgba(255,215,0,0.06); }
    .img-slots { display: grid; gap: 0.7rem; }
    .img-slots.c1 { grid-template-columns: 1fr; }
    .img-slots.c2 { grid-template-columns: 1fr 1fr; }
    .img-slots.c3 { grid-template-columns: 1fr 1fr 1fr; }
    .img-slot-wrap {
        aspect-ratio: 4/3; border: 1px dashed rgba(255,215,0,0.2); border-radius: 8px;
        background: #0a0a0a; display: flex; align-items: center; justify-content: center;
        cursor: pointer; position: relative; overflow: hidden;
    }
    .img-slot-wrap img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: none; }
    .img-slot-wrap .ph { color: #333; font-size: 1.2rem; pointer-events: none; }
    .img-slot-wrap input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
    .slot-cat { width: 100%; margin-top: 5px; padding: 6px 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #e0e0e0; font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; outline: none; }
    .slot-cat option { background: #1a1a1a; }

    /* ── Preview panel ── */
    /* ── Preview panel — mini blog-post page ── */
    .preview-panel { position: sticky; top: 80px; background: #0d0d0d; border: 1px solid rgba(255,215,0,0.08); border-radius: 14px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
    .preview-header { padding: 9px 14px; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,215,0,0.07); display: flex; align-items: center; justify-content: space-between; }
    .preview-header .label { font-family: 'Michroma', sans-serif; font-size: 0.6rem; letter-spacing: 2px; text-transform: uppercase; color: #3a3a3a; }
    .preview-header .page-indicator { font-family: 'Michroma', sans-serif; font-size: 0.6rem; color: #FFD700; letter-spacing: 1px; }

    /* Scrollable content area */
    .preview-body { padding: 14px; max-height: 72vh; overflow-y: auto; overflow-x: hidden; word-break: break-word; overflow-wrap: break-word; background: #0d0d0d; }

    /* Mini post-wrapper */
    .prev-post-wrap { background: rgba(255,255,255,0.02); border-radius: 10px; padding: 14px; border: 1px solid rgba(255,215,0,0.05); }

    /* Mini post-header — centered like real page */
    .prev-post-header { text-align: center; margin-bottom: 12px; padding-bottom: 12px; position: relative; }
    .prev-post-header::after { content:''; display:block; width:24px; height:2px; background:#FFD700; margin:8px auto 0; border-radius:2px; }
    .prev-post-header .prev-cat-tag { display:inline-block; background:#FFD700; color:#111; padding:2px 8px; border-radius:20px; font-size:0.58rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; }
    .prev-post-header h1 { font-family:'Rajdhani',sans-serif; color:#fff; font-size:0.9rem; margin:0 0 5px; font-weight:700; line-height:1.3; }
    .prev-post-header .prev-meta { display:flex; justify-content:center; gap:10px; color:#555; font-size:0.65rem; font-family:'Rajdhani',sans-serif; }
    .prev-post-header .prev-meta i { color:#FFD700; margin-right:2px; }

    /* Featured image */
    .prev-featured-img { margin:10px 0; border-radius:8px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.4); }
    .prev-featured-img img { width:100%; height:auto; display:block; }

    /* Content */
    .prev-heading { font-family:'Rajdhani',sans-serif; color:#FFD700; font-size:0.82rem; font-weight:700; margin:12px 0 5px; padding-left:8px; border-left:2px solid #FFD700; }
    .prev-para { color:#bbb; font-family:'Rajdhani',sans-serif; font-size:0.8rem; line-height:1.75; margin-bottom:8px; }
    .prev-para ul { list-style:disc; padding-left:1.2rem; } .prev-para ol { list-style:decimal; padding-left:1.2rem; }
    .prev-imgs { display:grid; gap:4px; margin:8px 0; }
    .prev-imgs.c1 { grid-template-columns:1fr; } .prev-imgs.c2 { grid-template-columns:1fr 1fr; } .prev-imgs.c3 { grid-template-columns:1fr 1fr 1fr; }
    .prev-imgs img { width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:5px; }
    .prev-imgs .no-img { aspect-ratio:4/3; background:#0a0a0a; border-radius:5px; display:flex; align-items:center; justify-content:center; color:#222; font-size:1rem; }
    .prev-side { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:8px 0; align-items:center; }
    .prev-side img { width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:6px; }
    .prev-side .no-img { aspect-ratio:4/3; background:#0a0a0a; border-radius:6px; display:flex; align-items:center; justify-content:center; color:#222; }
    .prev-side-text { color:#bbb; font-family:'Rajdhani',sans-serif; font-size:0.78rem; line-height:1.6; overflow-wrap:break-word; }
    .preview-empty { color:#2a2a2a; text-align:center; padding:2.5rem 1rem; font-family:'Rajdhani',sans-serif; font-size:0.82rem; }

    /* Gallery carousel */
    .prev-gallery { position:relative; margin:8px 0; border-radius:8px; overflow:hidden; background:#0a0a0a; }
    .prev-gallery-slides { display:flex; transition:transform 0.3s ease; }
    .prev-gallery-slides img { min-width:100%; aspect-ratio:16/9; object-fit:cover; }
    .prev-gallery-btn { position:absolute; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.6); border:none; color:#FFD700; width:22px; height:22px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:0.65rem; z-index:2; }
    .prev-gallery-btn.left { left:4px; } .prev-gallery-btn.right { right:4px; }
    .prev-gallery-dots { display:flex; justify-content:center; gap:4px; padding:4px; }
    .prev-gallery-dots span { width:4px; height:4px; border-radius:50%; background:#2a2a2a; } .prev-gallery-dots span.active { background:#FFD700; }

    /* Page dots */
    .preview-page-nav { display:flex; justify-content:center; gap:5px; padding:8px; border-top:1px solid rgba(255,215,0,0.05); background:rgba(0,0,0,0.3); }
    .prev-page-dot { width:6px; height:6px; border-radius:50%; background:#222; cursor:pointer; transition:background 0.2s; }
    .prev-page-dot.active { background:#FFD700; }

    /* ── Format toolbar ── */
    .fmt-toolbar { display: flex; gap: 4px; margin-bottom: 6px; flex-wrap: wrap; }
    .fmt-btn {
        padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 0.78rem;
        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
        color: #bbb; transition: all 0.2s; font-family: 'Rajdhani', sans-serif; font-weight: 600;
    }
    .fmt-btn:hover { border-color: rgba(255,215,0,0.4); color: #FFD700; background: rgba(255,215,0,0.06); }
    .fmt-btn.active { background: rgba(255,215,0,0.2); border-color: #FFD700; color: #FFD700; }
    .fmt-btn b { font-weight: 900; }
    .fmt-color-input { width: 28px; height: 28px; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; cursor: pointer; background: none; padding: 2px; }
    .char-counter { font-size: 0.72rem; font-family: 'Rajdhani', sans-serif; margin-top: 5px; text-align: right; }
    .char-counter.ok   { color: #555; }
    .char-counter.warn { color: #ff9800; }
    .char-counter.over { color: #e74c3c; }

    /* WYSIWYG editor */
    .wysiwyg {
        width: 100%; min-height: 80px; max-height: 220px; overflow-y: auto; padding: 10px 12px;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px; color: #e0e0e0; font-family: 'Rajdhani', sans-serif;
        font-size: 0.95rem; line-height: 1.7; outline: none;
        transition: border-color 0.2s; word-break: break-word;
    }
    .wysiwyg:focus { border-color: rgba(255,215,0,0.4); }
    .wysiwyg:empty:before { content: attr(data-placeholder); color: #444; pointer-events: none; }
    .wysiwyg ul { list-style: disc; padding-left: 1.4rem; margin: 4px 0; }
    .wysiwyg ol { list-style: decimal; padding-left: 1.4rem; margin: 4px 0; }
    .wysiwyg li { margin-bottom: 2px; }

    /* Submit area */
    .submit-area { margin-top: 1.5rem; display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }

    /* ── Photo+Text side-by-side editor ── */
    .side-editor { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }

    /* ── Gallery editor ── */
    .gallery-slots { display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: flex-start; }
    .gallery-slot { width: 90px; }
    .gallery-slot .img-slot-wrap { width: 90px; height: 70px; aspect-ratio: unset; }
    .gallery-add-slot {
        width: 90px; height: 70px; border: 1px dashed rgba(255,215,0,0.2); border-radius: 8px;
        background: #0a0a0a; display: flex; align-items: center; justify-content: center;
        cursor: pointer; color: #444; font-size: 1.2rem; transition: border-color 0.2s;
    }
    .gallery-add-slot:hover { border-color: rgba(255,215,0,0.5); color: #FFD700; }

    /* ── Preview new types ── */
    .preview-body .prev-side { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 0.8rem 0; align-items: center; }
    .preview-body .prev-side img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 8px; }
    .preview-body .prev-side .no-img { width: 100%; aspect-ratio: 4/3; background: #0a0a0a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #2a2a2a; font-size: 1.5rem; }
    .preview-body .prev-side-text { color: #bbb; font-family: 'Rajdhani', sans-serif; font-size: 0.88rem; line-height: 1.7; overflow-wrap: break-word; }

    /* Gallery carousel preview */
    .prev-gallery { position: relative; margin: 0.8rem 0; border-radius: 8px; overflow: hidden; background: #0a0a0a; }
    .prev-gallery-slides { display: flex; transition: transform 0.3s ease; }
    .prev-gallery-slides img { min-width: 100%; aspect-ratio: 16/9; object-fit: cover; }
    .prev-gallery-btn {
        position: absolute; top: 50%; transform: translateY(-50%);
        background: rgba(0,0,0,0.6); border: none; color: #FFD700;
        width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
        display: flex; align-items: center; justify-content: center; font-size: 0.75rem; z-index: 2;
    }
    .prev-gallery-btn.left  { left: 6px; }
    .prev-gallery-btn.right { right: 6px; }
    .prev-gallery-dots { display: flex; justify-content: center; gap: 4px; padding: 6px; }
    .prev-gallery-dots span { width: 5px; height: 5px; border-radius: 50%; background: #333; }
    .prev-gallery-dots span.active { background: #FFD700; }
    </style>
</head>
<body>
<div class="m-layout">
    <?php include __DIR__ . '/../_sidebar.php'; ?>
    <main class="m-main" style="padding-bottom:3rem;">
        <div class="page-header">
            <h1><i class="fas fa-tools"></i> Post Builder</h1>
            <a href="request-post.php" class="back-btn"><i class="fas fa-arrow-left"></i> Back</a>
        </div>
        <div class="alert alert-info"><i class="fas fa-info-circle"></i> Build your post chapter by chapter. Max <strong>3 chapters</strong>, max <strong>6 sections</strong> per chapter. Drag sections to reorder.</div>

        <div class="builder-wrap">

            <!-- Editor -->
            <div>
                <!-- Page tabs -->
                <div class="page-tabs" id="pageTabs"></div>

                <!-- Add section -->
                <div class="add-section-bar">
                    <button class="add-btn" id="addHeading"    onclick="addSection('heading')"><i class="fas fa-heading"></i> Heading</button>
                    <button class="add-btn" id="addParagraph"  onclick="addSection('paragraph')"><i class="fas fa-align-left"></i> Paragraph</button>
                    <button class="add-btn" id="addImages"     onclick="addSection('images')"><i class="fas fa-images"></i> Photos</button>
                    <button class="add-btn" id="addPhotoLeft"  onclick="addSection('photo-left')"><i class="fas fa-image"></i> Img Left</button>
                    <button class="add-btn" id="addPhotoRight" onclick="addSection('photo-right')"><i class="fas fa-image"></i> Img Right</button>
                    <button class="add-btn" id="addGallery"    onclick="addSection('gallery')"><i class="fas fa-th"></i> Gallery</button>
                    <span class="section-limit-hint" id="sectionHint"></span>
                </div>

                <div id="sectionList"></div>

                <!-- Submit -->
                <div class="submit-area">
                    <button type="button" class="btn-submit" onclick="savePost()"><i class="fas fa-paper-plane"></i> Submit Post</button>
                    <a href="request-post.php" class="btn-cancel">Cancel</a>
                </div>
                <div id="saveMsg" style="display:none;margin-top:1rem;padding:12px 16px;border-radius:8px;font-family:'Rajdhani',sans-serif;font-size:0.9rem;"></div>
            </div>

            <!-- Preview -->
            <div class="preview-panel">
                <div class="preview-header">
                    <span class="label">Live Preview</span>
                    <span class="page-indicator" id="prevPageLabel">Chapter 1</span>
                </div>
                <div class="preview-body" id="previewBody"></div>
                <div class="preview-page-nav" id="previewPageNav"></div>
            </div>

        </div>
    </main>
</div>
<?php include __DIR__ . '/../_form-script.php'; ?>
<script>
(function () {
    const draft      = JSON.parse(sessionStorage.getItem('postDraft') || '{}');
    const MAX_PAGES  = 3;
    const MAX_SECS   = 6;
    const MAX_PARAS  = 10;
    const CATS       = [ {v:'race_cars',l:'Race Cars'},{v:'team',l:'Team'},{v:'events',l:'Events & Competitions'},{v:'workshop',l:'Workshop'} ];

    // pages[pageIdx] = [ section, ... ]
    let pages      = [[]];
    let activePage = 0;
    let sid        = 0;
    const slotFiles = {}; // `${sid}_${slotIdx}` → File

    // Auto-add title heading on page 0
    const titleText = draft.titleSr || draft.titleEn || '';
    if (titleText) {
        pages[0].push({ id: ++sid, type: 'heading', data: { text: titleText, locked: true } });
    }

    // ── Render all ──
    function render() {
        renderTabs();
        renderEditor();
        renderPreview();
        updateAddButtons();
    }

    // ── Tabs ──
    function renderTabs() {
        const wrap = document.getElementById('pageTabs');
        wrap.innerHTML = '';
        pages.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'page-tab' + (i === activePage ? ' active' : '');
            btn.textContent = `Chapter ${i + 1}`;
            btn.onclick = () => { activePage = i; render(); };
            wrap.appendChild(btn);
        });
        if (pages.length < MAX_PAGES) {
            const add = document.createElement('button');
            add.type = 'button'; add.className = 'add-page-btn';
            add.innerHTML = '<i class="fas fa-plus"></i> Add Chapter';
            add.onclick = addPage;
            wrap.appendChild(add);
        } else {
            const hint = document.createElement('span');
            hint.className = 'page-limit-hint';
            hint.textContent = 'Max 3 chapters reached';
            wrap.appendChild(hint);
        }
    }

    function addPage() {
        if (pages.length >= MAX_PAGES) return;
        pages.push([]);
        activePage = pages.length - 1;
        render();
    }

    // ── Add / remove section ──
    window.addSection = function(type) {
        const secs = pages[activePage];
        if (secs.length >= MAX_SECS) return;
        const data = { cols: 1 };
        if (type === 'gallery') data.previews = { 0: '' }; // start with 1 empty slot
        secs.push({ id: ++sid, type, data });
        render();
    };

    function removeSection(id) {
        pages[activePage] = pages[activePage].filter(s => s.id !== id);
        render();
    }

    function updateAddButtons() {
        const count     = pages[activePage].length;
        const atSec     = count >= MAX_SECS;
        const paraCount = pages.reduce((a, p) => a + p.filter(s => s.type === 'paragraph').length, 0);
        const atPara    = paraCount >= MAX_PARAS;

        ['addHeading','addImages','addPhotoLeft','addPhotoRight','addGallery'].forEach(b => { const el = document.getElementById(b); if(el) el.disabled = atSec; });
        const paraBtn = document.getElementById('addParagraph');
        if (paraBtn) paraBtn.disabled = atSec || atPara;

        document.getElementById('sectionHint').textContent =
            `${count} / ${MAX_SECS} sections  ·  ${paraCount} / ${MAX_PARAS} paragraphs`;
    }

    // ── Editor ──
    function renderEditor() {
        const list = document.getElementById('sectionList');
        list.innerHTML = '';
        const secs = pages[activePage];
        if (!secs.length) {
            list.innerHTML = '<div style="color:#333;text-align:center;padding:2rem;font-family:Rajdhani,sans-serif;">No sections yet — add one above</div>';
            return;
        }
        secs.forEach((s, idx) => {
            const div = document.createElement('div');
            div.className = 'section-block';
            div.draggable = !s.data.locked;
            div.dataset.id = s.id;

            const icons = { heading:'fa-heading', paragraph:'fa-align-left', images:'fa-images', 'photo-left':'fa-image', 'photo-right':'fa-image', gallery:'fa-th' };
            div.innerHTML = `
                <div class="section-block-header">
                    <span class="label">
                        ${s.data.locked ? '' : '<i class="fas fa-grip-vertical drag-handle"></i>'}
                        <i class="fas ${icons[s.type]}"></i>
                        ${s.data.locked ? 'Post Title' : s.type.charAt(0).toUpperCase()+s.type.slice(1)}
                    </span>
                    <div class="section-actions">
                        ${s.data.locked
                            ? '<span style="font-size:0.62rem;color:#444;letter-spacing:1px;">AUTO</span>'
                            : `<button class="del" onclick="removeSec(${s.id})"><i class="fas fa-trash"></i></button>`}
                    </div>
                </div>
                <div class="section-block-body">${buildBody(s)}</div>`;

            // Drag events (skip locked)
            if (!s.data.locked) {
                div.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', s.id); div.classList.add('dragging'); });
                div.addEventListener('dragend',   () => div.classList.remove('dragging'));
                div.addEventListener('dragover',  e => { e.preventDefault(); div.classList.add('drag-over'); });
                div.addEventListener('dragleave', () => div.classList.remove('drag-over'));
                div.addEventListener('drop', e => {
                    e.preventDefault();
                    div.classList.remove('drag-over');
                    const fromId = parseInt(e.dataTransfer.getData('text/plain'));
                    const toId   = s.id;
                    if (fromId === toId) return;
                    const arr  = pages[activePage];
                    const fi   = arr.findIndex(x => x.id === fromId);
                    const ti   = arr.findIndex(x => x.id === toId);
                    if (fi < 0 || ti < 0) return;
                    const [item] = arr.splice(fi, 1);
                    arr.splice(ti, 0, item);
                    render();
                });
            }
            list.appendChild(div);
        });
    }

    window.removeSec = removeSection;

    function buildBody(s) {
        if (s.type === 'heading') {
            const align = s.data.align || 'left';
            return `<div class="fmt-toolbar">
                <button class="fmt-btn${align==='left'?' active':''}"   onclick="updHeadAlign(${s.id},'left')"><i class="fas fa-align-left"></i></button>
                <button class="fmt-btn${align==='center'?' active':''}" onclick="updHeadAlign(${s.id},'center')"><i class="fas fa-align-center"></i></button>
                <button class="fmt-btn${align==='right'?' active':''}"  onclick="updHeadAlign(${s.id},'right')"><i class="fas fa-align-right"></i></button>
            </div>
            <input class="builder-ta" type="text" placeholder="Section heading..."
                value="${esc(s.data.text||'')}" ${s.data.locked ? 'readonly style="opacity:0.6;"' : ''}
                style="text-align:${align};"
                oninput="upd(${s.id},'text',this.value)">`;
        }
        if (s.type === 'paragraph') {
            return `<div class="fmt-toolbar">
                <button class="fmt-btn" id="fmtB_${s.id}" onclick="fmtWrap(${s.id},'<strong>')"><b>B</b></button>
                <button class="fmt-btn" id="fmtI_${s.id}" onclick="fmtWrap(${s.id},'<em>')"><i>I</i></button>
                <button class="fmt-btn" id="fmtU_${s.id}" onclick="fmtWrap(${s.id},'<u>')"><u>U</u></button>
                <button class="fmt-btn" onclick="fmtList(${s.id},'ul')" title="Bullet list">• List</button>
                <button class="fmt-btn" onclick="fmtList(${s.id},'ol')" title="Numbered list">1. List</button>
                <button class="fmt-btn" id="fmtAL_${s.id}" onclick="fmtAlign(${s.id},'left')" title="Align left"><i class="fas fa-align-left"></i></button>
                <button class="fmt-btn" id="fmtAC_${s.id}" onclick="fmtAlign(${s.id},'center')" title="Align center"><i class="fas fa-align-center"></i></button>
                <button class="fmt-btn" id="fmtAR_${s.id}" onclick="fmtAlign(${s.id},'right')" title="Align right"><i class="fas fa-align-right"></i></button>
                <label title="Text color" style="display:flex;align-items:center;gap:4px;cursor:pointer;">
                    <span style="font-size:0.72rem;color:#888;font-family:Rajdhani,sans-serif;">Color</span>
                    <input type="color" class="fmt-color-input" value="#FFD700" onchange="fmtColor(${s.id},this.value)">
                </label>
            </div>
            <div class="wysiwyg" id="ta_${s.id}" contenteditable="true"
                data-placeholder="Write paragraph content... Select text then click B / I / U / List / Color"
                oninput="updWysiwyg(${s.id},this)">${s.data.text||''}</div>
            <div class="char-counter ok" id="cc_${s.id}">${(s.data.text||'').replace(/<[^>]*>/g,'').length} / 500</div>`;
        }
        if (s.type === 'gallery') {
            const previews = s.data.previews || {};
            const count    = Object.keys(previews).length;
            let slots = '';
            for (let i = 0; i < count; i++) {
                const prev = previews[i] || '';
                slots += `<div class="gallery-slot">
                    <div class="img-slot-wrap">
                        <div class="ph"><i class="fas fa-image"></i></div>
                        <img id="si_${s.id}_${i}" src="${prev}" style="${prev?'display:block':''}">
                        <input type="file" accept="image/*" onchange="slotUp(${s.id},${i},this)">
                    </div>
                </div>`;
            }
            return `<p style="color:#666;font-size:0.78rem;font-family:'Rajdhani',sans-serif;margin-bottom:8px;">Slideshow — click <b style="color:#FFD700;">+</b> to add up to 8 images</p>
                <div class="gallery-slots">${slots}
                    ${count < 8 ? `<div class="gallery-add-slot" onclick="addGallerySlot(${s.id})"><i class="fas fa-plus"></i></div>` : ''}
                </div>`;
        }
        if (s.type === 'photo-left' || s.type === 'photo-right') {
            const prev = s.data.previews?.[0] || '';
            const imgSlot = `<div>
                <div class="img-slot-wrap">
                    <div class="ph"><i class="fas fa-image"></i></div>
                    <img id="si_${s.id}_0" src="${prev}" style="${prev?'display:block':''}">
                    <input type="file" accept="image/*" onchange="slotUp(${s.id},0,this)">
                </div>
                <select class="slot-cat" onchange="updCat(${s.id},0,this.value)">
                    <option value="">Gallery category</option>${CATS.map(c=>`<option value="${c.v}">${c.l}</option>`).join('')}
                </select>
            </div>`;
            const textArea = `<div>
                <div class="fmt-toolbar">
                    <button class="fmt-btn" id="fmtB_${s.id}" onclick="fmtWrap(${s.id},'<strong>')"><b>B</b></button>
                    <button class="fmt-btn" id="fmtI_${s.id}" onclick="fmtWrap(${s.id},'<em>')"><i>I</i></button>
                    <button class="fmt-btn" id="fmtU_${s.id}" onclick="fmtWrap(${s.id},'<u>')"><u>U</u></button>
                    <button class="fmt-btn" onclick="fmtList(${s.id},'ul')">• List</button>
                    <button class="fmt-btn" onclick="fmtList(${s.id},'ol')">1. List</button>
                    <button class="fmt-btn" id="fmtAL_${s.id}" onclick="fmtAlign(${s.id},'left')"><i class="fas fa-align-left"></i></button>
                    <button class="fmt-btn" id="fmtAC_${s.id}" onclick="fmtAlign(${s.id},'center')"><i class="fas fa-align-center"></i></button>
                    <button class="fmt-btn" id="fmtAR_${s.id}" onclick="fmtAlign(${s.id},'right')"><i class="fas fa-align-right"></i></button>
                    <label style="display:flex;align-items:center;gap:4px;cursor:pointer;">
                        <span style="font-size:0.72rem;color:#888;font-family:Rajdhani,sans-serif;">Color</span>
                        <input type="color" class="fmt-color-input" value="#FFD700" onchange="fmtColor(${s.id},this.value)">
                    </label>
                </div>
                <div class="wysiwyg" id="ta_${s.id}" contenteditable="true"
                    data-placeholder="Write text..." data-maxtabs="5" data-maxlines="5" data-maxchars="160"
                    oninput="updWysiwyg(${s.id},this)">${s.data.text||''}</div>
                <div class="char-counter ok" id="cc_${s.id}">${(s.data.text||'').replace(/<[^>]*>/g,'').length} / 160</div>
            </div>`;
            return `<div class="side-editor">${s.type==='photo-left' ? imgSlot+textArea : textArea+imgSlot}</div>`;
        }
        if (s.type === 'images') {
            const cols = s.data.cols || 1;
            const catOpts = '<option value="">Gallery category</option>' + CATS.map(c=>`<option value="${c.v}">${c.l}</option>`).join('');
            let slots = '';
            for (let i = 0; i < cols; i++) {
                const prev = s.data.previews?.[i] || '';
                slots += `<div>
                    <div class="img-slot-wrap">
                        <div class="ph"><i class="fas fa-image"></i></div>
                        <img id="si_${s.id}_${i}" src="${prev}" style="${prev?'display:block':''}">
                        <input type="file" accept="image/*" onchange="slotUp(${s.id},${i},this)">
                    </div>
                    <select class="slot-cat" onchange="updCat(${s.id},${i},this.value)"><option value="">Gallery category</option>${CATS.map(c=>`<option value="${c.v}">${c.l}</option>`).join('')}</select>
                </div>`;
            }
            return `<div class="layout-picker">
                ${[1,2,3].map(n=>`<button class="lp-btn${cols===n?' active':''}" onclick="setCols(${s.id},${n})">${n} Photo${n>1?'s':''}</button>`).join('')}
            </div><div class="img-slots c${cols}">${slots}</div>`;
        }
        return '';
    }

    // ── Section data updates ──
    // ── WYSIWYG formatting ──
    function focusEl(id) { document.getElementById(`ta_${id}`)?.focus(); }

    window.fmtWrap = function(id, tag) {
        focusEl(id);
        const cmd = { '<strong>': 'bold', '<em>': 'italic', '<u>': 'underline' }[tag];
        if (cmd) { document.execCommand(cmd, false, null); updateFmtBtns(id); }
        saveWysiwyg(id);
    };

    function updateFmtBtns(id) {
        const btns = {
            fmtB:  'bold',
            fmtI:  'italic',
            fmtU:  'underline',
            fmtAL: 'justifyLeft',
            fmtAC: 'justifyCenter',
            fmtAR: 'justifyRight',
        };
        Object.entries(btns).forEach(([prefix, cmd]) => {
            const btn = document.getElementById(`${prefix}_${id}`);
            if (btn) btn.classList.toggle('active', document.queryCommandState(cmd));
        });
    }

    // ── Character limit enforcer — block input at 500 ──
    document.addEventListener('beforeinput', e => {
        const el = document.activeElement;
        if (!el || !el.classList.contains('wysiwyg')) return;
        if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') return;
        const max = parseInt(el.dataset.maxchars || '500');
        if ((el.innerText || '').length >= max) e.preventDefault();
    });

    // ── Enter limiter — max 10 lines / list items ──
    document.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const el = document.activeElement;
        if (!el || !el.classList.contains('wysiwyg')) return;

        const sel  = window.getSelection();
        if (!sel.rangeCount) return;
        const anchor = sel.anchorNode;
        const parent = anchor?.nodeType === Node.TEXT_NODE ? anchor.parentElement : anchor;

        // Inside a list — count li items
        const li   = parent?.closest('li');
        const list = li?.closest('ul, ol');
        if (list) {
            const maxL = parseInt(el.dataset.maxlines || '10');
            if (list.querySelectorAll('li').length >= maxL) { e.preventDefault(); }
            return;
        }

        // Plain text — count line breaks (br + div blocks)
        const maxLines = parseInt(el.dataset.maxlines || '10');
        const lines    = el.querySelectorAll('br').length + el.querySelectorAll('div').length + 1;
        if (lines >= maxLines) { e.preventDefault(); }
    });

    // ── Tab key limiter in contenteditable ──
    document.addEventListener('keydown', e => {
        if (e.key !== 'Tab') return;
        const el = document.activeElement;
        if (!el || !el.classList.contains('wysiwyg')) return;
        e.preventDefault();

        const maxTabs     = parseInt(el.dataset.maxtabs || '10');
        const tabChar     = '    ';
        const currentTabs = (el.innerText.match(/ {4}/g) || []).length;
        if (!e.shiftKey && currentTabs >= maxTabs) return;



        if (e.shiftKey) {
            // Remove one indent from start of current line
            const sel = window.getSelection();
            if (!sel.rangeCount) return;
            const range = sel.getRangeAt(0);
            const node  = range.startContainer;
            if (node.nodeType === Node.TEXT_NODE && node.textContent.startsWith('    ')) {
                node.textContent = node.textContent.slice(4);
            }
        } else {
            document.execCommand('insertText', false, tabChar);
        }

        const id = el.id.replace('ta_', '');
        saveWysiwyg(id, el);
    });

    // Update button states on selection change
    document.addEventListener('selectionchange', () => {
        const sel = window.getSelection();
        if (!sel || !sel.anchorNode) return;
        const el = sel.anchorNode.parentElement?.closest('[id^="ta_"]');
        if (!el) return;
        const id = el.id.replace('ta_', '');
        updateFmtBtns(id);
    });

    window.fmtColor = function(id, color) {
        focusEl(id);
        document.execCommand('foreColor', false, color);
        saveWysiwyg(id);
    };

    window.updHeadAlign = function(id, align) {
        const s = findSec(id); if (!s) return;
        s.data.align = align;
        renderEditor(); renderPreview();
    };

    window.fmtAlign = function(id, align) {
        focusEl(id);
        const cmds = { left: 'justifyLeft', center: 'justifyCenter', right: 'justifyRight' };
        document.execCommand(cmds[align], false, null);
        updateFmtBtns(id);
        saveWysiwyg(id);
    };

    window.fmtList = function(id, tag) {
        focusEl(id);
        document.execCommand(tag === 'ul' ? 'insertUnorderedList' : 'insertOrderedList', false, null);
        saveWysiwyg(id);
    };

    window.updWysiwyg = function(id, el) { saveWysiwyg(id, el); };

    function saveWysiwyg(id, el) {
        const div = el || document.getElementById(`ta_${id}`);
        if (!div) return;
        const html = div.innerHTML;
        const s    = findSec(id); if (s) { s.data.text = html; renderPreview(); }
        updateCounter(id, div.innerText || '');
    }

    function updateCounter(id, text) {
        const el  = document.getElementById(`cc_${id}`);
        if (!el) return;
        const ta  = document.getElementById(`ta_${id}`);
        const max = parseInt(ta?.dataset.maxchars || '500');
        const len = text.length;
        el.textContent = `${len} / ${max}`;
        el.className = 'char-counter ' + (len > max ? 'over' : len > max * 0.8 ? 'warn' : 'ok');
    }

    window.addGallerySlot = function(id) {
        const s = findSec(id); if(!s) return;
        if(!s.data.previews) s.data.previews = {};
        const idx = Object.keys(s.data.previews).length;
        if (idx >= 8) return;
        s.data.previews[idx] = ''; // placeholder
        renderEditor(); renderPreview();
    };

    window.upd = (id, key, val) => { const s = findSec(id); if(s){s.data[key]=val; renderPreview();} };
    window.setCols = (id, n) => { const s = findSec(id); if(s){s.data.cols=n; render();} };
    window.updCat  = (id, i, val) => { const s = findSec(id); if(s){if(!s.data.cats)s.data.cats={};s.data.cats[i]=val;} };
    window.slotUp  = (id, i, inp) => {
        const file = inp.files[0]; if(!file) return;
        slotFiles[`${id}_${i}`] = file;
        const r = new FileReader();
        r.onload = e => {
            const img = document.getElementById(`si_${id}_${i}`);
            if(img){img.src=e.target.result;img.style.display='block';}
            const s = findSec(id); if(s){if(!s.data.previews)s.data.previews={};s.data.previews[i]=e.target.result;}
            renderPreview();
        };
        r.readAsDataURL(file);
    };

    function findSec(id) {
        for (const p of pages) { const s = p.find(x=>x.id===id); if(s) return s; }
        return null;
    }

    // ── Preview ──
    function renderPreview() {
        document.getElementById('prevPageLabel').textContent = `Chapter ${activePage+1} of ${pages.length}`;

        const body = document.getElementById('previewBody');
        const secs = pages[activePage];
        if (!secs.length) {
            body.innerHTML = '<div class="preview-empty">Add sections to see preview</div>';
        } else {
            body.innerHTML = `<div class="prev-post-wrap">` + secs.map(s => {
                if (s.type === 'heading') {
                    if (s.data.locked) {
                        return `<div class="prev-post-header">
                            ${draft.category ? `<div class="prev-cat-tag">${draft.category}</div>` : ''}
                            <h1>${esc(s.data.text||'Untitled')}</h1>
                            <div class="prev-meta">
                                <span><i class="far fa-calendar"></i> ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</span>
                                <span><i class="far fa-user"></i> Manager</span>
                            </div>
                        </div>
                        ${draft.coverImage ? `<div class="prev-featured-img"><img src="${draft.coverImage}"></div>` : ''}`;
                    }
                    const ha = s.data.align || 'left';
                    const hBorder = ha === 'center'
                        ? 'border-left:2px solid #FFD700;border-right:2px solid #FFD700;padding:0 10px;'
                        : ha === 'right'
                            ? 'border-left:none;border-right:2px solid #FFD700;padding-right:10px;padding-left:0;'
                            : '';
                    return `<div class="prev-heading" style="text-align:${ha};${hBorder}">${esc(s.data.text||'')}</div>`;
                }
                if (s.type === 'paragraph') return `<div class="prev-para">${(s.data.text||'').replace(/\n/g,'<br>')}</div>`;
                if (s.type === 'photo-left' || s.type === 'photo-right') {
                    const prev = s.data.previews?.[0] || '';
                    const img  = prev ? `<img src="${prev}">` : `<div class="no-img"><i class="fas fa-image"></i></div>`;
                    const txt  = `<div class="prev-side-text">${s.data.text || '<span style="color:#333">Text here...</span>'}</div>`;
                    return `<div class="prev-side">${s.type==='photo-left' ? img+txt : txt+img}</div>`;
                }
                if (s.type === 'gallery') {
                    const previews = Object.values(s.data.previews||{}).filter(Boolean);
                    if (!previews.length) return `<div style="background:#0a0a0a;border-radius:8px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;color:#2a2a2a;margin:0.8rem 0;"><i class="fas fa-th"></i></div>`;
                    const gid = `g_${s.id}`;
                    const slides = previews.map(src=>`<img src="${src}">`).join('');
                    const dots   = previews.map((_,i)=>`<span class="${i===0?'active':''}"></span>`).join('');
                    return `<div class="prev-gallery" id="${gid}">
                        <div class="prev-gallery-slides" id="${gid}_slides">${slides}</div>
                        ${previews.length>1?`<button class="prev-gallery-btn left"  onclick="gPrev('${gid}')"><i class="fas fa-chevron-left"></i></button>
                        <button class="prev-gallery-btn right" onclick="gNext('${gid}')"><i class="fas fa-chevron-right"></i></button>`:''}
                        <div class="prev-gallery-dots" id="${gid}_dots">${dots}</div>
                    </div>`;
                }
                if (s.type === 'images') {
                    const cols = s.data.cols || 1;
                    const previews = s.data.previews || {};
                    let imgs = '';
                    for (let i = 0; i < cols; i++) {
                        imgs += previews[i]
                            ? `<img src="${previews[i]}">`
                            : `<div class="no-img"><i class="fas fa-image"></i></div>`;
                    }
                    return `<div class="prev-imgs c${cols}">${imgs}</div>`;
                }
                return '';
            }).join('') + `</div>`;
        }

        // Page dots
        const nav = document.getElementById('previewPageNav');
        nav.innerHTML = pages.map((_,i) =>
            `<div class="prev-page-dot${i===activePage?' active':''}" onclick="switchPage(${i})"></div>`
        ).join('');
    }

    window.switchPage = function(i) { activePage = i; render(); };

    // Gallery carousel controls
    const galleryState = {};
    window.gNext = function(gid) {
        const slides = document.getElementById(gid+'_slides');
        if (!slides) return;
        const count = slides.children.length;
        if (!galleryState[gid]) galleryState[gid] = 0;
        galleryState[gid] = (galleryState[gid] + 1) % count;
        slides.style.transform = `translateX(-${galleryState[gid]*100}%)`;
        updateDots(gid, count);
    };
    window.gPrev = function(gid) {
        const slides = document.getElementById(gid+'_slides');
        if (!slides) return;
        const count = slides.children.length;
        if (!galleryState[gid]) galleryState[gid] = 0;
        galleryState[gid] = (galleryState[gid] - 1 + count) % count;
        slides.style.transform = `translateX(-${galleryState[gid]*100}%)`;
        updateDots(gid, count);
    };
    function updateDots(gid, count) {
        const dotsEl = document.getElementById(gid+'_dots');
        if (!dotsEl) return;
        dotsEl.querySelectorAll('span').forEach((d,i) => d.classList.toggle('active', i===galleryState[gid]));
    }

    // ── Submit ──
    window.savePost = async function() {
        const msg = document.getElementById('saveMsg');
        const btn = document.querySelector('.btn-submit');
        const totalSecs = pages.reduce((a,p)=>a+p.length,0);
        if (totalSecs === 0) { showMsg('error','Add at least one section.'); return; }

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        // 1. Upload gallery images
        for (const p of pages) {
            for (const s of p) {
                if (s.type !== 'images') continue;
                const cols = s.data.cols || 1;
                for (let i = 0; i < cols; i++) {
                    const file = slotFiles[`${s.id}_${i}`];
                    const cat  = s.data.cats?.[i];
                    if (!file || !cat) continue;
                    const fd = new FormData();
                    fd.append('image', file); fd.append('category', cat); fd.append('title', draft.titleSr||'');
                    try { await fetch('/backend/api/gallery', { method: 'POST', body: fd }); } catch {}
                }
            }
        }

        // 2. Build HTML per page, combine
        const htmlPages = pages.map((secs, pi) =>
            (pi > 0 ? `<hr style="border-color:rgba(255,215,0,0.15);margin:2rem 0;">` : '') +
            secs.map(s => {
                if (s.type === 'heading')   return s.data.locked ? '' : `<h2>${esc(s.data.text||'')}</h2>`;
                if (s.type === 'paragraph') return `<p>${esc(s.data.text||'').replace(/\n/g,'<br>')}</p>`;
                if (s.type === 'images') {
                    const cols = s.data.cols || 1;
                    const previews = s.data.previews || {};
                    const imgs = Object.values(previews).map(src=>`<img src="${src}" style="width:100%;border-radius:8px;">`).join('');
                    return `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px;margin:1rem 0;">${imgs}</div>`;
                }
                return '';
            }).join('\n')
        ).join('\n');

        // 3. Submit post request
        const fd = new FormData();
        fd.append('type','post');
        fd.append('title_sr', draft.titleSr||''); fd.append('title_en', draft.titleEn||'');
        fd.append('content_sr', htmlPages); fd.append('content_en', htmlPages);
        fd.append('category', draft.category||''); fd.append('image_position','50% 50%');

        try {
            const res  = await fetch('/backend/api/requests', { method:'POST', body: fd });
            const data = await res.json();
            if (data.success) {
                sessionStorage.removeItem('postDraft');
                showMsg('success','Post submitted for admin approval!');
                setTimeout(() => window.location.href = '../dashboard.php', 1800);
            } else { showMsg('error', data.message || 'Error submitting.'); }
        } catch { showMsg('error','Network error.'); }

        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Post';
    };

    function showMsg(t, txt) {
        const el = document.getElementById('saveMsg');
        el.style.display = 'block';
        el.style.background = t==='success' ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)';
        el.style.border     = t==='success' ? '1px solid rgba(40,167,69,0.3)' : '1px solid rgba(220,53,69,0.3)';
        el.style.color      = t==='success' ? '#5cb85c' : '#e74c3c';
        el.textContent = txt;
    }

    function esc(str) {
        if (!str) return '';
        const d = document.createElement('div'); d.textContent = str; return d.innerHTML;
    }

    render();
})();
</script>
</body>
</html>
