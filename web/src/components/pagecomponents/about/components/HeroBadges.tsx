import { HERO_BADGES } from "../constants";

export function HeroBadges() {
	return (
		<div className="flex gap-6 justify-center mt-8 flex-wrap">
			{HERO_BADGES.map(({ icon, label }) => (
				<div
					key={label}
					className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/40 bg-black/40 backdrop-blur text-primary text-sm font-heading tracking-widest"
				>
					<i className={icon} aria-hidden="true" />
					{label}
				</div>
			))}
		</div>
	);
}
