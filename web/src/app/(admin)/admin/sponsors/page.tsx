import Image from "next/image";
import Link from "next/link";
import { ExternalLink, FileEdit, FileText, Plus, Users } from "lucide-react";
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
					<Plus size={10} strokeWidth={2.5} aria-hidden="true" />
					New Sponsor
				</ParaButton>
			</div>

			{/* Sponsor list */}
			{sponsors.length === 0 ? (
				<div className="bg-[#111] border border-[#1e1e1e] rounded-sm p-16 text-center mb-8">
					<Users size={40} strokeWidth={1} className="mx-auto mb-4 opacity-20 text-primary" aria-hidden="true" />
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
												<ExternalLink size={8} strokeWidth={2} aria-hidden="true" />
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
										<FileEdit size={13} strokeWidth={2} aria-hidden="true" />
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
					<FileText size={13} strokeWidth={1.5} stroke="#ef4444" aria-hidden="true" />
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
											<ExternalLink size={10} strokeWidth={2} aria-hidden="true" />
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
