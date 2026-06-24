export function createRequestsApi(client) {
	return {
		getAll: (status, type) =>
			client.get(
				`requests?status=${status || "all"}&type=${type || "all"}`,
			),
		create: (data) => client.post("requests", data),
		review: (id, action, notes) =>
			client.post(`requests/${id}/review`, { id, action, notes }),
	};
}

if (typeof window !== "undefined") {
	window.API = window.API || {};
	window.API.requests = createRequestsApi({
		get: (path) => window._apiGet(path),
		post: (path, body) => window._apiPost(path, body),
	});
}
