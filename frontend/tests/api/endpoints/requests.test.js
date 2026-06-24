import { describe, it, expect, vi } from "vitest";
import { createRequestsApi } from "../../../api/endpoints/requests.js";

const makeClient = () => ({ get: vi.fn(), post: vi.fn() });

describe("createRequestsApi", () => {
	it("getAll with status and type uses them in URL", () => {
		const client = makeClient();
		createRequestsApi(client).getAll("pending", "project");
		expect(client.get).toHaveBeenCalledWith(
			"requests?status=pending&type=project",
		);
	});

	it("getAll with null status defaults to 'all'", () => {
		const client = makeClient();
		createRequestsApi(client).getAll(null, "post");
		expect(client.get).toHaveBeenCalledWith("requests?status=all&type=post");
	});

	it("getAll with null type defaults to 'all'", () => {
		const client = makeClient();
		createRequestsApi(client).getAll("approved", null);
		expect(client.get).toHaveBeenCalledWith(
			"requests?status=approved&type=all",
		);
	});

	it("getAll with both null uses 'all' for both", () => {
		const client = makeClient();
		createRequestsApi(client).getAll(null, null);
		expect(client.get).toHaveBeenCalledWith("requests?status=all&type=all");
	});

	it("getAll with undefined args defaults to 'all'", () => {
		const client = makeClient();
		createRequestsApi(client).getAll(undefined, undefined);
		expect(client.get).toHaveBeenCalledWith("requests?status=all&type=all");
	});

	it("create posts data to 'requests'", () => {
		const client = makeClient();
		const data = { type: "project", payload: {} };
		createRequestsApi(client).create(data);
		expect(client.post).toHaveBeenCalledWith("requests", data);
	});

	it("review posts to requests/{id}/review with correct body", () => {
		const client = makeClient();
		createRequestsApi(client).review(5, "approved", "Looks good");
		expect(client.post).toHaveBeenCalledWith("requests/5/review", {
			id: 5,
			action: "approved",
			notes: "Looks good",
		});
	});

	it("review interpolates id into URL", () => {
		const client = makeClient();
		createRequestsApi(client).review(42, "declined", null);
		expect(client.post).toHaveBeenCalledWith(
			"requests/42/review",
			expect.objectContaining({ id: 42 }),
		);
	});
});
