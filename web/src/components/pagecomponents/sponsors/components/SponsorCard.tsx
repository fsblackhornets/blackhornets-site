import Image from "next/image";
import { buildSponsorLogoUrl } from "@/lib/utils/utils";
import type { Sponsor } from "@/types/sponsor";

export function SponsorCard({
	sponsor,
	tierColor,
}: {
	sponsor: Sponsor;
	tierColor: string;
}) {
	const logoUrl = buildSponsorLogoUrl(sponsor.logo_url ?? sponsor.logo);
	const description = sponsor.description_en ?? sponsor.description;

	const inner = (
		<div
			className={`group relative bg-bg-panel rounded-sm border border-[#1e1e1e] border-t-2 ${tierColor} p-6 flex flex-col items-center gap-3 hover:border-primary/50 transition-all duration-200 cursor-pointer`}
		>
			{logoUrl ? (
				<div className="relative w-32 h-16">
					<Image
						src={logoUrl}
						alt={sponsor.name}
						fill
						className="object-contain"
					/>
				</div>
			) : (
				<div className="w-16 h-16 rounded-sm bg-primary/20 flex items-center justify-center text-primary font-heading text-2xl font-bold">
					{sponsor.name.charAt(0)}
				</div>
			)}
			<p className="font-heading text-[9px] tracking-[1px] uppercase text-[#e0e0e0] text-center">
				{sponsor.name}
			</p>

			{(description || sponsor.website) && (
				<div className="absolute inset-0 rounded-sm bg-bg-dark/95 flex flex-col items-center justify-center gap-3 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<p className="font-heading text-[9px] tracking-[2px] uppercase text-primary text-center">
						{sponsor.name}
					</p>
					{description && (
						<p className="text-text-gray text-xs text-center leading-relaxed">
							{description}
						</p>
					)}
					{sponsor.website && (
						<a
							href={sponsor.website}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 hover:underline font-heading text-[8px] tracking-[2px] uppercase text-primary"
							onClick={(e) => e.stopPropagation()}
						>
							<svg
								width="10"
								height="10"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
								<polyline points="15 3 21 3 21 9" />
								<line x1="10" y1="14" x2="21" y2="3" />
							</svg>
							Visit Website
						</a>
					)}
				</div>
			)}
		</div>
	);

	return sponsor.website ? (
		<a
			href={sponsor.website}
			target="_blank"
			rel="noopener noreferrer"
			className="block"
		>
			{inner}
		</a>
	) : (
		<div>{inner}</div>
	);
}
