export const GALLERY_SECTIONS = [
	{
		category: "race_cars",
		title: "Race Cars",
		icon: "image" as const,
		description:
			"Black Hornets Racing showcases our cutting-edge Formula Student race cars. Each vehicle represents countless hours of innovation, precision engineering, and aerodynamic excellence.",
	},
	{
		category: "team",
		title: "Our Team",
		icon: "fas fa-users",
		description:
			"Meet the passionate minds behind our success. A diverse team of engineers, designers, and innovators working together to achieve excellence.",
	},
	{
		category: "events",
		title: "Events & Competitions",
		icon: "fas fa-trophy",
		description:
			"Witness our competitive spirit in action. From Formula Student competitions to engineering showcases, every event tells a story of determination.",
	},
	{
		category: "workshop",
		title: "Workshop",
		icon: "fas fa-tools",
		description:
			"Step into our engineering sanctuary. Where ideas transform into reality, and innovation meets craftsmanship in our state-of-the-art facility.",
	},
] as const;

export const GALLERY_CATEGORY_OPTIONS = GALLERY_SECTIONS.map(({ category, title }) => ({
	value: category,
	label: title,
}));
