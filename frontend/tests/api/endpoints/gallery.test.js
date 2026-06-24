import { describe, it, expect, vi } from "vitest";
import { createGalleryApi } from "../../../api/endpoints/gallery.js";

const makeClient = () => ({ get: vi.fn(), post: vi.fn() });

describe("createGalleryApi", () => {
	it("getAll calls client.get('gallery')", () => {
		const client = makeClient();
		createGalleryApi(client).getAll();
		expect(client.get).toHaveBeenCalledWith("gallery");
	});

	it("getByCategory('cars') calls client.get('gallery?category=cars')", () => {
		const client = makeClient();
		createGalleryApi(client).getByCategory("cars");
		expect(client.get).toHaveBeenCalledWith("gallery?category=cars");
	});

	it("getByCategory interpolates category into query string", () => {
		const client = makeClient();
		createGalleryApi(client).getByCategory("race-day");
		expect(client.get).toHaveBeenCalledWith("gallery?category=race-day");
	});
});
