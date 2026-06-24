export function createBrochureApi(client) {
	return {
		get: (lang) => client.get(`brochure?lang=${lang}`),
	};
}

if (typeof window !== "undefined") {
	window.API = window.API || {};
	window.API.brochure = createBrochureApi({
		get: (path) => window._apiGet(path),
		post: (path, body) => window._apiPost(path, body),
	});
}
