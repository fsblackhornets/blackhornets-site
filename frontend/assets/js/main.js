document.addEventListener('DOMContentLoaded', function() {

    const isMobile = window.innerWidth <= 768;

    // تحسين تأثيرات GSAP للأداء
    const initAnimations = () => {
        gsap.registerPlugin(ScrollTrigger);


        // تحسين تأثيرات البطاقات
        const animateCards = () => {
            gsap.utils.toArray('.project-card, .number-card').forEach(card => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom-=100',
                        toggleActions: 'play none none reverse'
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
        };

        // تأثيرات تفاعلية للبطاقات (فقط للأجهزة غير المحمولة)
        if (!isMobile) {
            initCardInteractions();
        }

        animateCards();
        initNumberAnimation();
    };

    // تحسين تأثيرات البطاقات التفاعلية
    const initCardInteractions = () => {
        const cards = document.querySelectorAll('.project-card, .number-card');
        
        const handleMouseMove = (e, card) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            requestAnimationFrame(() => {
                const rotateX = ((y - rect.height / 2) / 20);
                const rotateY = ((rect.width / 2 - x) / 20);
                card.style.transform = 
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
        };

        cards.forEach(card => {
            card.addEventListener('mousemove', e => handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'none';
            });
        });
    };

    // تحسين تحريك الأرقام
    const initNumberAnimation = () => {
        const animateNumbers = () => {
            document.querySelectorAll('.number').forEach(number => {
                const target = parseInt(number.dataset.target);
                const duration = 1500;
                const increment = target / (duration / 16);
                let current = 0;

                const updateNumber = () => {
                    if (current < target) {
                        current = Math.min(current + increment, target);
                        number.textContent = Math.floor(current);
                        requestAnimationFrame(updateNumber);
                    }
                };

                updateNumber();
            });
        };

        const numbersObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNumbers();
                        numbersObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        const numbersSection = document.querySelector('.numbers');
        if (numbersSection) {
            numbersObserver.observe(numbersSection);
        }
    };

    // تهيئة جميع الوظائف
    initAnimations();
});

