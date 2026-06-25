const API_ORIGIN = (
	process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/backend/api"
).replace("/backend/api", "");

export function buildImageUrl(image: string | null): string | null {
	if (!image) return null;
	let path = image.replace(/^\.\.\//, "").replace(/^\//, "");
	if (!path.startsWith("uploads/")) path = `uploads/${path}`;
	return `${API_ORIGIN}/frontend/${path}`;
}

export function stripHtml(html: string): string {
	return html
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function excerpt(text: string, max = 150): string {
	const plain = stripHtml(text);
	return plain.length > max ? `${plain.slice(0, max - 3)}...` : plain;
}

export function resolvePostTitle(post: {
	title_en?: string | null;
	title_sr?: string | null;
	title?: string | null;
}): string {
	return post.title_en ?? post.title_sr ?? post.title ?? "Untitled";
}

export function resolvePostContent(post: {
	content_en?: string | null;
	content_sr?: string | null;
	content?: string | null;
}): string {
	return post.content_en ?? post.content_sr ?? post.content ?? "";
}

export function formatDate(dateStr: string, locale = "en-US"): string {
	return new Date(dateStr.replace(" ", "T")).toLocaleDateString(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function buildGalleryImageUrl(imagePath: string): string {
	return `${API_ORIGIN}/panel/admin/${imagePath}`;
}

export function buildProfileImageUrl(filename: string | null): string | null {
	if (!filename || filename === "default.jpg") return null;
	return `${API_ORIGIN}/uploads/profiles/${filename}`;
}
