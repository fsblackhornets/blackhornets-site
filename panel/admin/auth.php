<?php
// Secure session settings (must be set before session_start)
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.cookie_samesite', 'Strict');
    ini_set('session.use_strict_mode', 1);
    session_start();
}

// Session timeout (30 minutes of inactivity)
define('SESSION_TIMEOUT', 1800);

function checkAuth($allowed_roles = ['team_member', 'team_leader', 'project_leader', 'admin']) {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        header("Location: ../login.php");
        exit;
    }

    // Check session timeout
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > SESSION_TIMEOUT) {
        session_unset();
        session_destroy();
        header("Location: ../login.php?expired=1");
        exit;
    }
    $_SESSION['last_activity'] = time();

    if (!is_array($allowed_roles)) {
        $allowed_roles = [$allowed_roles];
    }

    if (in_array('team_member', $allowed_roles) && !in_array('sub_leader', $allowed_roles)) {
        $allowed_roles[] = 'sub_leader';
    }

    if (!in_array($_SESSION['role'], $allowed_roles)) {
        header("Location: unauthorized.php");
        exit;
    }

    return true;
}

function getSessionValue($key, $default = '') {
    return $_SESSION[$key] ?? $default;
}
?>
