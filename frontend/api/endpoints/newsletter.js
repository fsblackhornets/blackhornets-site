export function createNewsletterApi(client) {
	return {
		subscribe: (data) => client.post("newsletter/subscribe.php", data),
	};
}

if (typeof window !== "undefined") {
	window.API = window.API || {};
	window.API.newsletter = createNewsletterApi({
		get: (path) => window._apiGet(path),
		post: (path, body) => window._apiPost(path, body),
	});
}
