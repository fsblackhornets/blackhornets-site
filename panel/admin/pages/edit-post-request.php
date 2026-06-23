<?php
require_once __DIR__ . '/../auth_check.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Post Request</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/panel/admin/css/dashboard.css">
    <!-- Reuse manager builder styles -->
    <link href="https://fonts.googleapis.com/css2?family=Michroma&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
    /* Inherit builder CSS inline from manager */
    </style>
</head>
<body>
<div class="dashboard-container">
    <?php include __DIR__ . '/../components/admin_navbar.php'; ?>
    <main class="main-content">
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
            <h1 style="color:var(--primary-color);font-size:1.4rem;margin:0;"><i class="fas fa-edit"></i> Edit Post Request</h1>
            <a href="content-requests.php" style="color:#888;text-decoration:none;font-size:0.85rem;"><i class="fas fa-arrow-left"></i> Back to Requests</a>
        </div>

        <div id="noData" style="display:none;color:#e74c3c;padding:1rem;">No post data found. <a href="content-requests.php" style="color:#FFD700;">Back to requests</a></div>

        <!-- Post info (read-only header) -->
        <div id="postInfo" style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.15);border-radius:10px;padding:1rem 1.4rem;margin-bottom:1.5rem;display:none;">
            <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:center;">
                <div><span style="color:#666;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;font-family:'Michroma',sans-serif;">Request</span><div id="infoId" style="color:#FFD700;font-weight:600;"></div></div>
                <div><span style="color:#666;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;font-family:'Michroma',sans-serif;">Title</span><div id="infoTitle" style="color:#e0e0e0;"></div></div>
                <div><span style="color:#666;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;font-family:'Michroma',sans-serif;">Category</span><div id="infoCategory" style="color:#e0e0e0;"></div></div>
            </div>
        </div>

        <!-- Editable fields -->
        <div id="editorWrap" style="display:none;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
                <div>
                    <label style="display:block;color:#888;font-size:0.78rem;margin-bottom:5px;font-family:'Rajdhani',sans-serif;letter-spacing:0.5px;">TITLE (SERBIAN)</label>
                    <input type="text" id="editTitleSr" style="width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#e0e0e0;font-family:'Rajdhani',sans-serif;font-size:0.95rem;outline:none;">
                </div>
                <div>
                    <label style="display:block;color:#888;font-size:0.78rem;margin-bottom:5px;font-family:'Rajdhani',sans-serif;letter-spacing:0.5px;">TITLE (ENGLISH)</label>
                    <input type="text" id="editTitleEn" style="width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#e0e0e0;font-family:'Rajdhani',sans-serif;font-size:0.95rem;outline:none;">
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
                <div>
                    <label style="display:block;color:#888;font-size:0.78rem;margin-bottom:5px;font-family:'Rajdhani',sans-serif;letter-spacing:0.5px;">CATEGORY</label>
                    <select id="editCategory" style="width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#e0e0e0;font-family:'Rajdhani',sans-serif;font-size:0.95rem;outline:none;">
                        <option value="Technology">Technology</option>
                        <option value="Events">Events</option>
                        <option value="Competitions">Competitions</option>
                        <option value="Team Updates">Team Updates</option>
                    </select>
                </div>
                <div>
                    <label style="display:block;color:#888;font-size:0.78rem;margin-bottom:5px;font-family:'Rajdhani',sans-serif;letter-spacing:0.5px;">ADMIN NOTES</label>
                    <input type="text" id="editNotes" placeholder="Optional note for manager..." style="width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#e0e0e0;font-family:'Rajdhani',sans-serif;font-size:0.95rem;outline:none;">
                </div>
            </div>

            <!-- Content editor -->
            <div style="margin-bottom:1.5rem;">
                <label style="display:block;color:#888;font-size:0.78rem;margin-bottom:8px;font-family:'Rajdhani',sans-serif;letter-spacing:0.5px;">POST CONTENT</label>
                <div id="contentEditor" contenteditable="true" style="
                    min-height:300px;padding:16px;background:rgba(255,255,255,0.03);
                    border:1px solid rgba(255,255,255,0.1);border-radius:10px;
                    color:#e0e0e0;font-family:'Rajdhani',sans-serif;font-size:0.95rem;
                    line-height:1.75;outline:none;word-break:break-word;
                " data-placeholder="Post content (HTML supported)..."></div>
            </div>

            <!-- Actions -->
            <div style="display:flex;gap:1rem;justify-content:flex-end;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.06);">
                <a href="content-requests.php" style="padding:11px 22px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:none;color:#888;font-family:'Michroma',sans-serif;font-size:0.78rem;letter-spacing:1px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;"><i class="fas fa-times"></i> Cancel</a>
                <button onclick="handleDecline()" style="padding:11px 22px;border-radius:8px;border:1px solid rgba(220,53,69,0.3);background:rgba(220,53,69,0.15);color:#e74c3c;font-family:'Michroma',sans-serif;font-size:0.78rem;letter-spacing:1px;cursor:pointer;"><i class="fas fa-times"></i> Decline</button>
                <button onclick="handleApprove()" style="padding:11px 22px;border-radius:8px;border:1px solid rgba(40,167,69,0.3);background:rgba(40,167,69,0.15);color:#5cb85c;font-family:'Michroma',sans-serif;font-size:0.78rem;letter-spacing:1px;cursor:pointer;"><i class="fas fa-check"></i> Save &amp; Approve</button>
            </div>
        </div>
    </main>
</div>

<script>
const editData = JSON.parse(sessionStorage.getItem('adminPostEdit') || 'null');

if (!editData || !editData.requestId) {
    document.getElementById('noData').style.display = 'block';
} else {
    document.getElementById('postInfo').style.display = 'block';
    document.getElementById('editorWrap').style.display = 'block';

    document.getElementById('infoId').textContent  = `#${editData.requestId}`;
    document.getElementById('infoTitle').textContent = editData.titleSr || editData.titleEn || '—';
    document.getElementById('infoCategory').textContent = editData.category || '—';

    document.getElementById('editTitleSr').value   = editData.titleSr || '';
    document.getElementById('editTitleEn').value   = editData.titleEn || '';
    document.getElementById('editCategory').value  = editData.category || 'Technology';
    document.getElementById('contentEditor').innerHTML = editData.content || '';
}

async function handleApprove() {
    const edited = {
        title_sr:   document.getElementById('editTitleSr').value.trim(),
        title_en:   document.getElementById('editTitleEn').value.trim(),
        content_sr: document.getElementById('contentEditor').innerHTML,
        content_en: document.getElementById('contentEditor').innerHTML,
        category:   document.getElementById('editCategory').value,
        image_position: editData.coverImage || '50% 50%',
    };
    const notes = document.getElementById('editNotes').value.trim();

    const res  = await fetch(`/backend/api/requests/${editData.requestId}/review`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editData.requestId, action: 'approve', notes, editedData: edited })
    });
    const data = await res.json();
    if (data.success) {
        sessionStorage.removeItem('adminPostEdit');
        alert('Post approved and published!');
        window.location.href = 'content-requests.php';
    } else {
        alert('Error: ' + data.message);
    }
}

async function handleDecline() {
    const notes = document.getElementById('editNotes').value.trim();
    const res   = await fetch(`/backend/api/requests/${editData.requestId}/review`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editData.requestId, action: 'decline', notes })
    });
    const data = await res.json();
    if (data.success) {
        sessionStorage.removeItem('adminPostEdit');
        window.location.href = 'content-requests.php';
    } else {
        alert('Error: ' + data.message);
    }
}
</script>
</body>
</html>
