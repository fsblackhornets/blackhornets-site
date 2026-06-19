<?php
session_start();

if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'admin') {
    header("Location: pages/dashboard.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/frontend/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Black Hornets Racing</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/login.css">
</head>
<body>
    <!-- Language Switcher -->
    <div class="language-switcher" style="position: absolute; top: 20px; right: 20px; z-index: 1000;">
        <button id="langToggle" style="background: rgba(255,255,255,0.1); border: 2px solid #ffd700; color: #ffd700; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: 600;">
            <i class="fas fa-globe"></i> <span id="currentLang">EN</span>
        </button>
    </div>

    <div class="login-container">
        <h1 id="loginTitle">Admin Login</h1>
        <p id="loginSubtitle" style="color: #aaa; margin-bottom: 20px;">Administrator Access</p>
        <div id="error-message" class="error" style="display: none;"></div>
        <form id="loginForm">
            <div class="form-group">
                <label for="username" id="usernameLabel">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password" id="passwordLabel">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" id="submitBtn">
                <span id="loginBtnText">Login</span>
            </button>
        </form>
        <div style="text-align: center; margin-top: 20px;">
            <a href="../index.html" id="backToHome" style="color: #ffd700; text-decoration: none;">
                <i class="fas fa-arrow-left"></i> Back to Home
            </a>
        </div>
    </div>
    <script>
    // Translation System
    const translations = {
        en: {
            title: 'Admin Login',
            subtitle: 'Administrator Access',
            username: 'Username',
            password: 'Password',
            loginBtn: 'Login',
            backToHome: 'Back to Home',
            errorNetwork: 'An error occurred. Please try again.',
            loading: 'Logging in...'
        },
        sr: {
            title: 'Admin Prijava',
            subtitle: 'Pristup za Administratora',
            username: 'Korisničko ime',
            password: 'Lozinka',
            loginBtn: 'Prijavi se',
            backToHome: 'Nazad na Početnu',
            errorNetwork: 'Došlo je do greške. Molimo pokušajte ponovo.',
            loading: 'Prijavljivanje...'
        }
    };

    // Get current language from localStorage or default to English
    let currentLanguage = localStorage.getItem('language') || 'en';

    // Update page content based on language
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

    // Language toggle
    document.getElementById('langToggle').addEventListener('click', function() {
        currentLanguage = currentLanguage === 'en' ? 'sr' : 'en';
        localStorage.setItem('language', currentLanguage);
        updateLanguage();
    });

    // Initialize language on page load
    updateLanguage();

    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const errorDiv = document.getElementById('error-message');
        const submitBtn = this.querySelector('button[type="submit"]');
        const btnText = document.getElementById('loginBtnText');
        const t = translations[currentLanguage];
        
        submitBtn.disabled = true;
        errorDiv.style.display = 'none';
        
        try {
            const formData = new FormData(this);
            const response = await fetch('process_login.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                window.location.href = data.redirect;
            } else {
                errorDiv.textContent = data.message;
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            errorDiv.textContent = t.errorNetwork;
            errorDiv.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
        }
    });
    </script>
</body>
</html>
