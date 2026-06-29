import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { updateMemberAction } from "@/app/actions/members";
import { MemberForm } from "@/components/forms/members/MemberForm";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchAdminMember } from "@/lib/api/admin";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { id } = await params;
	const member = await fetchAdminMember(Number(id));
	return buildAdminMeta("Members", `Edit: ${member?.full_name ?? "Member"}`);
}

export default async function EditMemberPage({ params }: Props) {
	const { id } = await params;
	const member = await fetchAdminMember(Number(id));
	if (!member) notFound();

	const action = updateMemberAction.bind(null, member.id);

	return (
		<div className="max-w-[720px]">
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/members"
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back"
				>
					<ChevronLeft size={16} strokeWidth={2} stroke="#ffd700" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					Edit Member
				</h1>
			</div>
			<MemberForm action={action} member={member} />
		</div>
	);
}
