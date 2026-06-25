import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/components/Button";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchAdminBrochure, fetchAdminSponsors } from "@/lib/api/admin";
import { buildBrochureUrl, buildSponsorLogoUrl, formatDate } from "@/lib/utils/utils";
import { BrochureUploadForm } from "./BrochureUploadForm";
import { SponsorDeleteButton } from "./SponsorDeleteButton";

export const metadata = buildAdminMeta("Sponsors");

export default async function SponsorsAdminPage() {
	const [sponsors, brochure] = await Promise.all([
		fetchAdminSponsors(),
		fetchAdminBrochure(),
	]);

	return (
		<div className="max-w-[1000px]">
			<div className="flex items-center gap-3 mb-6">
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Sponsors
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				<Button href="/admin/sponsors/new" size="sm">
					<i className="fas fa-plus" aria-hidden="true" />
					New Sponsor
				</Button>
			</div>

			{/* Sponsor list */}
			{sponsors.length === 0 ? (
				<div className="bg-[#111] border border-primary/12 rounded-2xl p-16 text-center text-text-gray mb-8">
					<i
						className="fas fa-handshake text-4xl text-primary/30 mb-4 block"
						aria-hidden="true"
					/>
					No sponsors yet.
				</div>
			) : (
				<div className="flex flex-col gap-3 mb-10">
					{sponsors.map((sponsor) => {
						const logoUrl = buildSponsorLogoUrl(
							sponsor.logo_url ?? sponsor.logo,
						);
						return (
							<div
								key={sponsor.id}
								className="bg-[#111] border border-primary/12 rounded-xl px-5 py-4 flex items-center gap-4"
							>
								{logoUrl ? (
									<div className="relative w-12 h-8 shrink-0">
										<Image
											src={logoUrl}
											alt={sponsor.name}
											fill
											className="object-contain"
										/>
									</div>
								) : (
									<div className="w-12 h-8 shrink-0 rounded bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
										{sponsor.name.charAt(0)}
									</div>
								)}

								<div className="flex-1 min-w-0">
									<p className="text-text-light font-semibold text-sm truncate">
										{sponsor.name}
									</p>
									<div className="flex gap-3 mt-1 text-xs text-text-gray">
										<span>{sponsor.tier}</span>
										<span>#{sponsor.tier_order}</span>
										{sponsor.website && (
											<a
												href={sponsor.website}
												target="_blank"
												rel="noopener noreferrer"
												className="text-primary/60 hover:text-primary"
											>
												website
											</a>
										)}
									</div>
								</div>

								<div className="flex gap-2 shrink-0">
									<Link
										href={`/admin/sponsors/${sponsor.id}/edit`}
										className="text-text-gray hover:text-primary transition-colors text-sm px-2"
									>
										<i className="fas fa-pen" aria-hidden="true" />
									</Link>
									<SponsorDeleteButton id={sponsor.id} name={sponsor.name} />
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Brochure section */}
			<div className="bg-[#111] border border-primary/12 rounded-2xl p-6">
				<div className="flex items-center gap-3 mb-5">
					<i
						className="fas fa-file-pdf text-red-400"
						aria-hidden="true"
					/>
					<h2 className="font-heading text-sm tracking-widest text-primary uppercase">
						Partner Brochure
					</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
					{(["sr", "en"] as const).map((lang) => {
						const info = brochure[lang];
						return (
							<div
								key={lang}
								className="bg-[#0a0a0a] border border-primary/8 rounded-xl p-4"
							>
								<p className="text-xs text-text-gray uppercase tracking-widest mb-2">
									{lang === "sr" ? "Serbian" : "English"}
								</p>
								{info ? (
									<>
										<a
											href={buildBrochureUrl(info.pdf_url)}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary text-sm flex items-center gap-2 hover:underline"
										>
											<i className="fas fa-external-link-alt text-xs" />
											View PDF
										</a>
										<p className="text-text-gray text-xs mt-1">
											Updated: {formatDate(info.updated_at)}
										</p>
									</>
								) : (
									<p className="text-text-gray text-sm">Not uploaded</p>
								)}
							</div>
						);
					})}
				</div>

				<BrochureUploadForm />
			</div>
		</div>
	);
}
