import { describe, it, expect } from "vitest";
import {
	DEPT_TRANS_KEYS,
	POSITION_SR_TO_KEY,
} from "../../constants/positions.js";

describe("DEPT_TRANS_KEYS", () => {
	it("has 8 department entries", () => {
		expect(Object.keys(DEPT_TRANS_KEYS)).toHaveLength(8);
	});

	it("Marketing maps to marketing", () => {
		expect(DEPT_TRANS_KEYS["Marketing"]).toBe("marketing");
	});

	it("Chassis and Aerodynamics maps to chassisAero", () => {
		expect(DEPT_TRANS_KEYS["Chassis and Aerodynamics"]).toBe("chassisAero");
	});

	it("Suspension and Steering maps to suspensionSteering", () => {
		expect(DEPT_TRANS_KEYS["Suspension and Steering"]).toBe(
			"suspensionSteering",
		);
	});

	it("High Voltage maps to highVoltage", () => {
		expect(DEPT_TRANS_KEYS["High Voltage"]).toBe("highVoltage");
	});

	it("Low Voltage maps to lowVoltage", () => {
		expect(DEPT_TRANS_KEYS["Low Voltage"]).toBe("lowVoltage");
	});

	it("all values are non-empty strings", () => {
		for (const val of Object.values(DEPT_TRANS_KEYS)) {
			expect(typeof val).toBe("string");
			expect(val.length).toBeGreaterThan(0);
		}
	});
});

describe("POSITION_SR_TO_KEY", () => {
	it("Inženjer maps to engineer", () => {
		expect(POSITION_SR_TO_KEY["Inženjer"]).toBe("engineer");
	});

	it("Dizajner maps to designer", () => {
		expect(POSITION_SR_TO_KEY["Dizajner"]).toBe("designer");
	});

	it("Fotograf maps to photographer", () => {
		expect(POSITION_SR_TO_KEY["Fotograf"]).toBe("photographer");
	});

	it("CAD Inženjer maps to cad_engineer", () => {
		expect(POSITION_SR_TO_KEY["CAD Inženjer"]).toBe("cad_engineer");
	});

	it("has 21 position entries", () => {
		expect(Object.keys(POSITION_SR_TO_KEY)).toHaveLength(21);
	});

	it("all values are lowercase with underscores only", () => {
		for (const val of Object.values(POSITION_SR_TO_KEY)) {
			expect(val).toMatch(/^[a-z][a-z0-9_]*$/);
		}
	});
});
