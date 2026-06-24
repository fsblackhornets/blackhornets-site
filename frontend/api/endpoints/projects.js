export function createProjectsApi(client) {
	return {
		getAll: () => client.get("projects"),
	};
}

if (typeof window !== "undefined") {
	window.API = window.API || {};
	window.API.projects = createProjectsApi({
		get: (path) => window._apiGet(path),
		post: (path, body) => window._apiPost(path, body),
	});
}
