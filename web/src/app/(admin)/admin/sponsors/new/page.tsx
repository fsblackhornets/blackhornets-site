import Link from "next/link";
import { createSponsorAction } from "@/app/actions/sponsors";
import { SponsorForm } from "@/components/forms/sponsors/SponsorForm";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";

export const metadata = buildAdminMeta("Sponsors", "New Sponsor");

export default function NewSponsorPage() {
	return (
		<div className="max-w-[720px]">
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/sponsors"
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#ffd700"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</Link>
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					New Sponsor
				</h1>
			</div>
			<SponsorForm action={createSponsorAction} />
		</div>
	);
}
