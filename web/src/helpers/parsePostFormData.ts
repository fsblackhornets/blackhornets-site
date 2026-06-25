export function parsePostFormData(formData: FormData) {
	return {
		title_sr: (formData.get("title_sr") as string) ?? "",
		title_en: (formData.get("title_en") as string) ?? "",
		content_sr: (formData.get("content_sr") as string) ?? "",
		content_en: (formData.get("content_en") as string) ?? "",
		category: (formData.get("category") as string) ?? "",
		author: (formData.get("author") as string) ?? "",
		featured: formData.get("featured") === "1" ? 1 : 0,
		status: (formData.get("status") as string) ?? "published",
	};
}
