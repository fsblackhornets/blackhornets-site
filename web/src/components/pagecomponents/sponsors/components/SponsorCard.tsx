import Image from "next/image";
import { buildImageUrl } from "@/lib/utils/utils";
import type { Sponsor } from "@/types/sponsor";

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
	const logoUrl = buildImageUrl(sponsor.logo_url ?? sponsor.logo);
	const description = sponsor.description_en ?? sponsor.description;

	const inner = (
		<div className="group relative bg-bg-panel rounded-xl border border-gray-mid p-6 flex flex-col items-center gap-3 hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 cursor-pointer">
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
				<div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading text-2xl font-bold">
					{sponsor.name.charAt(0)}
				</div>
			)}
			<p className="text-text-light text-sm font-semibold text-center">
				{sponsor.name}
			</p>

			{(description || sponsor.website) && (
				<div className="absolute inset-0 rounded-xl bg-bg-dark/95 flex flex-col items-center justify-center gap-3 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<p className="font-heading text-primary font-bold text-sm">
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
							className="text-primary text-xs flex items-center gap-1 hover:underline"
							onClick={(e) => e.stopPropagation()}
						>
							<i className="fas fa-external-link-alt" aria-hidden="true" />
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
