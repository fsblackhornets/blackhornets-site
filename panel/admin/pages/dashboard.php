<?php
require_once '../auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../../../backend/config/database.php';

try {
    $pending_applications = $conn->query("SELECT COUNT(*) as c FROM applications WHERE status='pending'")->fetch_assoc()['c'];
    $new_messages         = $conn->query("SELECT COUNT(*) as c FROM contact_messages")->fetch_assoc()['c'];
    $total_applications   = $conn->query("SELECT COUNT(*) as c FROM applications")->fetch_assoc()['c'];
    $pending_requests     = $conn->query("SELECT COUNT(*) as c FROM content_requests WHERE status='pending'")->fetch_assoc()['c'];

    $result = $conn->query("SELECT team, COUNT(*) as count FROM users WHERE status='active' AND role NOT IN ('admin','manager') GROUP BY team");
    $mechanical = $electrical = $business = $total = 0;
    while ($row = $result->fetch_assoc()) {
        $total += $row['count'];
        if ($row['team'] === 'mechanical')        $mechanical = $row['count'];
        if ($row['team'] === 'electrical')        $electrical = $row['count'];
        if ($row['team'] === 'operating_business') $business  = $row['count'];
    }
} catch (Exception $e) {}

$admin_name = $_SESSION['full_name'] ?? 'Admin';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/frontend/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard — Black Hornets</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
    /* ── Dashboard-specific styles ── */
    .a-hero {
        background: linear-gradient(135deg, #0a0a0a 0%, #111 50%, rgba(255,215,0,0.04) 100%);
        border: 1px solid rgba(255,215,0,0.12);
        border-radius: 16px;
        padding: 2.5rem;
        margin-bottom: 2rem;
        position: relative;
        overflow: hidden;
    }
    .a-hero::before {
        content: '';
        position: absolute; top: -60px; right: -60px;
        width: 240px; height: 240px;
        background: radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%);
        pointer-events: none;
    }
    .a-hero-eyebrow { font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase; color: #ffb300; margin-bottom: 0.5rem; }
    .a-hero h1 { font-family: 'Michroma', sans-serif; font-size: clamp(1.4rem, 3vw, 2rem); color: #fff; margin-bottom: 0.4rem; }
    .a-hero h1 span { color: #FFD700; }
    .a-hero p { color: #888; font-size: 1rem; }
    .a-hero-logo { position: absolute; right: 2.5rem; top: 50%; transform: translateY(-50%); height: 80px; opacity: 0.12; }

    /* ── Section header ── */
    .a-section-header { display: flex; align-items: center; gap: 12px; margin: 2rem 0 1.2rem; }
    .a-section-title { font-family: 'Michroma', sans-serif; font-size: 0.9rem; color: #FFD700; letter-spacing: 2px; text-transform: uppercase; }
    .a-section-line { flex: 1; height: 1px; background: rgba(255,215,0,0.12); }

    /* ── Stat cards ── */
    .a-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.2rem; margin-bottom: 2rem; }
    .a-stat {
        background: #111; border: 1px solid rgba(255,215,0,0.12);
        border-radius: 14px; padding: 1.6rem 1.5rem;
        display: flex; flex-direction: column; gap: 0.5rem;
        text-decoration: none; color: inherit; transition: all 0.25s;
    }
    .a-stat:hover { border-color: rgba(255,215,0,0.4); box-shadow: 0 0 24px rgba(255,215,0,0.08); transform: translateY(-3px); }
    .a-stat-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(255,215,0,0.08); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #FFD700; margin-bottom: 0.4rem; }
    .a-stat-label { font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase; color: #666; }
    .a-stat-value { font-family: 'Michroma', sans-serif; font-size: 2rem; color: #FFD700; line-height: 1; }
    .a-stat-sub { font-size: 0.82rem; color: #555; }
    .a-stat-sub span { display: block; }

    /* ── Quick action cards ── */
    .a-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1.1rem; }
    .a-card {
        background: #111; border: 1px solid rgba(255,215,0,0.12);
        border-radius: 14px; padding: 1.6rem 1.4rem;
        display: flex; flex-direction: column; align-items: center;
        gap: 0.75rem; text-align: center; text-decoration: none; color: inherit;
        transition: all 0.25s;
    }
    .a-card:hover { border-color: rgba(255,215,0,0.4); box-shadow: 0 0 24px rgba(255,215,0,0.1); transform: translateY(-4px); }
    .a-card-icon { width: 54px; height: 54px; border-radius: 12px; background: rgba(255,215,0,0.08); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #FFD700; transition: background 0.2s; }
    .a-card:hover .a-card-icon { background: rgba(255,215,0,0.15); }
    .a-card h3 { font-family: 'Michroma', sans-serif; font-size: 0.82rem; color: #fff; letter-spacing: 1px; text-transform: uppercase; }
    .a-card p { color: #666; font-size: 0.82rem; line-height: 1.4; margin: 0; }
    </style>
</head>
<body>
    <?php include __DIR__ . '/../components/admin_navbar.php'; ?>

    <div class="main-content">

        <!-- Hero -->
        <div class="a-hero">
            <img src="/frontend/assets/images/Tipografija_belo.png" alt="" class="a-hero-logo">
            <div class="a-hero-eyebrow">Black Hornets Racing</div>
            <h1>Welcome back, <span><?= htmlspecialchars($admin_name) ?></span></h1>
            <p>Manage content, team members, and requests from here.</p>
        </div>

        <!-- Stats -->
        <div class="a-section-header">
            <span class="a-section-title">Overview</span>
            <div class="a-section-line"></div>
        </div>
        <div class="a-stats">
            <a href="applications_list.php" class="a-stat">
                <div class="a-stat-icon"><i class="fas fa-file-alt"></i></div>
                <div class="a-stat-label">Pending Applications</div>
                <div class="a-stat-value"><?= $pending_applications ?></div>
                <div class="a-stat-sub">Awaiting review</div>
            </a>
            <a href="messages.php" class="a-stat">
                <div class="a-stat-icon"><i class="fas fa-envelope"></i></div>
                <div class="a-stat-label">Messages</div>
                <div class="a-stat-value"><?= $new_messages ?></div>
                <div class="a-stat-sub">In inbox</div>
            </a>
            <a href="content-requests.php" class="a-stat">
                <div class="a-stat-icon"><i class="fas fa-inbox"></i></div>
                <div class="a-stat-label">Pending Requests</div>
                <div class="a-stat-value"><?= $pending_requests ?></div>
                <div class="a-stat-sub">From managers</div>
            </a>
            <a href="manage_members.php" class="a-stat">
                <div class="a-stat-icon"><i class="fas fa-users"></i></div>
                <div class="a-stat-label">Team Members</div>
                <div class="a-stat-value"><?= $total ?></div>
                <div class="a-stat-sub">
                    <span>Mechanical: <?= $mechanical ?></span>
                    <span>Electrical: <?= $electrical ?></span>
                    <span>Business: <?= $business ?></span>
                </div>
            </a>
        </div>

        <!-- Quick Actions -->
        <div class="a-section-header">
            <span class="a-section-title">Quick Actions</span>
            <div class="a-section-line"></div>
        </div>
        <div class="a-grid">
            <a href="add_user.php" class="a-card">
                <div class="a-card-icon"><i class="fas fa-user-plus"></i></div>
                <h3>Add User</h3>
                <p>Create a new team member account</p>
            </a>
            <a href="add-edit-post.php" class="a-card">
                <div class="a-card-icon"><i class="fas fa-newspaper"></i></div>
                <h3>Add Post</h3>
                <p>Publish a news or blog article</p>
            </a>
            <a href="manage-gallery.php" class="a-card">
                <div class="a-card-icon"><i class="fas fa-images"></i></div>
                <h3>Gallery</h3>
                <p>Upload and manage gallery images</p>
            </a>
            <a href="manage-sponsors.php" class="a-card">
                <div class="a-card-icon"><i class="fas fa-handshake"></i></div>
                <h3>Sponsors</h3>
                <p>Add, edit, and delete sponsors</p>
            </a>
            <a href="manage-projects.php" class="a-card">
                <div class="a-card-icon"><i class="fas fa-project-diagram"></i></div>
                <h3>Projects</h3>
                <p>Add, edit, and delete projects</p>
            </a>
            <a href="manage_members.php" class="a-card">
                <div class="a-card-icon"><i class="fas fa-users-cog"></i></div>
                <h3>Members</h3>
                <p>View and manage team members</p>
            </a>
            <a href="content-requests.php" class="a-card">
                <div class="a-card-icon"><i class="fas fa-inbox"></i></div>
                <h3>Requests</h3>
                <p>Review pending manager requests</p>
            </a>
        </div>

    </div>
</body>
</html>
<?php if (isset($conn)) $conn->close(); ?>
