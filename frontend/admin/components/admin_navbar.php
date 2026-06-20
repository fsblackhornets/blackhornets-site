<?php
// Determine active page from current filename
$current_page = basename($_SERVER['SCRIPT_FILENAME'], '.php');
$nav_items = [
    ['href' => 'dashboard.php', 'icon' => 'fa-tachometer-alt', 'label' => 'Dashboard', 'i18n' => 'dashboard', 'keys' => ['dashboard']],
    ['href' => 'applications_list.php', 'icon' => 'fa-file-alt', 'label' => 'Applications', 'i18n' => 'applications', 'keys' => ['applications_list', 'application_details', 'process_application']],
    ['href' => 'posts.php', 'icon' => 'fa-newspaper', 'label' => 'Posts', 'i18n' => 'posts', 'keys' => ['posts', 'add-edit-post', 'delete-post']],
    ['href' => 'manage-projects.php', 'icon' => 'fa-project-diagram', 'label' => 'Projects', 'i18n' => 'projects', 'keys' => ['manage-projects', 'add-edit-project', 'delete-project']],
    ['href' => 'manage-gallery.php', 'icon' => 'fa-images', 'label' => 'Gallery', 'i18n' => 'gallery', 'keys' => ['manage-gallery']],
    ['href' => 'manage-sponsors.php', 'icon' => 'fa-handshake', 'label' => 'Sponsors', 'i18n' => 'sponsors', 'keys' => ['manage-sponsors', 'add-edit-sponsor', 'delete-sponsor']],
    ['href' => 'manage_members.php', 'icon' => 'fa-users', 'label' => 'Members', 'i18n' => 'members', 'keys' => ['manage_members', 'add_user', 'edit_member']],
    ['href' => 'messages.php', 'icon' => 'fa-envelope', 'label' => 'Messages', 'i18n' => 'messages', 'keys' => ['messages', 'delete_message']],
    ['href' => 'content-requests.php', 'icon' => 'fa-inbox', 'label' => 'Requests', 'i18n' => 'requests', 'keys' => ['content-requests']],
];
?>
<style>
    body { padding-top: 56px; }
    .admin-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 9999; display: flex; justify-content: space-between; align-items: center; padding: 12px 24px; background: #2d2d2d; box-shadow: 0 2px 12px rgba(0,0,0,0.4); border-bottom: 1px solid #3a3a3a; }
    .admin-nav-title { color: #FFD700; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-family: 'Michroma',sans-serif; }
    .admin-nav-links { display: flex; gap: 4px; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; align-items: center; }
    .admin-nav-links a { color: #ccc; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85em; font-weight: 500; transition: background 0.2s, color 0.2s; white-space: nowrap; }
    .admin-nav-links a:hover { background: rgba(255,215,0,0.15); color: #FFD700; }
    .admin-nav-links a.active { background: #FFD700; color: #222; font-weight: 600; }
    .admin-nav-links .nav-logout a { color: #e53935; }
    .admin-nav-links .nav-logout a:hover { background: rgba(229,57,53,0.15); color: #ff6659; }
    .lang-toggle { display: flex; gap: 2px; margin-left: 8px; background: #222; border-radius: 6px; padding: 2px; }
    .lang-btn { background: none; border: none; color: #888; font-size: 0.78em; font-weight: 600; padding: 4px 8px; border-radius: 4px; cursor: pointer; transition: background 0.2s, color 0.2s; }
    .lang-btn.active { background: #FFD700; color: #222; }
    .lang-btn:hover:not(.active) { color: #FFD700; }
    @media (max-width: 900px) {
        body { padding-top: 90px; }
        .admin-nav { flex-direction: column; gap: 10px; text-align: center; padding: 10px 16px; }
        .admin-nav-links { justify-content: center; }
    }
</style>
<nav class="admin-nav">
    <h1 class="admin-nav-title" data-i18n="adminPanel">Admin Panel</h1>
    <ul class="admin-nav-links">
        <?php foreach ($nav_items as $item): ?>
            <?php $is_active = in_array($current_page, $item['keys']); ?>
            <li><a href="<?= $item['href'] ?>"<?= $is_active ? ' class="active"' : '' ?>><i class="fas <?= $item['icon'] ?>"></i> <span data-i18n="<?= $item['i18n'] ?>"><?= $item['label'] ?></span></a></li>
        <?php endforeach; ?>
        <li class="nav-logout"><a href="../logout.php"><i class="fas fa-sign-out-alt"></i> <span data-i18n="logout">Logout</span></a></li>
        <li class="lang-toggle">
            <button class="lang-btn" data-lang="en" onclick="changeAdminLanguage('en')">EN</button>
            <button class="lang-btn" data-lang="sr" onclick="changeAdminLanguage('sr')">SR</button>
        </li>
    </ul>
</nav>
<script src="../js/admin-translations.js"></script>
