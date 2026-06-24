export function createTeamApi(client) {
	return {
		getAll: () => client.get("team"),
	};
}

if (typeof window !== "undefined") {
	window.API = window.API || {};
	window.API.team = createTeamApi({
		get: (path) => window._apiGet(path),
		post: (path, body) => window._apiPost(path, body),
	});
}
