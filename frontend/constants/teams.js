export const TEAM_COLOR_CLASS = {
	mechanical: "team--mechanical",
	electrical: "team--electrical",
	operating_business: "team--business",
};

export const DEPT_TO_TEAM = {
	"Mechanical Engineering": "mechanical",
	"Electrical Engineering": "electrical",
	"Business Team": "operating_business",
};

export const DEPARTMENT_MAPPING = {
	Marketing: "Marketing",
	Sponsorships: "Sponsorships",
	Sponzorstva: "Sponsorships",
	Management: "Management",
	Menadžment: "Management",
	"Chassis and Aerodynamics": "Chassis and Aerodynamics",
	"Šasije i aerodinamika": "Chassis and Aerodynamics",
	"Suspension and Steering": "Suspension and Steering",
	"Oslanjanje i upravljanje": "Suspension and Steering",
	"Transmission and Braking": "Transmission and Braking",
	"Transmisija i kočenje": "Transmission and Braking",
	"High Voltage": "High Voltage",
	"Visoki napon": "High Voltage",
	"Low Voltage": "Low Voltage",
	"Niski napon": "Low Voltage",
	chassis_aero: "chassis_aero",
	suspension_steering: "suspension_steering",
	transmission_braking: "transmission_braking",
	high_voltage: "high_voltage",
	low_voltage: "low_voltage",
	marketing: "marketing",
	sponsorships: "sponsorships",
	management: "management",
};

if (typeof window !== "undefined") {
	window.TEAM_COLOR_CLASS = TEAM_COLOR_CLASS;
	window.DEPT_TO_TEAM = DEPT_TO_TEAM;
	window.DEPARTMENT_MAPPING = DEPARTMENT_MAPPING;
}
