import { describe, it, expect } from "vitest";
import {
	PROJECT_STATUS_CLASSES,
	PROJECT_PROGRESS_COLORS,
} from "../../constants/projects.js";

describe("PROJECT_STATUS_CLASSES", () => {
	it("active maps to correct CSS class", () => {
		expect(PROJECT_STATUS_CLASSES.active).toBe("active");
	});

	it("completed maps to correct CSS class", () => {
		expect(PROJECT_STATUS_CLASSES.completed).toBe("completed");
	});

	it("pending maps to correct CSS class", () => {
		expect(PROJECT_STATUS_CLASSES.pending).toBe("pending");
	});

	it("has exactly 3 status entries", () => {
		expect(Object.keys(PROJECT_STATUS_CLASSES)).toHaveLength(3);
	});
});

describe("PROJECT_PROGRESS_COLORS", () => {
	it("has 4 color thresholds", () => {
		expect(PROJECT_PROGRESS_COLORS).toHaveLength(4);
	});

	it("is ordered highest min first", () => {
		for (let i = 0; i < PROJECT_PROGRESS_COLORS.length - 1; i++) {
			expect(PROJECT_PROGRESS_COLORS[i].min).toBeGreaterThan(
				PROJECT_PROGRESS_COLORS[i + 1].min,
			);
		}
	});

	it("80% threshold is green", () => {
		expect(PROJECT_PROGRESS_COLORS[0]).toEqual({ min: 80, color: "#4CAF50" });
	});

	it("60% threshold is orange", () => {
		expect(PROJECT_PROGRESS_COLORS[1]).toEqual({ min: 60, color: "#FF9800" });
	});

	it("40% threshold is yellow", () => {
		expect(PROJECT_PROGRESS_COLORS[2]).toEqual({ min: 40, color: "#FFC107" });
	});

	it("0% threshold is red (catch-all)", () => {
		expect(PROJECT_PROGRESS_COLORS[3]).toEqual({ min: 0, color: "#F44336" });
	});

	it("lowest threshold is 0 so all values are covered", () => {
		const mins = PROJECT_PROGRESS_COLORS.map((p) => p.min);
		expect(mins).toContain(0);
	});
});
