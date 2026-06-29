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
