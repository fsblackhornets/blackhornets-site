window.API = {};

const _load = (src) => new Promise(resolve => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = resolve;
    document.head.appendChild(s);
});

const _loadAll = (srcs) => Promise.all(srcs.map(_load));

const AXIOS_CDN = 'https://cdn.jsdelivr.net/npm/axios@1.7.2/dist/axios.min.js';

const ENDPOINTS = [
    '/frontend/api/endpoints/projects.js',
    '/frontend/api/endpoints/team.js',
    '/frontend/api/endpoints/posts.js',
    '/frontend/api/endpoints/sponsors.js',
    '/frontend/api/endpoints/brochure.js',
    '/frontend/api/endpoints/newsletter.js',
    '/frontend/api/endpoints/gallery.js',
    '/frontend/api/endpoints/requests.js',
    '/frontend/api/endpoints/applications.js',
];

_load(AXIOS_CDN)
    .then(() => _load('/frontend/api/client.js'))
    .then(() => _loadAll(ENDPOINTS))
    .then(() => window._resolveApiReady?.());
