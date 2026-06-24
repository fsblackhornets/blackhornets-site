export function createSponsorsApi(client) {
	return {
		getAll: () => client.get("sponsors"),
	};
}

if (typeof window !== "undefined") {
	window.API = window.API || {};
	window.API.sponsors = createSponsorsApi({
		get: (path) => window._apiGet(path),
		post: (path, body) => window._apiPost(path, body),
	});
}
