window.API.gallery = {
	getAll: () => window._apiGet("gallery"),
	getByCategory: (category) => window._apiGet(`gallery?category=${category}`),
};
