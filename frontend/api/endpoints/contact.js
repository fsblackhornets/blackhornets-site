export function createContactApi(client) {
	return {
		send: (data) => client.post("contact/send", data),
	};
}

if (typeof window !== "undefined") {
	window.API = window.API || {};
	window.API.contact = createContactApi({
		get: (path) => window._apiGet(path),
		post: (path, body) => window._apiPost(path, body),
	});
}
