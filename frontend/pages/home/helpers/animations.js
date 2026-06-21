window.setupHomeAnimations = () => {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.who-we-are-text', {
        scrollTrigger: { trigger: '#who-we-are', start: 'top 80%' },
        y: 40,
        duration: 0.7,
        ease: 'power2.out',
        immediateRender: false,
    });

    gsap.from('.who-we-are-text p', {
        scrollTrigger: { trigger: '#who-we-are', start: 'top 70%' },
        y: 20,
        duration: 0.6,
        stagger: 0.25,
        ease: 'power2.out',
        delay: 0.4,
        immediateRender: false,
    });
};
