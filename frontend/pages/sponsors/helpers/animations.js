window.setupSponsorsAnimations = () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true });
    }

    // Tier card 3D tilt
    document.querySelectorAll('.tier-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const rotateX = ((e.clientY - rect.top) - rect.height / 2) / 20;
            const rotateY = -((e.clientX - rect.left) - rect.width / 2) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05,1.05,1.05)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        });
    });

    // Hero parallax
    const heroSection = document.querySelector('.sponsors-hero');
    const heroContent = document.querySelector('.hero-content');
    if (heroSection && heroContent) {
        heroSection.addEventListener('mousemove', (e) => {
            const { width, height } = heroSection.getBoundingClientRect();
            const x = (e.clientX / width - 0.5) * 2;
            const y = (e.clientY / height - 0.5) * 2;
            heroContent.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
            const h1 = heroContent.querySelector('h1');
            if (h1) h1.style.textShadow = `${x * 10}px ${y * 10}px 20px rgba(255,215,0,0.5)`;
        });
        heroSection.addEventListener('mouseleave', () => {
            heroContent.style.transform = 'translate(0,0)';
            const h1 = heroContent.querySelector('h1');
            if (h1) h1.style.textShadow = '0 0 20px rgba(255,215,0,0.5)';
        });
    }

    // Glow on scroll into view
    const glowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('glow');
                setTimeout(() => { entry.target.classList.remove('glow'); }, 2000);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.tier-card').forEach(card => { glowObserver.observe(card); });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
};
