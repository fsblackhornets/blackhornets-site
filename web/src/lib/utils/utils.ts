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

export function resolvePostTitle(
	post: {
		title_en?: string | null;
		title_sr?: string | null;
		title?: string | null;
	},
	locale?: string,
): string {
	if (locale === "sr")
		return post.title_sr ?? post.title_en ?? post.title ?? "Bez naslova";
	return post.title_en ?? post.title_sr ?? post.title ?? "Untitled";
}

export function resolvePostContent(
	post: {
		content_en?: string | null;
		content_sr?: string | null;
		content?: string | null;
	},
	locale?: string,
): string {
	if (locale === "sr")
		return post.content_sr ?? post.content_en ?? post.content ?? "";
	return post.content_en ?? post.content_sr ?? post.content ?? "";
}

export function formatDate(dateStr: string | Date, locale = "en-US"): string {
	const d =
		dateStr instanceof Date ? dateStr : new Date(dateStr.replace(" ", "T"));
	return d.toLocaleDateString(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

function r2Url(subdir: string, name: string): string {
	if (name.startsWith("http")) return name;
	// legacy local path — strip leading slashes/uploads prefix, serve from /uploads
	if (name.startsWith("uploads/") || name.startsWith("/"))
		return `/${name.replace(/^\//, "")}`;
	if (R2) return `${R2}/${subdir}/${name}`;
	return `/uploads/${subdir}/${name}`;
}

export function buildGalleryImageUrl(imagePath: string): string {
	return r2Url("gallery", imagePath);
}

export function buildProjectImageUrl(imageUrl: string): string {
	return r2Url("projects", imageUrl);
}

export function buildSponsorLogoUrl(
	logo: string | null | undefined,
): string | null {
	if (!logo) return null;
	return r2Url("sponsors", logo);
}

export function buildBrochureUrl(pdfUrl: string): string {
	if (pdfUrl.startsWith("http") || pdfUrl.startsWith("/")) return pdfUrl;
	if (R2) return `${R2}/brochure/${pdfUrl}`;
	return `/uploads/brochure/${pdfUrl}`;
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
	return r2Url("profiles", filename);
}
