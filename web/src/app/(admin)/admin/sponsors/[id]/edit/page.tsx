import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { updateSponsorAction } from "@/app/actions/sponsors";
import { SponsorForm } from "@/components/forms/sponsors/SponsorForm";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchAdminSponsor } from "@/lib/api/admin";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { id } = await params;
	const sponsor = await fetchAdminSponsor(Number(id));
	return buildAdminMeta("Sponsors", `Edit: ${sponsor?.name ?? "Sponsor"}`);
}

export default async function EditSponsorPage({ params }: Props) {
	const { id } = await params;
	const sponsor = await fetchAdminSponsor(Number(id));
	if (!sponsor) notFound();

	const action = updateSponsorAction.bind(null, sponsor.id);

	return (
		<div className="max-w-[720px]">
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/sponsors"
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back"
				>
					<ChevronLeft size={16} strokeWidth={2} stroke="#ffd700" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					Edit Sponsor
				</h1>
			</div>
			<SponsorForm action={action} sponsor={sponsor} />
		</div>
	);
}
