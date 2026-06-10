document.addEventListener('DOMContentLoaded', function() {
    // Gallery functionality
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail-grid img');
    let currentImageIndex = 0;

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.style.border = '1px solid transparent');
            
            // Add active class to clicked thumbnail
            this.style.border = '1px solid var(--primary-color)';
            
            // Update main image with fade effect
            mainImage.style.opacity = '0';
            currentImageIndex = index;
            
            setTimeout(() => {
                mainImage.src = this.src;
                mainImage.style.opacity = '1';
            }, 300);
        });
    });

    // Keyboard navigation for gallery
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
            thumbnails[currentImageIndex].click();
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
            thumbnails[currentImageIndex].click();
        }
    });

    // Animate status bar on scroll
    const statusProgress = document.querySelector('.status-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    });

    if (statusProgress) {
        observer.observe(statusProgress);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 