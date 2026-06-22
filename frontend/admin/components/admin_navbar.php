<?php
$current_page = basename($_SERVER['SCRIPT_FILENAME'], '.php');
$admin_name   = $_SESSION['full_name'] ?? 'Admin';

$nav_sections = [
    'Overview' => [
        ['href' => 'dashboard.php',       'icon' => 'fa-home',           'label' => 'Dashboard',    'keys' => ['dashboard']],
    ],
    'Content' => [
        ['href' => 'posts.php',           'icon' => 'fa-newspaper',      'label' => 'Posts',        'keys' => ['posts','add-edit-post','delete-post']],
        ['href' => 'manage-gallery.php',  'icon' => 'fa-images',         'label' => 'Gallery',      'keys' => ['manage-gallery']],
        ['href' => 'manage-sponsors.php', 'icon' => 'fa-handshake',      'label' => 'Sponsors',     'keys' => ['manage-sponsors','add-edit-sponsor','delete-sponsor']],
        ['href' => 'manage-projects.php', 'icon' => 'fa-project-diagram','label' => 'Projects',     'keys' => ['manage-projects','add-edit-project','delete-project']],
    ],
    'Team' => [
        ['href' => 'manage_members.php',  'icon' => 'fa-users',          'label' => 'Members',      'keys' => ['manage_members','add_user','edit_member']],
        ['href' => 'applications_list.php','icon'=> 'fa-file-alt',       'label' => 'Applications', 'keys' => ['applications_list','application_details']],
    ],
    'Communication' => [
        ['href' => 'messages.php',        'icon' => 'fa-envelope',       'label' => 'Messages',     'keys' => ['messages','delete_message']],
        ['href' => 'content-requests.php','icon' => 'fa-inbox',          'label' => 'Requests',     'keys' => ['content-requests']],
    ],
];
?>
<link href="https://fonts.googleapis.com/css2?family=Michroma&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
/* ── Reset layout ── */
*, *::before, *::after { box-sizing: border-box; }
body {
    margin: 0;
    padding-top: 60px;
    padding-left: 240px;
    background: #0d0d0d;
    color: #e0e0e0;
    font-family: 'Rajdhani', 'Poppins', sans-serif;
    min-height: 100vh;
}
a { text-decoration: none; color: inherit; }

/* ── Topbar ── */
.admin-topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
    height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem 0 260px;
    background: rgba(0,0,0,0.92);
    border-bottom: 1px solid rgba(255,215,0,0.12);
    backdrop-filter: blur(10px);
}
.admin-topbar-brand {
    display: flex; align-items: center; gap: 12px;
    position: fixed; left: 0; top: 0; width: 240px; height: 60px;
    padding: 0 1.5rem;
    background: rgba(0,0,0,0.92);
    border-bottom: 1px solid rgba(255,215,0,0.12);
    border-right: 1px solid rgba(255,215,0,0.12);
    z-index: 10000;
}
.admin-topbar-brand img { height: 32px; }
.admin-topbar-brand span {
    font-family: 'Michroma', sans-serif;
    font-size: 0.85rem; color: #FFD700;
    letter-spacing: 3px; text-transform: uppercase;
}
.admin-topbar-right { display: flex; align-items: center; gap: 1.2rem; }
.admin-topbar-user { display: flex; align-items: center; gap: 8px; color: #888; font-size: 0.9rem; }
.admin-topbar-user i { color: #FFD700; }
.admin-lang-toggle { display: flex; gap: 2px; background: rgba(255,255,255,0.06); border-radius: 6px; padding: 2px; }
.admin-lang-btn { background: none; border: none; color: #888; font-size: 0.78rem; font-weight: 600; padding: 4px 9px; border-radius: 4px; cursor: pointer; transition: all 0.2s; font-family: 'Rajdhani', sans-serif; }
.admin-lang-btn.active { background: #FFD700; color: #000; }
.admin-lang-btn:hover:not(.active) { color: #FFD700; }
.admin-logout {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 14px; border: 1px solid rgba(255,215,0,0.3);
    border-radius: 6px; color: #FFD700; font-size: 0.85rem;
    font-family: 'Rajdhani', sans-serif; transition: all 0.2s;
}
.admin-logout:hover { background: rgba(255,215,0,0.1); border-color: #FFD700; }

/* ── Sidebar ── */
.admin-sidebar {
    position: fixed; top: 60px; left: 0; bottom: 0; width: 240px;
    background: #0a0a0a;
    border-right: 1px solid rgba(255,215,0,0.12);
    overflow-y: auto; padding: 1.5rem 0; z-index: 9998;
}
.admin-nav-section { padding: 0 1rem; margin-bottom: 0.25rem; }
.admin-nav-label {
    font-size: 0.66rem; letter-spacing: 2px; text-transform: uppercase;
    color: #555; padding: 0 0.5rem; margin-bottom: 0.4rem; display: block;
}
.admin-nav-item a {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    color: #777; font-size: 0.93rem; font-weight: 500;
    transition: all 0.2s; margin-bottom: 2px;
}
.admin-nav-item a:hover { background: rgba(255,215,0,0.07); color: #FFD700; }
.admin-nav-item.active a {
    background: rgba(255,215,0,0.08); color: #FFD700;
    border-left: 3px solid #FFD700; padding-left: 9px;
}
.admin-nav-item a i { width: 18px; text-align: center; font-size: 0.88rem; }
.admin-nav-divider { height: 1px; background: rgba(255,215,0,0.08); margin: 0.8rem 1rem; }

/* ── Main content area ── */
.main-content { padding: 2.5rem; max-width: 1400px; }

@media (max-width: 900px) {
    body { padding-left: 0; }
    .admin-sidebar { display: none; }
    .admin-topbar { padding-left: 1.5rem; }
    .admin-topbar-brand { position: static; width: auto; border-right: none; }
    .main-content { padding: 1.5rem; }
}
</style>

<!-- Topbar -->
<header class="admin-topbar">
    <div class="admin-topbar-brand">
        <img src="/frontend/assets/images/W logo.png" alt="Black Hornets">
        <span>Admin Panel</span>
    </div>
    <div class="admin-topbar-right">
        <div class="admin-topbar-user">
            <i class="fas fa-user-circle"></i>
            <?= htmlspecialchars($admin_name) ?>
        </div>
        <a href="/frontend/admin/logout.php" class="admin-logout">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    </div>
</header>

<!-- Sidebar -->
<aside class="admin-sidebar">
    <?php
    $sections = array_keys($nav_sections);
    foreach ($nav_sections as $section => $items):
        $is_last = $section === end($sections);
    ?>
    <div class="admin-nav-section">
        <span class="admin-nav-label"><?= $section ?></span>
        <?php foreach ($items as $item):
            $active = in_array($current_page, $item['keys']);
        ?>
        <div class="admin-nav-item <?= $active ? 'active' : '' ?>">
            <a href="<?= $item['href'] ?>">
                <i class="fas <?= $item['icon'] ?>"></i> <?= $item['label'] ?>
            </a>
        </div>
        <?php endforeach; ?>
    </div>
    <?php if (!$is_last): ?><div class="admin-nav-divider"></div><?php endif; ?>
    <?php endforeach; ?>
</aside>

<script src="/frontend/admin/js/admin-translations.js"></script>
