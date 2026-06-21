<?php
if (session_status() === PHP_SESSION_NONE) session_start();
if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'manager') {
    header('Location: dashboard.php'); exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manager Login — Black Hornets</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/frontend/admin/css/login.css">
    <style>
        .login-container h1 { font-size: 1.6rem; }
        .manager-badge { display:inline-block; background:rgba(255,215,0,0.1); border:1px solid rgba(255,215,0,0.3); color:#FFD700; padding:4px 14px; border-radius:20px; font-size:0.8rem; letter-spacing:2px; text-transform:uppercase; margin-bottom:1.5rem; }
    </style>
</head>
<body>
<div class="login-container">
    <h1>Manager Login</h1>
    <div class="manager-badge"><i class="fas fa-user-tie"></i> Manager Access</div>
    <div id="error-message" class="error" style="display:none;"></div>
    <form id="loginForm">
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required autocomplete="username">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required autocomplete="current-password">
        </div>
        <button type="submit"><span id="loginBtnText">Login</span></button>
    </form>
    <div style="text-align:center;margin-top:1.5rem;">
        <a href="/frontend/pages/home/home.html" style="color:#FFD700;text-decoration:none;font-size:0.9rem;">
            <i class="fas fa-arrow-left"></i> Back to Site
        </a>
    </div>
</div>

<script>
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('error-message');
    const btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    errorDiv.style.display = 'none';

    try {
        const res  = await fetch('/backend/manager/process_login.php', { method:'POST', body: new FormData(this) });
        const data = await res.json();
        if (data.status === 'success') {
            window.location.href = data.redirect;
        } else {
            errorDiv.textContent = data.message;
            errorDiv.style.display = 'block';
        }
    } catch {
        errorDiv.textContent = 'Network error. Please try again.';
        errorDiv.style.display = 'block';
    } finally {
        btn.disabled = false;
    }
});
</script>
</body>
</html>
