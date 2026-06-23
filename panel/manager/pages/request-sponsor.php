<?php require_once __DIR__ . '/../auth_check.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request: Add Sponsor</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/panel/manager/manager.css">
    <?php include __DIR__ . '/../_form-styles.php'; ?>
    <style>
    .sponsor-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: start;
    }

    /* ── Preview ── */
    .sponsor-preview-wrap { position: sticky; top: 80px; display: flex; flex-direction: column; align-items: center; gap: 0.8rem; }
    .preview-label { font-size: 0.68rem; letter-spacing: 2px; text-transform: uppercase; color: #555; font-family: 'Michroma', sans-serif; }

    .p-tier-badge {
        font-family: 'Michroma', sans-serif; font-size: 0.72rem;
        letter-spacing: 2px; text-transform: uppercase;
        color: #FFD700; border: 1px solid rgba(255,215,0,0.3);
        padding: 4px 14px; border-radius: 20px;
        background: rgba(255,215,0,0.08);
    }
    .p-tier-badge.hidden { display: none; }

    .p-sponsor-item {
        text-align: center; position: relative;
        padding: 30px; border-radius: 15px;
        background: #111; width: 100%; max-width: 280px;
        border: 1px solid rgba(255,215,0,0.1);
        transition: all 0.3s ease; cursor: pointer;
    }
    .p-sponsor-item:hover { transform: translateY(-8px); border-color: rgba(255,215,0,0.35); box-shadow: 0 15px 35px rgba(255,215,0,0.15); }

    .p-sponsor-logo {
        width: 160px; height: 160px;
        object-fit: contain; margin: 0 auto; display: block;
        border-radius: 12px; padding: 16px;
        background: rgba(255,255,255,0.02);
        filter: grayscale(30%) brightness(1.1);
        transition: all 0.3s ease;
    }
    .p-sponsor-item:hover .p-sponsor-logo { filter: grayscale(0%) brightness(1.2); box-shadow: 0 10px 30px rgba(255,215,0,0.25); }

    .p-placeholder {
        width: 160px; height: 160px;
        background: linear-gradient(145deg,#FFD700,#ffed4e);
        border-radius: 12px; margin: 0 auto;
        display: flex; align-items: center; justify-content: center;
        font-size: 3.5rem; font-weight: bold; color: #111;
        text-transform: uppercase;
    }

    .p-sponsor-name {
        margin-top: 12px; color: #e0e0e0;
        font-family: 'Rajdhani', sans-serif; font-size: 1rem; font-weight: 600;
    }
    .p-sponsor-name.empty { color: #333; }

    /* Hover overlay */
    .p-hover-info {
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.92);
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        padding: 20px; border-radius: 15px;
        opacity: 0; visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
        z-index: 2;
    }
    .p-sponsor-item:hover .p-hover-info { opacity: 1; visibility: visible; }
    .p-hover-name { color: #FFD700; font-family: 'Rajdhani', sans-serif; font-size: 1.1rem; font-weight: 700; margin: 0 0 8px; }
    .p-hover-desc { color: #ccc; font-size: 0.82rem; line-height: 1.5; margin: 0 0 12px; text-align: center; }
    .p-hover-website {
        display: inline-block; font-size: 0.8rem; color: #111;
        background: #FFD700; text-decoration: none;
        padding: 5px 14px; border-radius: 20px; font-weight: 600;
    }

    @media (max-width: 900px) {
        .sponsor-layout { grid-template-columns: 1fr; }
        .sponsor-preview-wrap { position: static; }
    }
    </style>
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
            <div class="sponsor-layout">

                <!-- Left: Form -->
                <div class="form-section">
                    <h3><i class="fas fa-handshake"></i> Sponsor Details</h3>
                    <div class="form-grid">
                        <div class="form-group"><label>Sponsor Name *</label><input type="text" id="f_name" name="name" required></div>
                        <div class="form-group">
                            <label>Tier *</label>
                            <select id="f_tier" name="tier" required>
                                <option value="">Select tier</option>
                                <option value="Institucija">Institucija</option>
                                <option value="F1 - Platinum">F1 - Platinum</option>
                                <option value="F2 - Gold">F2 - Gold</option>
                                <option value="F3 - Silver">F3 - Silver</option>
                                <option value="F4 - Bronze">F4 - Bronze</option>
                                <option value="Friends of the Project">Friends of the Project</option>
                            </select>
                        </div>
                        <div class="form-group"><label>Website</label><input type="url" id="f_website" name="website" placeholder="https://..."></div>
                        <div class="form-group"><label>Logo</label><input type="file" id="f_logo" name="logo" accept="image/*,.svg"></div>
                        <input type="hidden" id="f_image_position" name="image_position" value="50% 50%">
                        <div id="posDisplay" style="display:none;font-size:0.65rem;color:#555;font-family:Michroma,sans-serif;letter-spacing:1px;margin-top:4px;">position: <span id="posVal">50% 50%</span></div>
                    </div>
                    <div class="form-group">
                        <label>Description (Serbian)</label>
                        <textarea id="f_desc_sr" name="description_sr" rows="3" style="width:100%;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-family:Poppins,sans-serif;resize:vertical;"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Description (English)</label>
                        <textarea id="f_desc_en" name="description_en" rows="3" style="width:100%;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-family:Poppins,sans-serif;resize:vertical;"></textarea>
                    </div>
                </div>

                <!-- Right: Live Preview -->
                <div class="sponsor-preview-wrap">
                    <div class="preview-label">Live Preview</div>
                    <div class="p-tier-badge hidden" id="pTierBadge"></div>
                    <div class="p-sponsor-item">
                        <div class="p-placeholder" id="pPlaceholder">S</div>
                        <div id="pLogoWrap" style="display:none;width:160px;height:160px;margin:0 auto;overflow:hidden;cursor:grab;user-select:none;border-radius:12px;position:relative;background:rgba(255,255,255,0.02);">
                            <img id="pLogo" src="" alt="" style="position:absolute;top:50%;left:50%;width:100%;height:100%;object-fit:cover;transform:translate(-50%,-50%) scale(1.5);transform-origin:center;display:block;">
                            <div style="position:absolute;bottom:4px;right:5px;z-index:3;"><span style="color:rgba(255,215,0,0.6);font-size:0.58rem;font-family:Michroma,sans-serif;letter-spacing:1px;">DRAG</span></div>
                        </div>
                        <div class="p-sponsor-name empty" id="pName">Sponsor name</div>
                        <div class="p-hover-info">
                            <div class="p-hover-name" id="pHoverName">Sponsor name</div>
                            <div class="p-hover-desc" id="pHoverDesc" style="display:none;"></div>
                            <a class="p-hover-website" id="pHoverWebsite" href="#" target="_blank" style="display:none;"><i class="fas fa-external-link-alt"></i> Visit Website</a>
                        </div>
                    </div>
                    <p style="color:#555;font-size:0.75rem;text-align:center;margin-top:0.5rem;">Hover card to see details overlay</p>
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
    const pPlaceholder = document.getElementById('pPlaceholder');
    const pLogo        = document.getElementById('pLogo');
    const pName        = document.getElementById('pName');
    const pHoverName   = document.getElementById('pHoverName');
    const pHoverDesc   = document.getElementById('pHoverDesc');
    const pHoverWebsite= document.getElementById('pHoverWebsite');
    const pTierBadge   = document.getElementById('pTierBadge');

    function update() {
        const name    = document.getElementById('f_name').value.trim();
        const tier    = document.getElementById('f_tier').value;
        const website = document.getElementById('f_website').value.trim();
        const descEn  = document.getElementById('f_desc_en').value.trim();
        const descSr  = document.getElementById('f_desc_sr').value.trim();
        const desc    = descEn || descSr;

        pPlaceholder.textContent = name ? name.charAt(0).toUpperCase() : 'S';
        pName.textContent = name || 'Sponsor name';
        pName.className   = 'p-sponsor-name' + (name ? '' : ' empty');
        pHoverName.textContent = name || 'Sponsor name';

        if (tier) {
            pTierBadge.textContent = tier;
            pTierBadge.classList.remove('hidden');
        } else {
            pTierBadge.classList.add('hidden');
        }

        if (desc) {
            pHoverDesc.textContent = desc.length > 120 ? desc.substring(0,117) + '...' : desc;
            pHoverDesc.style.display = '';
        } else {
            pHoverDesc.style.display = 'none';
        }

        if (website) {
            pHoverWebsite.href = website;
            pHoverWebsite.style.display = '';
        } else {
            pHoverWebsite.style.display = 'none';
        }
    }

    const pLogoWrap  = document.getElementById('pLogoWrap');
    const posInput   = document.getElementById('f_image_position');
    const posDisplay = document.getElementById('posDisplay');
    const posValEl   = document.getElementById('posVal');
    let isDragging = false, startX = 0, startY = 0, tx = 0, ty = 0, imgScale = 1.5;

    function applyPos() {
        pLogo.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${imgScale})`;
        const pos = `${Math.round(50 - tx)}% ${Math.round(50 - ty)}%`;
        posInput.value = pos; posValEl.textContent = pos;
    }
    pLogoWrap.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; startY = e.clientY; pLogoWrap.style.cursor = 'grabbing'; e.preventDefault(); });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        tx += e.clientX - startX; ty += e.clientY - startY;
        startX = e.clientX; startY = e.clientY; applyPos();
    });
    window.addEventListener('mouseup', () => { isDragging = false; pLogoWrap.style.cursor = 'grab'; });
    pLogoWrap.addEventListener('wheel', e => { e.preventDefault(); imgScale = Math.max(1, Math.min(4, imgScale - e.deltaY * 0.003)); applyPos(); }, { passive: false });

    document.getElementById('f_logo').addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                pLogo.src = e.target.result;
                pLogoWrap.style.display = 'block';
                pPlaceholder.style.display = 'none';
                posDisplay.style.display = 'block';
                tx = 0; ty = 0; imgScale = 1.5; applyPos();
            };
            reader.readAsDataURL(file);
        } else {
            pLogoWrap.style.display = 'none';
            pPlaceholder.style.display = 'flex';
            posDisplay.style.display = 'none';
        }
    });

    ['f_name','f_website','f_desc_sr','f_desc_en'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', update);
    });
    document.getElementById('f_tier')?.addEventListener('change', update);

    update();
})();
</script>
</body>
</html>
