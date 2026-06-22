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
        .filters { display:flex; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap; }
        .filters select, .filters input { padding:8px 12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:var(--text-light); font-family:'Poppins',sans-serif; }
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
        .btn-review { padding:5px 14px; border-radius:6px; border:none; cursor:pointer; font-size:0.82rem; font-family:'Poppins',sans-serif; font-weight:500; }
        .btn-approve { background:rgba(40,167,69,0.2); color:#5cb85c; border:1px solid rgba(40,167,69,0.3); }
        .btn-approve:hover { background:rgba(40,167,69,0.35); }
        .btn-decline { background:rgba(220,53,69,0.2); color:#e74c3c; border:1px solid rgba(220,53,69,0.3); }
        .btn-decline:hover { background:rgba(220,53,69,0.35); }
        .btn-view { background:rgba(255,215,0,0.1); color:#FFD700; border:1px solid rgba(255,215,0,0.2); }
        .btn-view:hover { background:rgba(255,215,0,0.2); }

        /* Modal */
        .modal-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center; }
        .modal-overlay.open { display:flex; }
        .modal-box { background:#1a1a1a; border:1px solid rgba(255,215,0,0.2); border-radius:14px; padding:2rem; max-width:620px; width:90%; max-height:85vh; overflow-y:auto; }
        .modal-title { color:var(--primary-color); font-size:1.2rem; font-weight:600; margin-bottom:1.2rem; }
        .data-row { display:flex; gap:1rem; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
        .data-label { color:var(--text-gray); font-size:0.85rem; min-width:130px; font-weight:500; }
        .data-value { color:var(--text-light); font-size:0.9rem; flex:1; word-break:break-word; }
        .notes-input { width:100%; padding:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:#fff; font-family:'Poppins',sans-serif; resize:vertical; margin-top:1rem; }
        .modal-actions { display:flex; gap:1rem; margin-top:1.5rem; justify-content:flex-end; }
        .modal-close { position:absolute; top:1rem; right:1rem; background:none; border:none; color:#888; font-size:1.2rem; cursor:pointer; }
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
            </div>

            <table class="req-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Summary</th>
                        <th>Submitted By</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
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
    <div class="modal-box" style="position:relative;">
        <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
        <div class="modal-title" id="modalTitle">Request Details</div>
        <div id="modalData"></div>
        <div style="margin-top:1.2rem;">
            <label style="color:var(--text-gray);font-size:0.88rem;font-weight:500;">Admin Notes (optional)</label>
            <textarea id="adminNotes" class="notes-input" rows="3" placeholder="Add a note for the manager..."></textarea>
        </div>
        <div class="modal-actions">
            <button class="btn-review btn-decline" onclick="submitReview('decline')"><i class="fas fa-times"></i> Decline</button>
            <button class="btn-review btn-approve" onclick="submitReview('approve')"><i class="fas fa-check"></i> Approve</button>
        </div>
    </div>
</div>

<script>
let currentRequestId = null;

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
                const summary = req.type === 'member'  ? (d.full_name || '-')
                              : req.type === 'post'    ? (d.title_sr  || '-')
                              : req.type === 'project' ? (d.name      || '-')
                              : req.type === 'sponsor' ? (d.name      || '-') : '-';
                const badge = `<span class="badge badge-${req.status}">${req.status}</span>`;
                const date  = new Date(req.created_at).toLocaleDateString();
                const actions = req.status === 'pending'
                    ? `<button class="btn-review btn-view" onclick='openModal(${JSON.stringify(req)})'><i class="fas fa-eye"></i> Review</button>`
                    : `<button class="btn-review btn-view" onclick='openModal(${JSON.stringify(req)})'><i class="fas fa-eye"></i> View</button>`;
                return `<tr>
                    <td>${req.id}</td>
                    <td><span class="type-badge">${req.type}</span></td>
                    <td>${summary}</td>
                    <td>${req.submitter_name || '-'}</td>
                    <td>${date}</td>
                    <td>${badge}</td>
                    <td>${actions}</td>
                </tr>`;
            }).join('');
        });
}

function openModal(req) {
    currentRequestId = req.id;
    document.getElementById('modalTitle').textContent = `#${req.id} — ${req.type} request by ${req.submitter_name}`;
    document.getElementById('adminNotes').value = req.admin_notes || '';

    const d = req.data;
    const rows = Object.entries(d).map(([k, v]) =>
        `<div class="data-row"><span class="data-label">${k.replace(/_/g,' ')}</span><span class="data-value">${v || '-'}</span></div>`
    ).join('');

    const statusNote = req.status !== 'pending'
        ? `<div style="margin-top:1rem;padding:10px 14px;border-radius:8px;background:rgba(255,255,255,0.04);color:var(--text-gray);font-size:0.85rem;"><b>Status:</b> ${req.status}${req.admin_notes ? ` — "${req.admin_notes}"` : ''}</div>`
        : '';

    document.getElementById('modalData').innerHTML = rows + statusNote;

    // Show/hide action buttons based on status
    document.querySelector('.modal-actions').style.display = req.status === 'pending' ? 'flex' : 'none';

    document.getElementById('reviewModal').classList.add('open');
}

function closeModal() {
    document.getElementById('reviewModal').classList.remove('open');
    currentRequestId = null;
}

async function submitReview(action) {
    if (!currentRequestId) return;
    const notes = document.getElementById('adminNotes').value.trim();

    const res  = await fetch(`/backend/api/requests/${currentRequestId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentRequestId, action, notes })
    });
    const data = await res.json();

    if (data.success) {
        closeModal();
        loadRequests();
    } else {
        alert('Error: ' + data.message);
    }
}

document.getElementById('filterStatus').addEventListener('change', loadRequests);
document.getElementById('filterType').addEventListener('change', loadRequests);
document.getElementById('reviewModal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
loadRequests();
</script>
</body>
</html>
