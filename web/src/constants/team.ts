export const TEAM_STRUCTURE = {
	operating_business: {
		name: "Business Team",
		departments: ["Marketing", "Sponsorships", "Management"],
		accent: "border-yellow-500/40 hover:border-yellow-400",
	},
	mechanical: {
		name: "Mechanical Engineering",
		departments: [
			"Chassis and Aerodynamics",
			"Suspension and Steering",
			"Transmission and Braking",
		],
		accent: "border-blue-500/40 hover:border-blue-400",
	},
	electrical: {
		name: "Electrical Engineering",
		departments: ["High Voltage", "Low Voltage"],
		accent: "border-green-500/40 hover:border-green-400",
	},
} as const;

export type TeamKey = keyof typeof TEAM_STRUCTURE;

/** Serbian doesn't just swap the English department noun into "Podlider
 * tima za {X}" - it needs the accusative case, which isn't a mechanical
 * transformation, so each department gets its own translated phrase. */
export const DEPARTMENT_PHRASE_SR: Record<string, string> = {
	"Chassis and Aerodynamics": "šasiju i aerodinamiku",
	"Suspension and Steering": "oslanjanje i upravljanje",
	"Transmission and Braking": "prenos i kočenje",
	"High Voltage": "visoki napon",
	"Low Voltage": "niski napon",
	Marketing: "marketing",
	Sponsorships: "sponzorstva",
	Management: "menadžment",
};
