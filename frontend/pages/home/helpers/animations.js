window.setupHomeAnimations = () => {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
};
