import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { editAndApproveAction } from "@/app/actions/requests";
import { MemberForm } from "@/components/forms/members/MemberForm";
import { PostForm } from "@/components/forms/posts/PostForm";
import { ProjectForm } from "@/components/forms/projects/ProjectForm";
import { SponsorForm } from "@/components/forms/sponsors/SponsorForm";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchRequest } from "@/lib/api/requests";
import type { AdminMember } from "@/types/member";
import type { Post } from "@/types/post";
import type { Project } from "@/types/project";
import type { Sponsor } from "@/types/sponsor";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { id } = await params;
	return buildAdminMeta("Requests", `Edit & Approve #${id}`);
}

export default async function EditRequestPage({ params }: Props) {
	const { id } = await params;
	const request = await fetchRequest(Number(id));
	if (!request) notFound();

	const action = editAndApproveAction.bind(null, request.id);

	return (
		<div className="max-w-none">
			<div className="flex items-center gap-3 mb-6">
				<Link
					href={`/admin/requests/${request.id}`}
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back"
				>
					<ChevronLeft size={16} strokeWidth={2} stroke="#ffd700" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					Edit & Approve Request
				</h1>
				<span
					className="font-heading text-[7px] tracking-[2px] uppercase text-black bg-primary px-2 py-0.5 self-center"
					style={{
						clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
					}}
				>
					{request.type}
				</span>
			</div>

			{request.type === "post" && (
				<PostForm
					action={action}
					post={request.data as unknown as Post}
					submitLabel="Approve & Publish"
				/>
			)}
			{request.type === "member" && (
				<MemberForm
					action={action}
					member={request.data as unknown as AdminMember}
					submitLabel="Approve & Create"
				/>
			)}
			{request.type === "project" && (
				<ProjectForm
					action={action}
					project={request.data as unknown as Project}
					submitLabel="Approve & Create"
				/>
			)}
			{request.type === "sponsor" && (
				<SponsorForm
					action={action}
					sponsor={request.data as unknown as Sponsor}
					submitLabel="Approve & Create"
				/>
			)}
			{request.type === "gallery" && (
				<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm p-8 max-w-[480px]">
					<p className="font-body text-[10px] text-[#555] tracking-[2px] uppercase text-center">
						Gallery requests cannot be edited inline.
					</p>
					<p className="font-body text-[9px] text-[#333] text-center mt-2">
						Return to the request and approve directly.
					</p>
				</div>
			)}
		</div>
	);
}
