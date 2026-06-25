export const HERO_BADGES = [
	{ icon: "fas fa-tachometer-alt", label: "Speed" },
	{ icon: "fas fa-cog", label: "Innovation" },
	{ icon: "fas fa-star", label: "Excellence" },
] as const;

export const DEPARTMENTS = [
	{
		icon: "fas fa-bullhorn",
		title: "Marketing",
		description:
			"Team promotion, content creation, and social media management.",
	},
	{
		icon: "fas fa-handshake",
		title: "Sponsorships",
		description:
			"Partner communication, negotiations, and sponsor relationship management.",
	},
	{
		icon: "fas fa-users-cog",
		title: "Management",
		description:
			"Team organization, project coordination, and resource management.",
	},
	{
		icon: "fas fa-car",
		title: "Chassis & Aerodynamics",
		description:
			"Chassis design, structural analysis, and aerodynamic optimization.",
	},
	{
		icon: "fas fa-cog",
		title: "Suspension & Steering",
		description: "Suspension systems, steering geometry, and vehicle dynamics.",
	},
	{
		icon: "fas fa-cogs",
		title: "Transmission & Braking",
		description: "Drivetrain components, braking systems, and power delivery.",
	},
	{
		icon: "fas fa-bolt",
		title: "High Voltage",
		description:
			"Battery systems, high voltage distribution, and energy management.",
	},
	{
		icon: "fas fa-microchip",
		title: "Low Voltage",
		description:
			"Control electronics, sensors, CAN communication, and low voltage systems.",
	},
] as const;
