const _http = axios.create({
    baseURL: '/backend/api',
    timeout: 15000,
});

// Intercept responses — unwrap .data, throw on error
_http.interceptors.response.use(
    res => res.data,
    err => {
        const msg = err.response?.data?.message || err.message || 'Request failed';
        const status = err.response?.status ?? 0;
        throw new Error(`HTTP ${status}: ${msg}`);
    }
);

window._apiGet = (path) => _http.get(`/${path}`);

window._apiPost = (path, body) => _http.post(`/${path}`, body);
