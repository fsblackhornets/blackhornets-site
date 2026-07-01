import { Building2, Heart } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
	SPONSOR_TIERS,
	TIER_LABELS,
	type SponsorTier,
	TIER_STYLES,
} from "@/constants/sponsors";

const TIER_ICONS: Partial<Record<SponsorTier, typeof Building2>> = {
	Institucija: Building2,
	"Friends of the Project": Heart,
};

export async function SponsorshipPackagesSection() {
	const t = await getTranslations("sponsors.packages");

	return (
		<section className="py-20 px-4 bg-[#0b0b0b]">
			<div className="max-w-screen-2xl mx-auto">
				<div className="mb-12 text-center">
					<span className="font-heading text-[9px] tracking-[5px] uppercase text-primary block mb-2">
						{t("label")}
					</span>
					<h2 className="font-heading font-black text-white text-2xl leading-tight">
						{t("heading")}{" "}
						<span
							style={{
								background: "linear-gradient(90deg, #ffd700, #ffc107)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							{t("headingGold")}
						</span>
					</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{SPONSOR_TIERS.map((tier) => {
						const Icon = TIER_ICONS[tier];
						const { text: textCls, border: borderCls } = TIER_STYLES[tier];

						return (
							<div
								key={tier}
								className={`bg-bg-panel rounded-sm border border-[#1e1e1e] border-t-2 ${borderCls} p-10 flex flex-col items-center gap-5 text-center`}
							>
								{Icon ? (
									<Icon
										className={textCls}
										size={40}
										strokeWidth={1.5}
										aria-hidden="true"
									/>
								) : (
									<span
										className={`font-heading font-black text-3xl ${textCls}`}
									>
										{tier.split(" ")[0]}
									</span>
								)}
								<p className="font-heading text-[12px] tracking-[2px] uppercase text-[#e0e0e0]">
									{TIER_LABELS[tier]}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
