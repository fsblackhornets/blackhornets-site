const BLOG_HELPERS = [
    '/frontend/pages/blog/helpers/render.js',
    '/frontend/pages/blog/helpers/search.js',
];

const BLOG_HOOKS = [
    '/frontend/pages/blog/hooks/fetch.js',
];

const loadBlogScripts = (srcs) => Promise.all(
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
    Promise.all([loadBlogScripts(BLOG_HELPERS), loadBlogScripts(BLOG_HOOKS)]).then(() => {
        window.loadBlogPosts?.();
        window.setupBlogSearch?.((term) => window.loadBlogPosts(1, term));
        window.setupBlogNewsletter?.();

        window.addEventListener('languageChanged', () => window.loadBlogPosts?.(1, ''));
    });
});
