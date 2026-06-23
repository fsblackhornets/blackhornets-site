<?php
require_once __DIR__ . '/../auth_check.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Requests - Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../css/dashboard.css">
    <style>
    .filters { display:flex; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap; align-items:center; }
    .filters select { padding:8px 12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:var(--text-light); font-family:'Poppins',sans-serif; }
    .create-btns { display:flex; gap:0.6rem; flex-wrap:wrap; margin-left:auto; }
    .btn-create { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; border:1px solid rgba(255,215,0,0.3); background:rgba(255,215,0,0.08); color:#FFD700; font-family:'Poppins',sans-serif; font-size:0.8rem; font-weight:600; cursor:pointer; text-decoration:none; transition:all 0.2s; }
    .btn-create:hover { background:rgba(255,215,0,0.16); border-color:#FFD700; }

    .req-table { width:100%; border-collapse:collapse; }
    .req-table th, .req-table td { padding:12px 14px; text-align:left; border-bottom:1px solid rgba(255,255,255,0.06); }
    .req-table th { color:var(--primary-color); font-size:0.82rem; text-transform:uppercase; letter-spacing:1px; }
    .req-table td { color:var(--text-light); font-size:0.9rem; }
    .req-table tr:hover td { background:rgba(255,255,255,0.02); }
    .badge { padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:600; }
    .badge-pending  { background:rgba(255,179,0,0.15); color:#FFB300; }
    .badge-approved { background:rgba(40,167,69,0.15); color:#5cb85c; }
    .badge-declined { background:rgba(220,53,69,0.15); color:#e74c3c; }
    .type-badge { padding:3px 10px; border-radius:20px; font-size:0.75rem; background:rgba(255,255,255,0.08); color:#ccc; }
    .btn-action { padding:5px 12px; border-radius:6px; border:none; cursor:pointer; font-size:0.8rem; font-family:'Poppins',sans-serif; font-weight:500; margin-right:4px; }
    .btn-approve { background:rgba(40,167,69,0.2); color:#5cb85c; border:1px solid rgba(40,167,69,0.3); }
    .btn-approve:hover { background:rgba(40,167,69,0.35); }
    .btn-decline { background:rgba(220,53,69,0.2); color:#e74c3c; border:1px solid rgba(220,53,69,0.3); }
    .btn-decline:hover { background:rgba(220,53,69,0.35); }
    .btn-edit { background:rgba(255,215,0,0.1); color:#FFD700; border:1px solid rgba(255,215,0,0.25); }
    .btn-edit:hover { background:rgba(255,215,0,0.2); }
    .btn-view { background:rgba(255,255,255,0.06); color:#ccc; border:1px solid rgba(255,255,255,0.1); }

    /* Modal */
    .modal-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999; align-items:center; justify-content:center; }
    .modal-overlay.open { display:flex; }
    .modal-box { background:#1a1a1a; border:1px solid rgba(255,215,0,0.2); border-radius:14px; padding:2rem; max-width:720px; width:95%; max-height:90vh; overflow-y:auto; position:relative; }
    .modal-title { color:var(--primary-color); font-size:1.1rem; font-weight:600; margin-bottom:1.2rem; display:flex; align-items:center; gap:10px; }
    .modal-close { position:absolute; top:1rem; right:1rem; background:none; border:none; color:#888; font-size:1.2rem; cursor:pointer; }
    .modal-tabs { display:flex; gap:4px; margin-bottom:1.2rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:0; }
    .modal-tab { padding:7px 16px; border:none; background:none; color:#666; font-family:'Poppins',sans-serif; font-size:0.82rem; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; transition:all 0.2s; }
    .modal-tab.active { color:#FFD700; border-bottom-color:#FFD700; }

    /* View tab */
    .data-row { display:flex; gap:1rem; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
    .data-label { color:var(--text-gray); font-size:0.82rem; min-width:140px; font-weight:500; text-transform:capitalize; }
    .data-value { color:var(--text-light); font-size:0.88rem; flex:1; word-break:break-word; }

    /* Edit tab */
    .edit-field { margin-bottom:1rem; }
    .edit-field label { display:block; color:#999; font-size:0.78rem; margin-bottom:5px; text-transform:capitalize; font-family:'Poppins',sans-serif; }
    .edit-field input, .edit-field textarea, .edit-field select {
        width:100%; padding:9px 12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
        border-radius:8px; color:#e0e0e0; font-family:'Poppins',sans-serif; font-size:0.88rem; outline:none;
    }
    .edit-field textarea { resize:vertical; min-height:80px; }
    .edit-field input:focus, .edit-field textarea:focus, .edit-field select:focus { border-color:rgba(255,215,0,0.4); }

    .notes-input { width:100%; padding:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:#fff; font-family:'Poppins',sans-serif; resize:vertical; margin-top:1rem; }
    .modal-actions { display:flex; gap:0.8rem; margin-top:1.5rem; justify-content:flex-end; flex-wrap:wrap; }

    .status-bar { padding:10px 14px; border-radius:8px; background:rgba(255,255,255,0.04); color:var(--text-gray); font-size:0.85rem; margin-bottom:1rem; }
    </style>
</head>
<body>
<div class="dashboard-container">
    <?php include __DIR__ . '/../components/admin_navbar.php'; ?>
    <main class="main-content">
        <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
            <h1 style="color:var(--primary-color);font-size:1.6rem;margin:0;"><i class="fas fa-inbox"></i> Content Requests</h1>
            <span id="pendingCount" style="background:rgba(255,179,0,0.15);color:#FFB300;padding:6px 16px;border-radius:20px;font-size:0.9rem;font-weight:600;"></span>
        </div>

        <div class="card">
            <div class="filters">
                <select id="filterStatus">
                    <option value="pending">Pending</option>
                    <option value="all">All</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                </select>
                <select id="filterType">
                    <option value="all">All Types</option>
                    <option value="member">Member</option>
                    <option value="post">Post</option>
                    <option value="project">Project</option>
                    <option value="sponsor">Sponsor</option>
                </select>
                <div class="create-btns">
                    <a href="add-edit-post.php" class="btn-create"><i class="fas fa-newspaper"></i> New Post</a>
                    <a href="add-edit-project.php" class="btn-create"><i class="fas fa-project-diagram"></i> New Project</a>
                    <a href="add-edit-sponsor.php" class="btn-create"><i class="fas fa-handshake"></i> New Sponsor</a>
                    <a href="add_user.php" class="btn-create"><i class="fas fa-user-plus"></i> New Member</a>
                </div>
            </div>

            <table class="req-table">
                <thead>
                    <tr>
                        <th>#</th><th>Type</th><th>Summary</th><th>Submitted By</th><th>Date</th><th>Status</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody id="reqBody">
                    <tr><td colspan="7" style="text-align:center;color:var(--text-gray);">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </main>
</div>

<!-- Review Modal -->
<div class="modal-overlay" id="reviewModal">
    <div class="modal-box">
        <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
        <div class="modal-title" id="modalTitle"></div>

        <div id="modalData"></div>
        <div id="statusBar" class="status-bar" style="display:none;"></div>

        <div>
            <label style="color:var(--text-gray);font-size:0.82rem;font-weight:500;display:block;margin-top:1rem;">Admin Notes (optional)</label>
            <textarea id="adminNotes" class="notes-input" rows="2" placeholder="Add a note for the manager..."></textarea>
        </div>
        <div class="modal-actions" id="modalActions"></div>
    </div>
</div>

<script>
let currentReq = null;

// ── Load requests ──
function loadRequests() {
    const status = document.getElementById('filterStatus').value;
    const type   = document.getElementById('filterType').value;
    fetch(`/backend/api/requests?status=${status}&type=${type}`)
        .then(r => r.json())
        .then(data => {
            const pending = data.data?.filter(r => r.status === 'pending').length || 0;
            document.getElementById('pendingCount').textContent = `${pending} pending`;
            const tbody = document.getElementById('reqBody');
            if (!data.success || !data.data.length) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-gray);">No requests found</td></tr>';
                return;
            }
            tbody.innerHTML = data.data.map(req => {
                const d = req.data;
                const summary = req.type === 'member' ? (d.full_name||'-') : req.type === 'post' ? (d.title_sr||'-') : req.type === 'project' ? (d.name||'-') : req.type === 'sponsor' ? (d.name||'-') : '-';
                const badge = `<span class="badge badge-${req.status}">${req.status}</span>`;
                const date  = new Date(req.created_at).toLocaleDateString();
                let actions = '';
                if (req.status === 'pending') {
                    actions = `<button class="btn-action btn-edit" onclick='openModal(${JSON.stringify(req).replace(/'/g,"&#39;")})'><i class="fas fa-edit"></i> Review</button>`;
                } else {
                    actions = `<button class="btn-action btn-view" onclick='openModal(${JSON.stringify(req).replace(/'/g,"&#39;")})'><i class="fas fa-eye"></i> View</button>`;
                }
                return `<tr><td>${req.id}</td><td><span class="type-badge">${req.type}</span></td><td>${summary}</td><td>${req.submitter_name||'-'}</td><td>${date}</td><td>${badge}</td><td>${actions}</td></tr>`;
            }).join('');
        });
}

// ── Open modal ──
function openModal(req) {
    currentReq = req;
    document.getElementById('modalTitle').textContent = `#${req.id} — ${req.type} request by ${req.submitter_name}`;
    document.getElementById('adminNotes').value = req.admin_notes || '';

    const d = req.data;
    document.getElementById('modalData').innerHTML = Object.entries(d)
        .map(([k, v]) => `<div class="data-row"><span class="data-label">${k.replace(/_/g,' ')}</span><span class="data-value">${v||'—'}</span></div>`)
        .join('');

    const isPending = req.status === 'pending';

    // Status bar for reviewed requests
    const bar = document.getElementById('statusBar');
    if (!isPending) {
        bar.style.display = 'block';
        bar.innerHTML = `<b>Status:</b> ${req.status}${req.admin_notes ? ` — "${req.admin_notes}"` : ''}`;
    } else {
        bar.style.display = 'none';
    }

    const actions = document.getElementById('modalActions');
    actions.innerHTML = isPending ? `
        <button class="btn-action btn-decline" onclick="submitReview('decline')"><i class="fas fa-times"></i> Decline</button>
        <button class="btn-action btn-approve" onclick="submitReview('approve')"><i class="fas fa-check"></i> Approve</button>
    ` : '';

    document.getElementById('reviewModal').classList.add('open');
}

function closeModal() {
    document.getElementById('reviewModal').classList.remove('open');
    currentReq = null;
}

// ── Submit review ──
async function submitReview(action) {
    if (!currentReq) return;
    const notes = document.getElementById('adminNotes').value.trim();
    const body = { id: currentReq.id, action, notes };

    const res  = await fetch(`/backend/api/requests/${currentReq.id}/review`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) { closeModal(); loadRequests(); }
    else alert('Error: ' + data.message);
}

document.getElementById('filterStatus').addEventListener('change', loadRequests);
document.getElementById('filterType').addEventListener('change', loadRequests);
document.getElementById('reviewModal').addEventListener('click', e => { if (e.target === document.getElementById('reviewModal')) closeModal(); });
loadRequests();
</script>
</body>
</html>
