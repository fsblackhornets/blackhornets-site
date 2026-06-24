import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHttpClient } from "../../api/client.js";

describe("createHttpClient — fetch fallback", () => {
	let client;

	beforeEach(() => {
		global.fetch = vi.fn();
		client = createHttpClient(null);
	});

	it("GET calls fetch with correct URL", async () => {
		global.fetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ data: 1 }),
		});

		await client.get("team");

		expect(global.fetch).toHaveBeenCalledWith("/backend/api/team", {});
	});

	it("GET returns parsed JSON on success", async () => {
		const payload = { members: [] };
		global.fetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(payload),
		});

		const result = await client.get("team");

		expect(result).toEqual(payload);
	});

	it("GET throws with status and path on non-ok response", async () => {
		global.fetch.mockResolvedValue({ ok: false, status: 404, json: vi.fn() });

		await expect(client.get("missing")).rejects.toThrow("HTTP 404: missing");
	});

	it("POST sends JSON body with Content-Type header", async () => {
		global.fetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({}),
		});
		const body = { name: "test" };

		await client.post("posts", body);

		expect(global.fetch).toHaveBeenCalledWith(
			"/backend/api/posts",
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json" },
			}),
		);
	});

	it("POST with FormData omits Content-Type header", async () => {
		global.fetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({}),
		});
		const form = new FormData();

		await client.post("upload", form);

		const [, opts] = global.fetch.mock.calls[0];
		expect(opts.headers).toEqual({});
		expect(opts.body).toBe(form);
	});

	it("POST throws with status and path on non-ok response", async () => {
		global.fetch.mockResolvedValue({ ok: false, status: 500, json: vi.fn() });

		await expect(client.post("fail", {})).rejects.toThrow("HTTP 500: fail");
	});
});

describe("createHttpClient — axios path", () => {
	it("returns object with get and post methods", () => {
		const mockHttp = {
			interceptors: { response: { use: vi.fn() } },
			get: vi.fn(),
			post: vi.fn(),
		};
		const mockAxios = { create: vi.fn().mockReturnValue(mockHttp) };

		const client = createHttpClient(mockAxios);

		expect(typeof client.get).toBe("function");
		expect(typeof client.post).toBe("function");
	});

	it("creates axios instance with correct base URL and timeout", () => {
		const mockHttp = {
			interceptors: { response: { use: vi.fn() } },
			get: vi.fn(),
			post: vi.fn(),
		};
		const mockAxios = { create: vi.fn().mockReturnValue(mockHttp) };

		createHttpClient(mockAxios);

		expect(mockAxios.create).toHaveBeenCalledWith({
			baseURL: "/backend/api",
			timeout: 15000,
		});
	});

	it("get calls axios http.get with / prefixed path", async () => {
		const mockHttp = {
			interceptors: { response: { use: vi.fn() } },
			get: vi.fn().mockResolvedValue("data"),
			post: vi.fn(),
		};
		const mockAxios = { create: vi.fn().mockReturnValue(mockHttp) };

		const client = createHttpClient(mockAxios);
		await client.get("posts");

		expect(mockHttp.get).toHaveBeenCalledWith("/posts");
	});

	it("post calls axios http.post with / prefixed path", async () => {
		const mockHttp = {
			interceptors: { response: { use: vi.fn() } },
			get: vi.fn(),
			post: vi.fn().mockResolvedValue("data"),
		};
		const mockAxios = { create: vi.fn().mockReturnValue(mockHttp) };
		const data = { title: "test" };

		const client = createHttpClient(mockAxios);
		await client.post("posts", data);

		expect(mockHttp.post).toHaveBeenCalledWith("/posts", data);
	});
});
