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
					className="text-text-gray hover:text-primary transition-colors"
				>
					<i className="fas fa-arrow-left" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					New Sponsor
				</h1>
			</div>
			<SponsorForm action={createSponsorAction} />
		</div>
	);
}
