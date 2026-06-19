<?php
session_start();

// التحقق من تسجيل دخول المشرف
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: ../login.php');
    exit;
}
?> 