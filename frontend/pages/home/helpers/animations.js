window.setupHomeAnimations = () => {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo('.who-we-are-content',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: '#who-we-are', start: 'top 80%' } }
    );
};
