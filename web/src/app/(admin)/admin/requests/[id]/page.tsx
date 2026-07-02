import { ArrowLeft, Image as ImageIcon, Info, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchRequest } from "@/lib/api/requests";
import { RequestReviewClient } from "./RequestReviewClient";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { id } = await params;
	return buildAdminMeta("Requests", `Review #${id}`);
}

const STATUS_BADGE: Record<string, string> = {
	pending: "bg-primary/10 text-primary",
	approved: "bg-green-500/10 text-green-400",
	declined: "bg-red-500/10 text-red-400",
};

export default async function RequestDetailPage({ params }: Props) {
	const { id } = await params;
	const request = await fetchRequest(Number(id));
	if (!request) notFound();

	const isPending = request.status === "pending";
	const galleryItems = Array.isArray(request.data.gallery_items)
		? (request.data.gallery_items as Array<Record<string, unknown>>).filter(
				(item) => item.galleryCategory && item.galleryCategory !== "none",
			)
		: [];

	return (
		<div className="max-w-[960px]">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 mb-6">
				<Link
					href="/admin/requests"
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back"
				>
					<ArrowLeft size={13} strokeWidth={2} aria-hidden="true" />
				</Link>
				<span className="font-heading text-[8px] tracking-[2px] uppercase text-[#333]">
					Requests
				</span>
				<span className="text-[#2a2a2a]">›</span>
				<span className="font-heading text-[8px] tracking-[2px] uppercase text-primary">
					Review #{request.id}
				</span>
			</div>

			{/* Meta row */}
			<div className="bg-[#111] border border-[#1e1e1e] border-l-[3px] border-l-primary rounded-sm px-5 py-4 flex items-center justify-between gap-4 mb-6">
				<div>
					<p className="font-body text-[11px] font-semibold text-[#e0e0e0]">
						<span className="font-heading text-[7px] tracking-[2px] uppercase text-primary/60 mr-2">
							{request.type}
						</span>
						#{request.id}
					</p>
					<p className="font-body text-[9px] text-[#555] mt-0.5">
						Submitted by {request.submitter_name} ·{" "}
						{new Date(request.created_at).toLocaleString()}
					</p>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					{isPending && request.type !== "gallery" && (
						<Link
							href={`/admin/requests/${request.id}/edit`}
							className="inline-flex items-center gap-1.5 font-heading text-[7px] tracking-[2px] uppercase text-primary border border-primary/30 px-2.5 py-1.5 hover:bg-primary/10 transition-colors"
							style={{
								clipPath:
									"polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
							}}
						>
							<Pencil size={10} strokeWidth={2} aria-hidden="true" />
							Edit
						</Link>
					)}
					<span
						className={`font-heading text-[7px] tracking-[2px] uppercase px-2.5 py-1.5 ${STATUS_BADGE[request.status] ?? ""}`}
						style={{
							clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
						}}
					>
						{request.status}
					</span>
				</div>
			</div>

			{isPending ? (
				<div
					className={
						request.type === "post" ? "grid grid-cols-[1fr_260px] gap-4" : ""
					}
				>
					{/* Post preview for post type */}
					{request.type === "post" && (
						<div>
							<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#333] mb-2">
								Post Preview — As it will appear on the site:
							</p>
							<div className="bg-bg-dark border border-[#1e1e1e] rounded-sm p-8">
								{!!request.data.category && (
									<span
										className="inline-block font-body text-[7px] tracking-[1.5px] uppercase bg-primary/10 text-primary border border-primary/20 px-2.5 py-1.5 mb-4"
										style={{
											clipPath:
												"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
										}}
									>
										{String(request.data.category)}
									</span>
								)}
								{!!request.data.title_sr && (
									<h1 className="font-heading text-[clamp(1.6rem,4vw,2.4rem)] text-primary uppercase tracking-[1px] leading-tight mb-5">
										{String(request.data.title_sr)}
									</h1>
								)}
								<div
									className="prose prose-invert prose-yellow max-w-none text-text-light leading-relaxed
										[&_h2]:font-heading [&_h2]:text-white [&_h2]:uppercase [&_h2]:tracking-[2px] [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2.5 [&_h2]:before:content-[''] [&_h2]:before:w-[3px] [&_h2]:before:h-5 [&_h2]:before:bg-primary [&_h2]:before:flex-shrink-0
										[&_h3]:font-heading [&_h3]:text-primary
										[&_blockquote]:border-l-[3px] [&_blockquote]:border-primary [&_blockquote]:bg-primary/[0.04] [&_blockquote]:rounded-none [&_blockquote]:px-5 [&_blockquote]:py-4
										[&_img]:rounded-none [&_img]:border [&_img]:border-[#1e1e1e]
										[&_a]:text-primary [&_a]:no-underline [&_a]:border-b [&_a]:border-primary/30 [&_a]:hover:border-primary"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: rendering trusted admin-reviewed HTML content
									dangerouslySetInnerHTML={{
										__html: String(request.data.content_sr ?? ""),
									}}
								/>

								{galleryItems.length > 0 && (
									<div className="mt-4 pt-3 border-t border-[#1e1e1e]">
										<div className="flex items-center gap-2 mb-2">
											<Info
												size={11}
												strokeWidth={1.5}
												stroke="rgba(255,215,0,0.4)"
												aria-hidden="true"
											/>
											<span className="font-body text-[8px] text-primary/50">
												Approving this post will also publish{" "}
												{galleryItems.length} image
												{galleryItems.length !== 1 ? "s" : ""} to Gallery
												automatically.
											</span>
										</div>
										<div className="grid grid-cols-4 gap-1">
											{galleryItems.map((item, i) => (
												<div
													key={String(item.src || i)}
													className="aspect-square bg-primary/5 border border-primary/10 flex items-center justify-center"
												>
													{item.src ? (
														// eslint-disable-next-line @next/next/no-img-element
														// biome-ignore lint/performance/noImgElement: gallery thumbnails use dynamic blob URLs incompatible with Next.js Image
														<img
															src={String(item.src)}
															alt={String(item.alt ?? "")}
															className="w-full h-full object-cover"
														/>
													) : (
														<ImageIcon
															size={16}
															strokeWidth={1.5}
															stroke="rgba(255,215,0,0.15)"
															aria-hidden="true"
														/>
													)}
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Review panel */}
					<RequestReviewClient
						request={request}
						isPostType={request.type === "post"}
					/>
				</div>
			) : (
				<>
					{/* Read-only: for post type show content */}
					{request.type === "post" && request.data.content_sr ? (
						<div className="mb-6">
							<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#333] mb-2">
								Post Content
							</p>
							<div className="bg-[#111] border border-[#1e1e1e] rounded-sm p-5">
								{!!request.data.title_sr && (
									<h1 className="font-heading text-lg text-text-light mb-3">
										{String(request.data.title_sr)}
									</h1>
								)}
								<div
									className="text-[11px] text-[#aaa] leading-relaxed [&_h2]:font-heading [&_h2]:text-primary/80 [&_h2]:text-sm [&_h3]:font-heading [&_h3]:text-[#ccc] [&_h3]:text-xs [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_ul]:list-disc [&_ul]:pl-4 [&_figure]:my-3 [&_img]:max-w-full"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: rendering trusted HTML content
									dangerouslySetInnerHTML={{
										__html: String(request.data.content_sr),
									}}
								/>
							</div>
						</div>
					) : (
						<div>
							<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#333] mb-2">
								Request Data
							</p>
							<div className="bg-[#111] border border-[#1e1e1e] rounded-sm p-5 flex flex-col gap-3">
								{Object.entries(request.data)
									.filter(
										([k]) =>
											![
												"image",
												"logo",
												"profile_picture",
												"gallery_items",
												"content_sr",
												"content_en",
											].includes(k),
									)
									.map(([key, val]) => (
										<div key={key} className="flex gap-3">
											<span className="font-heading text-[7px] tracking-[2px] uppercase text-[#444] w-32 shrink-0 pt-0.5">
												{key.replace(/_/g, " ")}
											</span>
											<span className="font-body text-[10px] text-[#ccc] break-words min-w-0">
												{String(val ?? "—")}
											</span>
										</div>
									))}
							</div>
						</div>
					)}

					{request.admin_notes && (
						<div className="mt-4">
							<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#333] mb-2">
								Admin Notes
							</p>
							<div className="bg-[#111] border border-[#1e1e1e] rounded-sm px-5 py-4 flex items-start gap-2">
								<Info
									size={11}
									strokeWidth={1.5}
									stroke="rgba(255,215,0,0.3)"
									style={{ flexShrink: 0, marginTop: "1px" }}
									aria-hidden="true"
								/>
								<p className="font-body text-[10px] text-[#888]">
									{request.admin_notes}
								</p>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}
