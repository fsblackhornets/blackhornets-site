import Link from "next/link";
import { notFound } from "next/navigation";
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
					className="text-text-gray hover:text-primary transition-colors"
				>
					<i className="fas fa-arrow-left" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Edit Sponsor
				</h1>
			</div>
			<SponsorForm action={action} sponsor={sponsor} />
		</div>
	);
}
