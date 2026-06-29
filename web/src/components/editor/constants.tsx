export const ALIGN_CLASSES = {
	left: "float-left w-[44%] mr-4 mb-2 clear-left",
	center: "w-full clear-both my-3",
	right: "float-right w-[44%] ml-4 mb-2 clear-right",
};

export const GALLERY_CATS = [
	{ value: "race_cars", label: "Race Cars" },
	{ value: "team", label: "Our Team" },
	{ value: "events", label: "Events" },
	{ value: "workshop", label: "Workshop" },
	{ value: "none", label: "Don't add to gallery" },
];

export const ALIGNMENTS = [
	{
		value: "left",
		label: "Left",
		diagram: (
			<div className="w-full h-8 flex gap-1">
				<div className="w-5 h-full bg-[#333]" />
				<div className="flex-1 flex flex-col gap-0.5 justify-center">
					<div className="h-0.5 bg-[#2a2a2a] w-full" />
					<div className="h-0.5 bg-[#2a2a2a] w-3/4" />
					<div className="h-0.5 bg-[#2a2a2a] w-full" />
				</div>
			</div>
		),
	},
	{
		value: "center",
		label: "Center",
		diagram: (
			<div className="w-full h-8 flex flex-col gap-0.5 items-center justify-center">
				<div className="h-0.5 bg-[#2a2a2a] w-3/4" />
				<div className="w-8 h-3 bg-[#333]" />
				<div className="h-0.5 bg-[#2a2a2a] w-3/4" />
			</div>
		),
	},
	{
		value: "right",
		label: "Right",
		diagram: (
			<div className="w-full h-8 flex gap-1">
				<div className="flex-1 flex flex-col gap-0.5 justify-center">
					<div className="h-0.5 bg-[#2a2a2a] w-full" />
					<div className="h-0.5 bg-[#2a2a2a] w-3/4 ml-auto" />
					<div className="h-0.5 bg-[#2a2a2a] w-full" />
				</div>
				<div className="w-5 h-full bg-[#333]" />
			</div>
		),
	},
] as const;
