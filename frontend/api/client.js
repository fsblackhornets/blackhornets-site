const _BASE = "/backend/api";

// Use Axios if available (loaded via CDN), fall back to fetch
if (typeof axios !== "undefined") {
	const _http = axios.create({ baseURL: _BASE, timeout: 15000 });

	_http.interceptors.response.use(
		(res) => res.data,
		(err) => {
			const msg =
				err.response?.data?.message || err.message || "Request failed";
			throw new Error(`HTTP ${err.response?.status ?? 0}: ${msg}`);
		},
	);

	window._apiGet = (path) => _http.get(`/${path}`);
	window._apiPost = (path, body) => _http.post(`/${path}`, body);
} else {
	// fetch fallback
	const _req = (path, opts = {}) =>
		fetch(`${_BASE}/${path}`, opts).then((r) => {
			if (!r.ok) throw new Error(`HTTP ${r.status}: ${path}`);
			return r.json();
		});

	window._apiGet = (path) => _req(path);
	window._apiPost = (path, body) =>
		_req(path, {
			method: "POST",
			body: body instanceof FormData ? body : JSON.stringify(body),
			headers:
				body instanceof FormData ? {} : { "Content-Type": "application/json" },
		});
}
