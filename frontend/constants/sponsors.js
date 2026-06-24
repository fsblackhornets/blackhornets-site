// Sponsor tier display order and keys
window.SPONSOR_TIERS = [
	"Institucija",
	"F1 - Platinum",
	"F2 - Gold",
	"F3 - Silver",
	"F4 - Bronze",
	"Friends of the Project",
];

// Keyword → tier key matching rules (checked in order)
window.TIER_KEYWORDS = [
	{ keywords: ["institucija"], tier: "Institucija" },
	{ keywords: ["platinum", "f1"], tier: "F1 - Platinum" },
	{ keywords: ["gold", "f2"], tier: "F2 - Gold" },
	{ keywords: ["silver", "f3"], tier: "F3 - Silver" },
	{ keywords: ["bronze", "f4"], tier: "F4 - Bronze" },
	{ keywords: ["friends"], tier: "Friends of the Project" },
];
