export function createGalleryApi(client) {
	return {
		getAll: () => client.get("gallery"),
		getByCategory: (category) => client.get(`gallery?category=${category}`),
	};
}

if (typeof window !== "undefined") {
	window.API = window.API || {};
	window.API.gallery = createGalleryApi({
		get: (path) => window._apiGet(path),
		post: (path, body) => window._apiPost(path, body),
	});
}
