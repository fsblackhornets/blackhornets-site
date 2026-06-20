window.showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-info-circle"></i><span>${message}</span>`;

    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed; bottom: 20px; right: 20px;
            background: var(--primary-color); color: var(--dark-bg);
            padding: 15px 25px; border-radius: 8px;
            display: flex; align-items: center; gap: 10px;
            transform: translateY(100px); opacity: 0;
            transition: all 0.3s ease; z-index: 1000; font-weight: bold;
        }
        .notification.show { transform: translateY(0); opacity: 1; }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};
