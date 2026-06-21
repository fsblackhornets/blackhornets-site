<?php
session_start();

function checkAuth($allowed_roles = ['team_member', 'team_leader', 'project_leader', 'admin', 'manager']) {
    if (!isset($_SESSION['user_id'])) {
        header("Location: login.php");
        exit;
    }

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