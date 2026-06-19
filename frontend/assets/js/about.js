// When DOM content is loaded
// عندما يتم تحميل محتوى الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // Fetch team members count
    async function fetchTeamMembersCount() {
        try {
            const response = await fetch('/backend/api/team/read.php');
            const data = await response.json();
            if (data.success && data.members) {
                const totalMembers = data.members.length;
                const teamMembersCountEl = document.getElementById('team-members-count');
                if (teamMembersCountEl) {
                    teamMembersCountEl.textContent = totalMembers + '+';
                    teamMembersCountEl.setAttribute('data-count', totalMembers);
                }
                
                // Set total departments count to 8 (as per your structure)
                const departmentsCountEl = document.getElementById('departments-count');
                if (departmentsCountEl) {
                    departmentsCountEl.setAttribute('data-count', 8);
                    departmentsCountEl.textContent = 8;
                }
            }
        } catch (error) {
            console.error('Error fetching team members:', error);
        }
    }
    
    fetchTeamMembersCount();
    
    // Initialize page content with current language
    if (window.updateAboutPageContent) {
        window.updateAboutPageContent();
    }
    
    // Listen for language changes
    window.addEventListener('languageChanged', function() {
        if (window.updateAboutPageContent) {
            window.updateAboutPageContent();
        }
    });
    
    // Scroll animation effects
    // تأثيرات ظهور العناصر عند التمرير
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    // Create intersection observer
    // إنشاء مراقب التقاطع
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to elements
    // تطبيق المراقب على العناصر
    document.querySelectorAll('.story-content, .mission-box, .vision-box, .department-card, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Number counter animation
    // تأثير عداد الأرقام
    function animateNumber(element, start, end, duration) {
        let current = start;
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    // Stats observer
    // مراقب الإحصائيات
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.querySelector('h3');
                const dataCount = target.getAttribute('data-count');
                const endValue = dataCount ? parseInt(dataCount) : parseInt(target.textContent);
                const originalText = target.textContent;
                const hasPlus = originalText.includes('+');
                
                animateNumber(target, 0, endValue, 2000);
                
                // Add back the + sign after animation if it was there
                if (hasPlus) {
                    setTimeout(() => {
                        if (!target.textContent.includes('+')) {
                            target.textContent += '+';
                        }
                    }, 2000);
                }
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Apply stats observer
    // تطبيق مراقب الإحصائيات
    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Card hover effects
    // تأثيرات التحويم للبطاقات
    const cards = document.querySelectorAll('.department-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 10px 20px rgba(255, 215, 0, 0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });

    // Story image hover effect
    // تأثير الصورة عند التحويم
    const storyImage = document.querySelector('.story-image img');
    if (storyImage) {
        storyImage.addEventListener('mouseenter', () => {
            storyImage.style.transform = 'scale(1.05)';
            storyImage.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.2)';
        });

        storyImage.addEventListener('mouseleave', () => {
            storyImage.style.transform = 'scale(1)';
            storyImage.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.5)';
        });
    }

    // Interactive hero background effect
    // تأثير الخلفية التفاعلية للقسم الرئيسي
    const heroSection = document.querySelector('.about-hero');
    const heroContent = heroSection.querySelector('.hero-content');

    heroSection.addEventListener('mousemove', (e) => {
        const { width, height } = heroSection.getBoundingClientRect();
        const centerX = width / 2;
        const centerY = height / 2;
        const moveX = (e.clientX - centerX) / 25;
        const moveY = (e.clientY - centerY) / 25;

        heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'translate(0, 0)';
    });

    // CTA button effect
    // تأثير زر الدعوة للعمل
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', () => {
            ctaButton.style.transform = 'scale(1.05)';
            ctaButton.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
        });

        ctaButton.addEventListener('mouseleave', () => {
            ctaButton.style.transform = 'scale(1)';
            ctaButton.style.boxShadow = 'none';
        });
    }

    // Smooth scroll effect
    // تأثير التمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Video handling
    // معالجة الفيديو
    const video = document.getElementById('myVideo');
    
    // Ensure video is loaded
    // التأكد من تحميل الفيديو
    video.addEventListener('loadeddata', function() {
        video.play();
    });

    // Replay video when ended
    // إعادة تشغيل الفيديو عند انتهائه
    video.addEventListener('ended', function() {
        video.play();
    });

    // Handle errors
    // معالجة الأخطاء
    video.addEventListener('error', function(e) {
        console.error('Error loading video:', e);
    });
}); 