const GALLERY_HELPERS = [
    '/frontend/pages/gallery/helpers/render.js',
    '/frontend/pages/gallery/helpers/modal.js',
    '/frontend/pages/gallery/helpers/navigation.js',
];

const GALLERY_HOOKS = [
    '/frontend/pages/gallery/hooks/fetch.js',
];

const loadGalleryScripts = (srcs) => Promise.all(
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
    // Shared state
    window.allGalleryImages  = [];
    window.currentImageIndex = -1;

    Promise.all([loadGalleryScripts(GALLERY_HELPERS), loadGalleryScripts(GALLERY_HOOKS)]).then(() => {
        window.setupGalleryNavigation?.();
        window.reloadAllGallery?.();

        window.addEventListener('languageChanged', () => window.reloadAllGallery?.());
    });
});
