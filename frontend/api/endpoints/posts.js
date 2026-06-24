export function createPostsApi(client) {
	return {
		getAll: () => client.get("posts"),
		getCategories: () => client.get("posts/categories"),
		getById: (id) => client.get(`posts/${id}`),
		create: (data) => client.post("posts", data),
	};
}

if (typeof window !== "undefined") {
	window.API = window.API || {};
	window.API.posts = createPostsApi({
		get: (path) => window._apiGet(path),
		post: (path, body) => window._apiPost(path, body),
	});
}
