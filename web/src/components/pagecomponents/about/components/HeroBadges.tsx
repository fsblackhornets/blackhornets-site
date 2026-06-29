import { getTranslations } from "next-intl/server";
import { HERO_BADGES } from "@/constants/about";

const BADGE_KEYS = ["speed", "innovation", "excellence"] as const;

export async function HeroBadges() {
	const t = await getTranslations("about.badges");

	return (
		<div className="flex gap-4 justify-center flex-wrap">
			{HERO_BADGES.map(({ Icon }, i) => (
				<div
					key={BADGE_KEYS[i]}
					className="flex items-center gap-2 px-5 py-2.5 font-heading text-primary text-xs tracking-widest"
					style={{
						clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)",
						background: "rgba(255,215,0,0.08)",
						border: "1px solid rgba(255,215,0,0.2)",
					}}
				>
					<Icon className="w-4 h-4" />
					{t(BADGE_KEYS[i])}
				</div>
			))}
		</div>
	);
}
