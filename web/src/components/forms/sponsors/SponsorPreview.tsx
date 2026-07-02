"use client";

import { type SponsorTier, TIER_STYLES } from "@/constants/sponsors";

interface SponsorPreviewProps {
	name: string;
	tier: SponsorTier;
	logoPreviewUrl: string | null;
}

export function SponsorPreview({
	name,
	tier,
	logoPreviewUrl,
}: SponsorPreviewProps) {
	const tierColor = TIER_STYLES[tier]?.border ?? "border-t-primary/40";

	return (
		<div>
			<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] mb-3">
				Live Preview
			</p>
			<div
				className={`bg-bg-panel rounded-sm border border-[#1e1e1e] border-t-2 ${tierColor} p-6 flex flex-col items-center gap-3 w-48`}
			>
				{logoPreviewUrl ? (
					<div className="relative w-32 h-16">
						{/* biome-ignore lint/performance/noImgElement: blob preview URL, next/image can't handle it */}
						<img
							src={logoPreviewUrl}
							alt={name || "Preview"}
							className="w-full h-full object-contain"
						/>
					</div>
				) : (
					<div className="w-16 h-16 rounded-sm bg-primary/20 flex items-center justify-center text-primary font-heading text-2xl font-bold">
						{name.charAt(0) || "?"}
					</div>
				)}
				<p className="font-heading text-[9px] tracking-[1px] uppercase text-[#e0e0e0] text-center">
					{name || "Sponsor Name"}
				</p>
			</div>
		</div>
	);
}
