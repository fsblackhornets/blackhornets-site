import { notFound } from "next/navigation";
import { resubmitRequestAction } from "@/app/actions/requests";
import { RequestGalleryForm } from "@/components/forms/requests/RequestGalleryForm";
import { RequestMemberForm } from "@/components/forms/requests/RequestMemberForm";
import { RequestPostForm } from "@/components/forms/requests/RequestPostForm";
import { RequestProjectForm } from "@/components/forms/requests/RequestProjectForm";
import { RequestSponsorForm } from "@/components/forms/requests/RequestSponsorForm";
import { fetchRequest } from "@/lib/api/requests";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { id } = await params;
	return { title: `Edit & Resubmit #${id} — Manager Panel` };
}

export default async function ResubmitPage({ params }: Props) {
	const { id } = await params;
	const request = await fetchRequest(Number(id));

	if (!request || request.status !== "declined") notFound();

	const boundAction = resubmitRequestAction.bind(null, request.id);

	const data = request.data as Record<string, string | undefined>;

	return (
		<div className="max-w-[900px]">
			{/* Decline note banner */}
			{request.admin_notes && (
				<div className="bg-red-500/6 border border-red-500/15 rounded-sm p-4 flex items-start gap-3 mb-6">
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="rgba(239,68,68,0.5)"
						strokeWidth={1.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
						style={{ flexShrink: 0, marginTop: "1px" }}
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					<div>
						<p className="font-heading text-[8px] tracking-[3px] uppercase text-red-400 mb-1">
							Declined Reason
						</p>
						<p className="font-body text-[9.5px] text-[#888] leading-relaxed">
							{request.admin_notes}
						</p>
					</div>
				</div>
			)}

			{/* Pre-populated form */}
			{request.type === "post" && (
				<RequestPostForm
					action={boundAction}
					defaultValues={{
						title_sr: data.title_sr,
						title_en: data.title_en,
						content_sr: data.content_sr,
						content_en: data.content_en,
						category: data.category,
					}}
					label={`Edit & Resubmit — #${id}`}
				/>
			)}
			{request.type === "project" && (
				<RequestProjectForm action={boundAction} />
			)}
			{request.type === "sponsor" && (
				<RequestSponsorForm action={boundAction} />
			)}
			{request.type === "member" && <RequestMemberForm action={boundAction} />}
			{request.type === "gallery" && (
				<RequestGalleryForm action={boundAction} />
			)}
		</div>
	);
}
