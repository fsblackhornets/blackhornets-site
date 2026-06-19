<?php
session_start();

function checkAuth($allowed_roles = ['team_member', 'team_leader', 'project_leader', 'admin']) {
    if (!isset($_SESSION['user_id'])) {
        header("Location: login.php");
        exit;
    }

    // تحويل $allowed_roles إلى مصفوفة إذا كان نصاً
    if (!is_array($allowed_roles)) {
        $allowed_roles = [$allowed_roles];
    }

    // أضف sub_leader تلقائياً إذا كان التحقق للأعضاء
    if (in_array('team_member', $allowed_roles) && !in_array('sub_leader', $allowed_roles)) {
        $allowed_roles[] = 'sub_leader';
    }

    // التحقق مما إذا كان دور المستخدم ضمن الأدوار المسموح بها
    if (!in_array($_SESSION['role'], $allowed_roles)) {
        header("Location: unauthorized.php");
        exit;
    }

    return true;
}

// إضافة دالة مساعدة للتحقق من القيم
function getSessionValue($key, $default = '') {
    return $_SESSION[$key] ?? $default;
}
?> 