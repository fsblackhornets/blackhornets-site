const _BASE = "/backend/api";

export function createHttpClient(axiosInstance = null) {
	if (axiosInstance) {
		const http = axiosInstance.create({ baseURL: _BASE, timeout: 15000 });
		http.interceptors.response.use(
			(res) => res.data,
			(err) => {
				const msg =
					err.response?.data?.message || err.message || "Request failed";
				throw new Error(`HTTP ${err.response?.status ?? 0}: ${msg}`);
			},
		);
		return {
			get: (path) => http.get(`/${path}`),
			post: (path, body) => http.post(`/${path}`, body),
		};
	}

	const _req = (path, opts = {}) =>
		fetch(`${_BASE}/${path}`, opts).then((r) => {
			if (!r.ok) throw new Error(`HTTP ${r.status}: ${path}`);
			return r.json();
		});

	return {
		get: (path) => _req(path),
		post: (path, body) =>
			_req(path, {
				method: "POST",
				body: body instanceof FormData ? body : JSON.stringify(body),
				headers:
					body instanceof FormData ? {} : { "Content-Type": "application/json" },
			}),
	};
}

if (typeof window !== "undefined") {
	const client = createHttpClient(
		typeof axios !== "undefined" ? axios : null,
	);
	window._apiGet = client.get;
	window._apiPost = client.post;
}
