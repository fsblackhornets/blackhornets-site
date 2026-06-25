export interface Sponsor {
	id: number;
	name: string;
	description: string | null;
	description_en: string | null;
	tier: string;
	website: string | null;
	logo: string | null;
	logo_url: string | null;
	tier_order: number;
	created_at: string;
}
