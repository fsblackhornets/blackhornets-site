export function createApplicationsApi(client) {
	return {
		submit: (data) => client.post("applications", data),
	};
}

if (typeof window !== "undefined") {
	window.API = window.API || {};
	window.API.applications = createApplicationsApi({
		get: (path) => window._apiGet(path),
		post: (path, body) => window._apiPost(path, body),
	});
}
