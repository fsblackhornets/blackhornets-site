const SPONSOR_HELPERS = [
    '/frontend/pages/sponsors/helpers/animations.js',
    '/frontend/pages/sponsors/helpers/render.js',
    '/frontend/pages/sponsors/helpers/brochure.js',
];

const SPONSOR_HOOKS = [
    '/frontend/pages/sponsors/hooks/fetch.js',
];

const loadSponsorScripts = (srcs) => Promise.all(
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
    Promise.all([loadSponsorScripts(SPONSOR_HELPERS), loadSponsorScripts(SPONSOR_HOOKS)]).then(() => {
        window.setupSponsorsAnimations?.();
        window.loadSponsors?.();
        window.loadBrochure?.();

        window.addEventListener('languageChanged', () => {
            window.loadSponsors?.();
            window.resetBrochureUI?.();
            window.loadBrochure?.();
        });
    });
});
