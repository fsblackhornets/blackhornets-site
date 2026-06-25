import Link from "next/link";
import { notFound } from "next/navigation";
import { updateMemberAction } from "@/app/actions/members";
import { MemberForm } from "@/components/admin/MemberForm";
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
					className="text-text-gray hover:text-primary transition-colors"
				>
					<i className="fas fa-arrow-left" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Edit Member
				</h1>
			</div>
			<MemberForm action={action} member={member} />
		</div>
	);
}
