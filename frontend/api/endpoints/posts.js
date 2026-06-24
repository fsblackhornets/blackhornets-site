window.API.posts = {
	getAll: () => window._apiGet("posts"),
	getCategories: () => window._apiGet("posts/categories"),
	getById: (id) => window._apiGet(`posts/${id}`),
	create: (data) => window._apiPost("posts", data),
};
