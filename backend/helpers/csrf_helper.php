<?php
/**
 * CSRF Protection Helper
 * Include this file in any page that needs CSRF protection.
 * Session must already be started before including this file.
 */

function csrf_generate_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_token_field() {
    $token = csrf_generate_token();
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token) . '">';
}

function csrf_validate_token($token = null) {
    if ($token === null) {
        $token = $_POST['csrf_token'] ?? $_GET['csrf_token'] ?? '';
    }
    if (empty($token) || empty($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

function csrf_check() {
    if (!csrf_validate_token()) {
        http_response_code(403);
        die('Invalid or missing CSRF token. Please refresh the page and try again.');
    }
}
