<?php
require_once __DIR__ . '/auth_check.php';
$manager_name = $_SESSION['full_name'] ?? 'Manager';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manager Dashboard — Black Hornets</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/panel/manager/manager.css">
</head>
<body>

<!-- Topbar -->
<header class="m-topbar">
    <div class="m-topbar-brand">
        <img src="/frontend/assets/images/W logo.png" alt="Black Hornets">
        <span>Manager</span>
    </div>
    <div class="m-topbar-right">
        <div class="m-topbar-user">
            <i class="fas fa-user-circle"></i>
            <?= htmlspecialchars($manager_name) ?>
        </div>
        <a href="/panel/admin/logout.php" class="m-logout">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    </div>
</header>

<div class="m-layout">

    <!-- Sidebar -->
    <aside class="m-sidebar">
        <div class="m-nav-section">
            <span class="m-nav-label">Navigation</span>
            <div class="m-nav-item active">
                <a href="dashboard.php"><i class="fas fa-home"></i> Dashboard</a>
            </div>
        </div>

        <div class="m-nav-divider"></div>

        <div class="m-nav-section">
            <span class="m-nav-label">Submit Request</span>
            <div class="m-nav-item">
                <a href="pages/request-member.php"><i class="fas fa-user-plus"></i> Add Member</a>
            </div>
            <div class="m-nav-item">
                <a href="pages/request-post.php"><i class="fas fa-newspaper"></i> Add News</a>
            </div>
            <div class="m-nav-item">
                <a href="pages/request-project.php"><i class="fas fa-project-diagram"></i> Add Project</a>
            </div>
            <div class="m-nav-item">
                <a href="pages/request-sponsor.php"><i class="fas fa-handshake"></i> Add Sponsor</a>
            </div>
        </div>
    </aside>

    <!-- Main -->
    <main class="m-main">

        <!-- Hero -->
        <div class="m-hero">
            <img src="/frontend/assets/images/Tipografija_belo.png" alt="" class="m-hero-logo">
            <div class="m-hero-eyebrow">Black Hornets Racing</div>
            <h1>Welcome back, <span><?= htmlspecialchars($manager_name) ?></span></h1>
            <p>Submit content requests — they go live after admin approval.</p>
        </div>

        <!-- Action cards -->
        <div class="m-grid">
            <a href="pages/request-member.php" class="m-card">
                <div class="m-card-icon"><i class="fas fa-user-plus"></i></div>
                <h3>Add Member</h3>
                <p>Request a new team member</p>
            </a>
            <a href="pages/request-post.php" class="m-card">
                <div class="m-card-icon"><i class="fas fa-newspaper"></i></div>
                <h3>Add News</h3>
                <p>Submit a news article</p>
            </a>
            <a href="pages/request-project.php" class="m-card">
                <div class="m-card-icon"><i class="fas fa-project-diagram"></i></div>
                <h3>Add Project</h3>
                <p>Propose a new project</p>
            </a>
            <a href="pages/request-sponsor.php" class="m-card">
                <div class="m-card-icon"><i class="fas fa-handshake"></i></div>
                <h3>Add Sponsor</h3>
                <p>Submit a new sponsor</p>
            </a>
        </div>

        <!-- Requests table -->
        <div class="m-section-header">
            <span class="m-section-title">My Requests</span>
            <div class="m-section-line"></div>
        </div>

        <div class="m-filters">
            <select id="filterStatus" class="m-select">
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
            </select>
            <select id="filterType" class="m-select">
                <option value="all">All Types</option>
                <option value="member">Member</option>
                <option value="post">Post</option>
                <option value="project">Project</option>
                <option value="sponsor">Sponsor</option>
            </select>
        </div>

        <div class="m-table-wrap">
            <table class="m-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Summary</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Admin Notes</th>
                    </tr>
                </thead>
                <tbody id="requestsBody">
                    <tr><td colspan="6" style="text-align:center;color:#555;padding:2rem;">Loading...</td></tr>
                </tbody>
            </table>
        </div>

    </main>
</div>

<script>
function loadRequests() {
    const status = document.getElementById('filterStatus').value;
    const type   = document.getElementById('filterType').value;
    fetch(`/backend/api/requests?status=${status}&type=${type}`)
        .then(r => r.json())
        .then(data => {
            const tbody = document.getElementById('requestsBody');
            if (!data.success || !data.data.length) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#555;padding:2rem;">No requests yet</td></tr>';
                return;
            }
            const icons = { member:'user', post:'newspaper', project:'project-diagram', sponsor:'handshake' };
            tbody.innerHTML = data.data.map(req => {
                const d = req.data;
                const summary = d.full_name || d.title_sr || d.name || '-';
                return `<tr>
                    <td style="color:#555;">#${req.id}</td>
                    <td><i class="fas fa-${icons[req.type]||'file'}" style="color:#FFD700;margin-right:6px;"></i>${req.type}</td>
                    <td>${summary}</td>
                    <td><span class="badge badge-${req.status}">${req.status}</span></td>
                    <td style="color:#555;">${new Date(req.created_at).toLocaleDateString()}</td>
                    <td style="color:#555;font-size:0.85rem;">${req.admin_notes || '—'}</td>
                </tr>`;
            }).join('');
        });
}

document.getElementById('filterStatus').addEventListener('change', loadRequests);
document.getElementById('filterType').addEventListener('change', loadRequests);
loadRequests();
</script>
</body>
</html>
