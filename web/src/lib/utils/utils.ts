export function buildImageUrl(image: string | null): string | null {
	if (!image) return null;
	let p = image.replace(/^\.\.\//, "").replace(/^\//, "");
	if (!p.startsWith("uploads/")) p = `uploads/${p}`;
	return `/${p}`;
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

export function formatDate(dateStr: string | Date, locale = "en-US"): string {
	const d = dateStr instanceof Date ? dateStr : new Date(dateStr.replace(" ", "T"));
	return d.toLocaleDateString(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function buildGalleryImageUrl(imagePath: string): string {
	if (imagePath.startsWith("uploads/") || imagePath.startsWith("/"))
		return `/${imagePath.replace(/^\//, "")}`;
	return `/uploads/gallery/${imagePath}`;
}

export function buildProjectImageUrl(imageUrl: string): string {
	if (imageUrl.startsWith("uploads/") || imageUrl.startsWith("/"))
		return `/${imageUrl.replace(/^\//, "")}`;
	return `/uploads/projects/${imageUrl}`;
}

export function buildSponsorLogoUrl(
	logo: string | null | undefined,
): string | null {
	if (!logo) return null;
	if (logo.startsWith("uploads/") || logo.startsWith("/"))
		return `/${logo.replace(/^\//, "")}`;
	return `/uploads/sponsors/${logo}`;
}

export function buildBrochureUrl(pdfUrl: string): string {
	if (pdfUrl.startsWith("/")) return pdfUrl;
	return `/${pdfUrl}`;
}

export function getProjectStatusVariant(
	status: string,
): "success" | "gold" | "warning" {
	const s = status.toLowerCase();
	if (s === "active") return "success";
	if (s === "completed") return "gold";
	return "warning";
}

export function getProgressColor(progress: number): string {
	if (progress >= 80) return "#4CAF50";
	if (progress >= 60) return "#FF9800";
	if (progress >= 40) return "#FFC107";
	return "#F44336";
}

export function buildProfileImageUrl(filename: string | null): string | null {
	if (!filename || filename === "default.jpg") return null;
	if (filename.startsWith("uploads/") || filename.startsWith("/"))
		return `/${filename.replace(/^\//, "")}`;
	return `/uploads/profiles/${filename}`;
}
