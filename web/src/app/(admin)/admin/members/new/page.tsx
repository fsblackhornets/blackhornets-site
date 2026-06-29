import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createMemberAction } from "@/app/actions/members";
import { MemberForm } from "@/components/forms/members/MemberForm";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";

export const metadata = buildAdminMeta("Members", "New Member");

export default function NewMemberPage() {
	return (
		<div className="max-w-[720px]">
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/members"
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back"
				>
					<ChevronLeft
						size={16}
						strokeWidth={2}
						stroke="#ffd700"
						aria-hidden="true"
					/>
				</Link>
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					Add Member
				</h1>
			</div>
			<MemberForm action={createMemberAction} />
		</div>
	);
}
