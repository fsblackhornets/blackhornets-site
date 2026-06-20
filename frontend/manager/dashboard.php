<?php
require_once __DIR__ . '/auth_check.php';
$manager_name = $_SESSION['full_name'] ?? 'Manager';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manager Dashboard - Black Hornets</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/frontend/assets/css/dashboard.css">
    <style>
        .manager-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        .action-card {
            background: var(--secondary-color);
            border: 1px solid rgba(255, 215, 0, 0.1);
            border-radius: 14px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        .action-card:hover {
            border-color: var(--primary-color);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.15);
            transform: translateY(-4px);
        }
        .action-card i {
            font-size: 2.5rem;
            color: var(--primary-color);
        }
        .action-card h3 {
            color: var(--text-light);
            font-size: 1.1rem;
            margin: 0;
        }
        .action-card p {
            color: var(--text-gray);
            font-size: 0.85rem;
            margin: 0;
        }
        .requests-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .requests-table th, .requests-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .requests-table th { color: var(--primary-color); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
        .requests-table td { color: var(--text-light); font-size: 0.9rem; }
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
        .badge-pending  { background: rgba(255,179,0,0.15); color: #FFB300; }
        .badge-approved { background: rgba(40,167,69,0.15); color: #5cb85c; }
        .badge-declined { background: rgba(220,53,69,0.15); color: #e74c3c; }
        .section-title { color: var(--primary-color); font-size: 1.3rem; font-weight: 600; margin: 2rem 0 0.5rem; }
    </style>
</head>
<body>
<div class="dashboard-container">
    <nav class="sidebar">
        <div class="sidebar-brand">
            <img src="/frontend/assets/images/W logo.png" alt="Logo" style="height:40px;">
            <span>Manager</span>
        </div>
        <ul class="sidebar-nav">
            <li class="active"><a href="dashboard.php"><i class="fas fa-home"></i> Dashboard</a></li>
            <li><a href="pages/request-member.php"><i class="fas fa-user-plus"></i> Add Member</a></li>
            <li><a href="pages/request-post.php"><i class="fas fa-newspaper"></i> Add News</a></li>
            <li><a href="pages/request-project.php"><i class="fas fa-project-diagram"></i> Add Project</a></li>
            <li><a href="pages/request-sponsor.php"><i class="fas fa-handshake"></i> Add Sponsor</a></li>
            <li><a href="/frontend/admin/logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        </ul>
    </nav>

    <main class="main-content">
        <div class="page-header">
            <h1>Welcome, <?= htmlspecialchars($manager_name) ?></h1>
            <p style="color:var(--text-gray);margin-top:4px;">Submit content requests for admin approval</p>
        </div>

        <div class="manager-grid">
            <a href="pages/request-member.php" class="action-card">
                <i class="fas fa-user-plus"></i>
                <h3>Add Member</h3>
                <p>Request adding a new team member to the database</p>
            </a>
            <a href="pages/request-post.php" class="action-card">
                <i class="fas fa-newspaper"></i>
                <h3>Add News Post</h3>
                <p>Submit a news article for review and publication</p>
            </a>
            <a href="pages/request-project.php" class="action-card">
                <i class="fas fa-project-diagram"></i>
                <h3>Add Project</h3>
                <p>Propose a new project to be listed on the site</p>
            </a>
            <a href="pages/request-sponsor.php" class="action-card">
                <i class="fas fa-handshake"></i>
                <h3>Add Sponsor</h3>
                <p>Submit a new sponsor for admin approval</p>
            </a>
        </div>

        <h2 class="section-title">My Requests</h2>

        <div class="card">
            <div style="display:flex;gap:1rem;margin-bottom:1rem;flex-wrap:wrap;">
                <select id="filterStatus" style="padding:8px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:var(--text-light);">
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                </select>
                <select id="filterType" style="padding:8px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:var(--text-light);">
                    <option value="all">All Types</option>
                    <option value="member">Member</option>
                    <option value="post">Post</option>
                    <option value="project">Project</option>
                    <option value="sponsor">Sponsor</option>
                </select>
            </div>
            <table class="requests-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Summary</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th>Admin Notes</th>
                    </tr>
                </thead>
                <tbody id="requestsBody">
                    <tr><td colspan="6" style="text-align:center;color:var(--text-gray);">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </main>
</div>

<script>
function loadRequests() {
    const status = document.getElementById('filterStatus').value;
    const type   = document.getElementById('filterType').value;
    fetch(`/backend/api/requests/read.php?status=${status}&type=${type}`)
        .then(r => r.json())
        .then(data => {
            const tbody = document.getElementById('requestsBody');
            if (!data.success || !data.data.length) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-gray);">No requests found</td></tr>';
                return;
            }
            tbody.innerHTML = data.data.map(req => {
                const d = req.data;
                const summary = req.type === 'member'  ? (d.full_name || '-')
                              : req.type === 'post'    ? (d.title_sr || '-')
                              : req.type === 'project' ? (d.name || '-')
                              : req.type === 'sponsor' ? (d.name || '-') : '-';
                const badge = `<span class="badge badge-${req.status}">${req.status}</span>`;
                const date  = new Date(req.created_at).toLocaleDateString();
                return `<tr>
                    <td>${req.id}</td>
                    <td><i class="fas fa-${typeIcon(req.type)}"></i> ${req.type}</td>
                    <td>${summary}</td>
                    <td>${badge}</td>
                    <td>${date}</td>
                    <td style="color:var(--text-gray);font-size:0.85rem;">${req.admin_notes || '-'}</td>
                </tr>`;
            }).join('');
        });
}

function typeIcon(t) {
    return { member:'user', post:'newspaper', project:'project-diagram', sponsor:'handshake' }[t] || 'file';
}

document.getElementById('filterStatus').addEventListener('change', loadRequests);
document.getElementById('filterType').addEventListener('change', loadRequests);
loadRequests();
</script>
</body>
</html>
