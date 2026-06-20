const HOME_HELPERS = [
    '/frontend/pages/home/helpers/ui.js',
    '/frontend/pages/home/helpers/news-card.js',
    '/frontend/pages/home/helpers/animations.js',
];

const HOME_HOOKS = [
    '/frontend/pages/home/hooks/fetch.js',
];

const loadHomeScripts = (srcs) => Promise.all(
    srcs.map(src => new Promise(resolve => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = resolve;
        document.head.appendChild(s);
    }))
);

document.addEventListener('DOMContentLoaded', () => {
    Promise.all([loadHomeScripts(HOME_HELPERS), loadHomeScripts(HOME_HOOKS)]).then(() => {
        window.showMoreNewsBtn?.();
        window.loadHomeNews?.();
        window.setupHomeAnimations?.();
        window.addEventListener('languageChanged', () => window.loadHomeNews?.());
    });
});
