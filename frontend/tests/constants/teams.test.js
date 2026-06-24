import { describe, it, expect } from "vitest";
import {
	TEAM_COLOR_CLASS,
	DEPT_TO_TEAM,
	DEPARTMENT_MAPPING,
} from "../../constants/teams.js";

describe("TEAM_COLOR_CLASS", () => {
	it("covers all 3 teams", () => {
		expect(Object.keys(TEAM_COLOR_CLASS)).toHaveLength(3);
	});

	it("mechanical has correct CSS class", () => {
		expect(TEAM_COLOR_CLASS.mechanical).toBe("team--mechanical");
	});

	it("electrical has correct CSS class", () => {
		expect(TEAM_COLOR_CLASS.electrical).toBe("team--electrical");
	});

	it("operating_business has correct CSS class", () => {
		expect(TEAM_COLOR_CLASS.operating_business).toBe("team--business");
	});
});

describe("DEPT_TO_TEAM", () => {
	it("Mechanical Engineering maps to mechanical", () => {
		expect(DEPT_TO_TEAM["Mechanical Engineering"]).toBe("mechanical");
	});

	it("Electrical Engineering maps to electrical", () => {
		expect(DEPT_TO_TEAM["Electrical Engineering"]).toBe("electrical");
	});

	it("Business Team maps to operating_business", () => {
		expect(DEPT_TO_TEAM["Business Team"]).toBe("operating_business");
	});

	it("all team values are valid TEAM_COLOR_CLASS keys", () => {
		for (const team of Object.values(DEPT_TO_TEAM)) {
			expect(TEAM_COLOR_CLASS).toHaveProperty(team);
		}
	});
});

describe("DEPARTMENT_MAPPING", () => {
	it("Visoki napon maps to High Voltage", () => {
		expect(DEPARTMENT_MAPPING["Visoki napon"]).toBe("High Voltage");
	});

	it("Niski napon maps to Low Voltage", () => {
		expect(DEPARTMENT_MAPPING["Niski napon"]).toBe("Low Voltage");
	});

	it("Menadžment maps to Management", () => {
		expect(DEPARTMENT_MAPPING["Menadžment"]).toBe("Management");
	});

	it("Sponzorstva maps to Sponsorships", () => {
		expect(DEPARTMENT_MAPPING["Sponzorstva"]).toBe("Sponsorships");
	});

	it("Šasije i aerodinamika maps to Chassis and Aerodynamics", () => {
		expect(DEPARTMENT_MAPPING["Šasije i aerodinamika"]).toBe(
			"Chassis and Aerodynamics",
		);
	});

	it("English keys map to themselves", () => {
		expect(DEPARTMENT_MAPPING["Marketing"]).toBe("Marketing");
		expect(DEPARTMENT_MAPPING["Management"]).toBe("Management");
		expect(DEPARTMENT_MAPPING["High Voltage"]).toBe("High Voltage");
	});
});
