const API_BASE = '/backend/api';

window._apiGet = (path) =>
    fetch(`${API_BASE}/${path}`)
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}: ${path}`); return r.json(); });

window._apiPost = (path, body) =>
    fetch(`${API_BASE}/${path}`, {
        method: 'POST',
        body:    body instanceof FormData ? body : JSON.stringify(body),
        headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}: ${path}`); return r.json(); });
