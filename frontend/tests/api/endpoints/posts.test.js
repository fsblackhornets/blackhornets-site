import { describe, it, expect, vi } from "vitest";
import { createPostsApi } from "../../../api/endpoints/posts.js";

const makeClient = () => ({ get: vi.fn(), post: vi.fn() });

describe("createPostsApi", () => {
	it("getAll calls client.get('posts')", () => {
		const client = makeClient();
		createPostsApi(client).getAll();
		expect(client.get).toHaveBeenCalledWith("posts");
	});

	it("getCategories calls client.get('posts/categories')", () => {
		const client = makeClient();
		createPostsApi(client).getCategories();
		expect(client.get).toHaveBeenCalledWith("posts/categories");
	});

	it("getById(42) calls client.get('posts/42')", () => {
		const client = makeClient();
		createPostsApi(client).getById(42);
		expect(client.get).toHaveBeenCalledWith("posts/42");
	});

	it("getById interpolates id into path", () => {
		const client = makeClient();
		createPostsApi(client).getById(99);
		expect(client.get).toHaveBeenCalledWith("posts/99");
	});

	it("create posts data to 'posts'", () => {
		const client = makeClient();
		const data = { title_sr: "Test", content_sr: "Body" };
		createPostsApi(client).create(data);
		expect(client.post).toHaveBeenCalledWith("posts", data);
	});
});
