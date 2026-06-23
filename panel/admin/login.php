<?php
session_start();
if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'admin')    { header("Location: /panel/admin/pages/dashboard.php"); exit; }
if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'manager')  { header("Location: /panel/manager/dashboard.php"); exit; }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/frontend/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Black Hornets Racing</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/panel/admin/css/login.css">
</head>
<body>
    <div class="language-switcher" style="position:absolute;top:20px;right:20px;z-index:1000;">
        <button id="langToggle" style="background:rgba(255,255,255,0.1);border:2px solid #ffd700;color:#ffd700;padding:8px 15px;border-radius:5px;cursor:pointer;font-weight:600;">
            <i class="fas fa-globe"></i> <span id="currentLang">EN</span>
        </button>
    </div>

    <div class="login-container">
        <h1 id="loginTitle">Login</h1>
        <p id="loginSubtitle" style="color:#aaa;margin-bottom:20px;">Admin &amp; Manager Access</p>
        <div id="error-message" class="error" style="display:none;"></div>
        <form id="loginForm">
            <div class="form-group">
                <label for="username" id="usernameLabel">Username</label>
                <input type="text" id="username" name="username" required autocomplete="username">
            </div>
            <div class="form-group">
                <label for="password" id="passwordLabel">Password</label>
                <input type="password" id="password" name="password" required autocomplete="current-password">
            </div>
            <button type="submit" id="submitBtn">
                <span id="loginBtnText">Login</span>
            </button>
        </form>
        <div style="text-align:center;margin-top:20px;">
            <a href="/frontend/pages/home/home.html" id="backToHome" style="color:#ffd700;text-decoration:none;">
                <i class="fas fa-arrow-left"></i> Back to Home
            </a>
        </div>
    </div>

    <script>
    const translations = {
        en: {
            title: 'Login',
            subtitle: 'Admin & Manager Access',
            username: 'Username',
            password: 'Password',
            loginBtn: 'Login',
            backToHome: 'Back to Home',
            errorNetwork: 'An error occurred. Please try again.',
            loading: 'Logging in...'
        },
        sr: {
            title: 'Prijava',
            subtitle: 'Pristup za Admina i Menadžera',
            username: 'Korisničko ime',
            password: 'Lozinka',
            loginBtn: 'Prijavi se',
            backToHome: 'Nazad na Početnu',
            errorNetwork: 'Došlo je do greške. Molimo pokušajte ponovo.',
            loading: 'Prijavljivanje...'
        }
    };

    let currentLanguage = localStorage.getItem('language') || 'en';

    function updateLanguage() {
        const t = translations[currentLanguage];
        document.getElementById('loginTitle').textContent = t.title;
        document.getElementById('loginSubtitle').textContent = t.subtitle;
        document.getElementById('usernameLabel').textContent = t.username;
        document.getElementById('passwordLabel').textContent = t.password;
        document.getElementById('loginBtnText').textContent = t.loginBtn;
        document.getElementById('backToHome').innerHTML = `<i class="fas fa-arrow-left"></i> ${t.backToHome}`;
        document.getElementById('currentLang').textContent = currentLanguage.toUpperCase();
        document.documentElement.lang = currentLanguage;
    }

    document.getElementById('langToggle').addEventListener('click', function() {
        currentLanguage = currentLanguage === 'en' ? 'sr' : 'en';
        localStorage.setItem('language', currentLanguage);
        updateLanguage();
    });

    updateLanguage();

    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const errorDiv = document.getElementById('error-message');
        const submitBtn = document.getElementById('submitBtn');
        const t = translations[currentLanguage];

        submitBtn.disabled = true;
        errorDiv.style.display = 'none';

        try {
            const res  = await fetch('/backend/process_login.php', { method: 'POST', body: new FormData(this) });
            const data = await res.json();
            if (data.status === 'success') {
                window.location.href = data.redirect;
            } else {
                errorDiv.textContent = data.message;
                errorDiv.style.display = 'block';
            }
        } catch {
            errorDiv.textContent = t.errorNetwork;
            errorDiv.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
        }
    });
    </script>
</body>
</html>
