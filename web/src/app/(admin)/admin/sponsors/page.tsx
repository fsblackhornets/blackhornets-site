import Image from "next/image";
import Link from "next/link";
import { ParaButton } from "@/components/ui/components/ParaButton";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchAdminBrochure, fetchAdminSponsors } from "@/lib/api/admin";
import {
	buildBrochureUrl,
	buildSponsorLogoUrl,
	formatDate,
} from "@/lib/utils/utils";
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
			{/* Header */}
			<div className="flex items-center gap-3 mb-6">
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					Sponsors
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				<ParaButton href="/admin/sponsors/new" size="sm">
					<svg
						width="10"
						height="10"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2.5}
						strokeLinecap="round"
						aria-hidden="true"
					>
						<line x1="12" y1="5" x2="12" y2="19" />
						<line x1="5" y1="12" x2="19" y2="12" />
					</svg>
					New Sponsor
				</ParaButton>
			</div>

			{/* Sponsor list */}
			{sponsors.length === 0 ? (
				<div className="bg-[#111] border border-[#1e1e1e] rounded-sm p-16 text-center mb-8">
					<svg
						className="mx-auto mb-4 opacity-20 text-primary"
						width="40"
						height="40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={1}
						strokeLinecap="round"
						aria-hidden="true"
					>
						<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
						<path d="M16 3.13a4 4 0 0 1 0 7.75" />
					</svg>
					<p className="font-body text-[10px] text-[#333] tracking-[3px] uppercase">
						No sponsors yet
					</p>
				</div>
			) : (
				<div className="flex flex-col mb-10">
					{sponsors.map((sponsor) => {
						const logoUrl = buildSponsorLogoUrl(
							sponsor.logo_url ?? sponsor.logo,
						);
						return (
							<div
								key={sponsor.id}
								className="border-l-2 border-l-primary/40 border border-[#1e1e1e] bg-[#111] px-5 py-3.5 flex items-center gap-4 mb-px hover:border-l-primary transition-colors"
							>
								{/* Logo */}
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
									<div className="w-12 h-8 shrink-0 bg-primary/5 border border-primary/10 flex items-center justify-center">
										<span className="font-heading text-[9px] text-primary/50">
											{sponsor.name.charAt(0)}
										</span>
									</div>
								)}

								{/* Info */}
								<div className="flex-1 min-w-0">
									<p className="font-heading text-[10px] tracking-[1px] uppercase text-[#e0e0e0] truncate">
										{sponsor.name}
									</p>
									<div className="flex gap-3 mt-1 items-center">
										<span
											className="font-heading text-[7px] tracking-[2px] uppercase text-black bg-primary px-1.5 py-0.5"
											style={{
												clipPath:
													"polygon(0 0, calc(100% - 3px) 0, 100% 100%, 3px 100%)",
											}}
										>
											{sponsor.tier}
										</span>
										<span className="font-body text-[8px] text-[#333]">
											#{sponsor.tier_order}
										</span>
										{sponsor.website && (
											<a
												href={sponsor.website}
												target="_blank"
												rel="noopener noreferrer"
												className="font-body text-[8px] text-primary/50 hover:text-primary transition-colors flex items-center gap-1"
											>
												<svg
													width="8"
													height="8"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth={2}
													strokeLinecap="round"
													aria-hidden="true"
												>
													<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
													<polyline points="15 3 21 3 21 9" />
													<line x1="10" y1="14" x2="21" y2="3" />
												</svg>
												website
											</a>
										)}
									</div>
								</div>

								{/* Actions */}
								<div className="flex gap-1 shrink-0">
									<Link
										href={`/admin/sponsors/${sponsor.id}/edit`}
										className="text-[#333] hover:text-primary transition-colors p-2"
										aria-label={`Edit ${sponsor.name}`}
									>
										<svg
											width="13"
											height="13"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
										</svg>
									</Link>
									<SponsorDeleteButton id={sponsor.id} name={sponsor.name} />
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Brochure section */}
			<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm p-5">
				<div className="flex items-center gap-2 pb-2.5 mb-5 border-b border-[#1e1e1e]">
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#ef4444"
						strokeWidth={1.5}
						strokeLinecap="round"
						aria-hidden="true"
					>
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
						<polyline points="14 2 14 8 20 8" />
						<line x1="16" y1="13" x2="8" y2="13" />
						<line x1="16" y1="17" x2="8" y2="17" />
						<polyline points="10 9 9 9 8 9" />
					</svg>
					<h2 className="font-heading text-[8px] tracking-[4px] uppercase text-primary">
						Partner Brochure
					</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
					{(["sr", "en"] as const).map((lang) => {
						const info = brochure[lang];
						return (
							<div
								key={lang}
								className="bg-[#0a0a0a] border border-[#1e1e1e] border-l-2 border-l-primary/30 p-4"
							>
								<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] mb-2">
									{lang === "sr" ? "Serbian" : "English"}
								</p>
								{info ? (
									<>
										<a
											href={buildBrochureUrl(info.pdf_url)}
											target="_blank"
											rel="noopener noreferrer"
											className="font-body text-[10px] text-primary flex items-center gap-1.5 hover:text-primary/70 transition-colors"
										>
											<svg
												width="10"
												height="10"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												aria-hidden="true"
											>
												<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
												<polyline points="15 3 21 3 21 9" />
												<line x1="10" y1="14" x2="21" y2="3" />
											</svg>
											View PDF
										</a>
										<p className="font-body text-[8px] text-[#333] mt-1">
											Updated: {formatDate(info.updated_at)}
										</p>
									</>
								) : (
									<p className="font-body text-[9px] text-[#333]">
										Not uploaded
									</p>
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
