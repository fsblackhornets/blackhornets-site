import { HERO_BADGES } from "../constants";

export function HeroBadges() {
	return (
		<div className="flex gap-4 justify-center flex-wrap">
			{HERO_BADGES.map(({ Icon, label }) => (
				<div
					key={label}
					className="flex items-center gap-2 px-5 py-2.5 font-heading text-primary text-xs tracking-widest"
					style={{
						clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)",
						background: "rgba(255,215,0,0.08)",
						border: "1px solid rgba(255,215,0,0.2)",
					}}
				>
					<Icon className="w-4 h-4" />
					{label}
				</div>
			))}
		</div>
	);
}
