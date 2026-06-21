window.setupFAQ = () => {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        item.querySelector('.faq-question')?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
};
