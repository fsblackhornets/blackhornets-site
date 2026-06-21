const APPLY_HELPERS = [
    '/frontend/pages/apply/helpers/validation.js',
    '/frontend/pages/apply/helpers/ui.js',
];

const APPLY_HOOKS = [
    '/frontend/pages/apply/hooks/submit.js',
];

const loadApplyScripts = (srcs) => Promise.all(
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
    Promise.all([loadApplyScripts(APPLY_HELPERS), loadApplyScripts(APPLY_HOOKS)]).then(() => {
        window.setupFileUpload?.();
        window.setupApplyForm?.();
    });
});
