import Link from "next/link";
import { createMemberAction } from "@/app/actions/members";
import { MemberForm } from "@/components/admin/MemberForm";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";

export const metadata = buildAdminMeta("Members", "New Member");

export default function NewMemberPage() {
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
					Add Member
				</h1>
			</div>
			<MemberForm action={createMemberAction} />
		</div>
	);
}
