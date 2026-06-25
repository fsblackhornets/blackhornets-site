export interface GalleryImage {
	id: number;
	title: string | null;
	description: string | null;
	description_en: string | null;
	image_path: string;
	category: string;
	alt_text: string | null;
	sort_order: number;
	is_active: 0 | 1;
	created_by: number | null;
	created_at: string;
}
