import { describe, it, expect } from "vitest";
import { SPONSOR_TIERS, TIER_KEYWORDS } from "../../constants/sponsors.js";

describe("SPONSOR_TIERS", () => {
	it("has 6 tiers", () => {
		expect(SPONSOR_TIERS).toHaveLength(6);
	});

	it("starts with Institucija", () => {
		expect(SPONSOR_TIERS[0]).toBe("Institucija");
	});

	it("ends with Friends of the Project", () => {
		expect(SPONSOR_TIERS[SPONSOR_TIERS.length - 1]).toBe(
			"Friends of the Project",
		);
	});

	it("F1 Platinum ranks above F2 Gold", () => {
		expect(SPONSOR_TIERS.indexOf("F1 - Platinum")).toBeLessThan(
			SPONSOR_TIERS.indexOf("F2 - Gold"),
		);
	});

	it("F2 Gold ranks above F3 Silver", () => {
		expect(SPONSOR_TIERS.indexOf("F2 - Gold")).toBeLessThan(
			SPONSOR_TIERS.indexOf("F3 - Silver"),
		);
	});

	it("F3 Silver ranks above F4 Bronze", () => {
		expect(SPONSOR_TIERS.indexOf("F3 - Silver")).toBeLessThan(
			SPONSOR_TIERS.indexOf("F4 - Bronze"),
		);
	});
});

describe("TIER_KEYWORDS", () => {
	it("has an entry for every tier in SPONSOR_TIERS", () => {
		const mappedTiers = TIER_KEYWORDS.map((k) => k.tier);
		for (const tier of SPONSOR_TIERS) {
			expect(mappedTiers).toContain(tier);
		}
	});

	it("every entry has at least one keyword", () => {
		for (const entry of TIER_KEYWORDS) {
			expect(entry.keywords.length).toBeGreaterThan(0);
		}
	});

	it("platinum keyword maps to F1 - Platinum", () => {
		const entry = TIER_KEYWORDS.find((k) => k.keywords.includes("platinum"));
		expect(entry?.tier).toBe("F1 - Platinum");
	});

	it("gold keyword maps to F2 - Gold", () => {
		const entry = TIER_KEYWORDS.find((k) => k.keywords.includes("gold"));
		expect(entry?.tier).toBe("F2 - Gold");
	});

	it("silver keyword maps to F3 - Silver", () => {
		const entry = TIER_KEYWORDS.find((k) => k.keywords.includes("silver"));
		expect(entry?.tier).toBe("F3 - Silver");
	});

	it("bronze keyword maps to F4 - Bronze", () => {
		const entry = TIER_KEYWORDS.find((k) => k.keywords.includes("bronze"));
		expect(entry?.tier).toBe("F4 - Bronze");
	});

	it("institucija keyword maps to Institucija", () => {
		const entry = TIER_KEYWORDS.find((k) =>
			k.keywords.includes("institucija"),
		);
		expect(entry?.tier).toBe("Institucija");
	});

	it("friends keyword maps to Friends of the Project", () => {
		const entry = TIER_KEYWORDS.find((k) => k.keywords.includes("friends"));
		expect(entry?.tier).toBe("Friends of the Project");
	});
});
