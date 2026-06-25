export const SPONSOR_TIERS = [
	"Institucija",
	"F1 - Platinum",
	"F2 - Gold",
	"F3 - Silver",
	"F4 - Bronze",
	"Friends of the Project",
] as const;

export type SponsorTier = (typeof SPONSOR_TIERS)[number];

export const TIER_KEYWORDS: { keywords: string[]; tier: SponsorTier }[] = [
	{ keywords: ["institucija"], tier: "Institucija" },
	{ keywords: ["platinum", "f1"], tier: "F1 - Platinum" },
	{ keywords: ["gold", "f2"], tier: "F2 - Gold" },
	{ keywords: ["silver", "f3"], tier: "F3 - Silver" },
	{ keywords: ["bronze", "f4"], tier: "F4 - Bronze" },
	{ keywords: ["friends"], tier: "Friends of the Project" },
];

export const BROCHURE_LANG_OPTIONS = [
	{ value: "sr", label: "Serbian (SR)" },
	{ value: "en", label: "English (EN)" },
] as const;

export const TIER_COLORS: Record<SponsorTier, string> = {
	Institucija: "text-purple-400 border-purple-400/30",
	"F1 - Platinum": "text-slate-300 border-slate-300/30",
	"F2 - Gold": "text-yellow-400 border-yellow-400/30",
	"F3 - Silver": "text-gray-400 border-gray-400/30",
	"F4 - Bronze": "text-orange-400 border-orange-400/30",
	"Friends of the Project": "text-primary border-primary/30",
};

export const TIER_LABELS: Record<SponsorTier, string> = {
	Institucija: "Institutions",
	"F1 - Platinum": "F1 — Platinum",
	"F2 - Gold": "F2 — Gold",
	"F3 - Silver": "F3 — Silver",
	"F4 - Bronze": "F4 — Bronze",
	"Friends of the Project": "Friends of the Project",
};
