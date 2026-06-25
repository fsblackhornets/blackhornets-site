export const YEAR_OPTIONS = [
	{ value: "1", label: "First Year" },
	{ value: "2", label: "Second Year" },
	{ value: "3", label: "Third Year" },
	{ value: "4", label: "Fourth Year" },
	{ value: "master", label: "Master Studies" },
	{ value: "doctoral", label: "Doctoral Studies" },
] as const;

export const REQUIREMENTS = [
	{
		icon: "fas fa-graduation-cap",
		title: "Student Status",
		desc: "Active student at University of Novi Sad",
	},
	{
		icon: "fas fa-fire",
		title: "Passion",
		desc: "Enthusiasm for motorsports and engineering",
	},
	{
		icon: "fas fa-users",
		title: "Team Spirit",
		desc: "Ability to work in a collaborative environment",
	},
] as const;

export const DEPARTMENTS = [
	{
		icon: "fas fa-briefcase",
		title: "Business Operations",
		items: ["Marketing", "Sponsorships", "Management"],
	},
	{
		icon: "fas fa-car",
		title: "Mechanical Engineering",
		items: [
			"Chassis & Aerodynamics",
			"Suspension & Steering",
			"Transmission & Braking",
		],
	},
	{
		icon: "fas fa-bolt",
		title: "Electrical Engineering",
		items: ["High Voltage", "Low Voltage"],
	},
] as const;
