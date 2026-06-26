import Link from "next/link";
import { notFound } from "next/navigation";
import { REQUEST_STATUS_COLORS } from "@/constants/requests";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchRequest } from "@/lib/api/requests";
import { RequestReviewClient } from "./RequestReviewClient";

interface Props {
	params: Promise<{ id: string }>;
}
1;

export async function generateMetadata({ params }: Props) {
	const { id } = await params;
	return buildAdminMeta("Requests", `Review #${id}`);
}

export default async function RequestDetailPage({ params }: Props) {
	const { id } = await params;
	const request = await fetchRequest(Number(id));
	if (!request) notFound();

	const isPending = request.status === "pending";

	return (
		<div className="max-w-[720px]">
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/requests"
					className="text-text-gray hover:text-primary transition-colors"
				>
					<i className="fas fa-arrow-left" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Review Request
				</h1>
			</div>

			{/* Meta */}
			<div className="bg-[#111] border border-primary/10 rounded-xl px-5 py-4 flex items-center justify-between gap-4 mb-6">
				<div>
					<p className="text-text-light text-sm font-semibold">
						<span className="uppercase tracking-widest font-heading text-primary/60 mr-2">
							{request.type}
						</span>
						#{request.id}
					</p>
					<p className="text-text-gray text-xs mt-0.5">
						Submitted by {request.submitter_name} ·{" "}
						{new Date(request.created_at).toLocaleString()}
					</p>
				</div>
				<span
					className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${REQUEST_STATUS_COLORS[request.status]}`}
				>
					{request.status}
				</span>
			</div>

			{isPending ? (
				<RequestReviewClient request={request} />
			) : (
				<>
					{/* Read-only view for already-reviewed requests */}
					<div>
						<h2 className="font-heading text-xs tracking-[3px] uppercase text-text-gray/50 mb-3">
							Request Data
						</h2>
						<div className="bg-[#111] border border-primary/10 rounded-xl p-5 flex flex-col gap-3">
							{Object.entries(request.data)
								.filter(
									([k]) =>
										k !== "image" && k !== "logo" && k !== "profile_picture",
								)
								.map(([key, val]) => (
									<div key={key} className="flex gap-3">
										<span className="text-text-gray text-xs w-32 shrink-0 capitalize pt-0.5">
											{key.replace(/_/g, " ")}
										</span>
										<span className="text-text-light text-sm break-words min-w-0">
											{String(val ?? "—")}
										</span>
									</div>
								))}
						</div>
					</div>
					{request.admin_notes && (
						<div className="mt-6">
							<h2 className="font-heading text-xs tracking-[3px] uppercase text-text-gray/50 mb-3">
								Admin Notes
							</h2>
							<p className="text-text-light text-sm bg-[#111] border border-primary/10 rounded-xl px-5 py-4">
								{request.admin_notes}
							</p>
						</div>
					)}
				</>
			)}
		</div>
	);
}
