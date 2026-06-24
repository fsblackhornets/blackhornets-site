<?php
if (session_status() === PHP_SESSION_NONE) session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'manager') {
    header('Location: /panel/manager/login.php');
    exit;
}
