export interface Post {
	id: number;
	title: string | null;
	title_sr: string | null;
	title_en: string | null;
	content: string | null;
	content_sr: string | null;
	content_en: string | null;
	image: string | null;
	category: string | null;
	author: string | null;
	featured: 0 | 1;
	views: number;
	status: "published" | "draft";
	created_at: string;
	updated_at: string;
}
