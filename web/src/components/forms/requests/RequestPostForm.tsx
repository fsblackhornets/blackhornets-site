"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { Textarea } from "@/components/ui/components/Textarea";
import { useRequestPostPreview } from "@/hooks/useRequestPreview";

interface Props {
	action: (
		prev: { error?: string; success?: string },
		formData: FormData,
	) => Promise<{ error?: string; success?: string }>;
}

export function RequestPostForm({ action }: Props) {
	const [state, formAction, pending] = useActionState(action, {});
	const {
		titleSr,
		setTitleSr,
		contentSr,
		setContentSr,
		category,
		setCategory,
		imageFile,
		setImageFile,
	} = useRequestPostPreview();

	return (
		<div>
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 mb-6">
				<Link
					href="/manager"
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back to Dashboard"
				>
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<line x1="19" y1="12" x2="5" y2="12" />
						<polyline points="12 19 5 12 12 5" />
					</svg>
				</Link>
				<span className="font-heading text-[8px] tracking-[2px] uppercase text-[#333]">
					Dashboard
				</span>
				<span className="text-[#2a2a2a]">›</span>
				<span className="font-heading text-[8px] tracking-[2px] uppercase text-primary">
					Request Post
				</span>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
				{/* Form card */}
				<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm p-5">
					{/* Card header */}
					<div className="flex items-center gap-2 pb-2.5 mb-4 border-b border-[#1e1e1e]">
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#ffd700"
							strokeWidth={1.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
							<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
						</svg>
						<span className="font-heading text-[8px] tracking-[4px] uppercase text-primary">
							Post Details
						</span>
					</div>

					<form action={formAction} className="flex flex-col gap-5">
						{state.error && (
							<div className="bg-red-500/10 border border-red-500/30 rounded-none p-3 text-red-400 text-[10px]">
								{state.error}
							</div>
						)}
						{state.success && (
							<div className="bg-green-500/10 border border-green-500/30 rounded-none p-3 text-green-400 text-[10px]">
								{state.success}
							</div>
						)}

						<input type="hidden" name="type" value="post" />

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<Field label="Title (Serbian) *" htmlFor="title_sr">
								<Input
									id="title_sr"
									name="title_sr"
									required
									value={titleSr}
									onChange={(e) => setTitleSr(e.target.value)}
								/>
							</Field>
							<Field label="Title (English)" htmlFor="title_en">
								<Input id="title_en" name="title_en" />
							</Field>
						</div>

						<Field label="Content (Serbian) *" htmlFor="content_sr">
							<Textarea
								id="content_sr"
								name="content_sr"
								rows={8}
								required
								value={contentSr}
								onChange={(e) => setContentSr(e.target.value)}
							/>
						</Field>

						<Field label="Content (English)" htmlFor="content_en">
							<Textarea id="content_en" name="content_en" rows={8} />
						</Field>

						<Field label="Category" htmlFor="category">
							<Input
								id="category"
								name="category"
								placeholder="e.g. News"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							/>
						</Field>

						<Field label="Image" htmlFor="image">
							<div className="flex items-center gap-2">
								<label
									htmlFor="image"
									className="cursor-pointer border border-primary/40 text-primary font-heading text-[7px] tracking-[2px] uppercase px-3 py-2 transition-colors hover:bg-primary/10 shrink-0"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
									}}
								>
									Choose
								</label>
								<span className="text-[#555] text-[9px] truncate">
									{imageFile ?? "No file chosen"}
								</span>
							</div>
							<input
								id="image"
								type="file"
								name="image"
								accept="image/*"
								className="sr-only"
								onChange={(e) =>
									setImageFile(e.target.files?.[0]?.name ?? null)
								}
							/>
						</Field>

						<button
							type="submit"
							disabled={pending}
							className="bg-primary text-black font-heading text-[9px] tracking-[3px] uppercase py-3 px-6 flex items-center gap-2 self-start transition-opacity disabled:opacity-50"
							style={{
								clipPath:
									"polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
							}}
						>
							{pending ? (
								<>
									<span
										className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"
										aria-hidden="true"
									/>
									Submitting…
								</>
							) : (
								<>
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<line x1="22" y1="2" x2="11" y2="13" />
										<polygon points="22 2 15 22 11 13 2 9 22 2" />
									</svg>
									Submit for Review
								</>
							)}
						</button>
					</form>
				</div>

				{/* Live preview */}
				<div className="sticky top-[80px]">
					<p className="font-heading text-[7px] tracking-[4px] uppercase text-[#333] mb-3">
						Live Preview
					</p>
					<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary/40 rounded-sm overflow-hidden">
						{imageFile ? (
							<div className="h-40 bg-primary/5 flex items-center justify-center border-b border-[#1e1e1e]">
								<svg
									width="28"
									height="28"
									viewBox="0 0 24 24"
									fill="none"
									stroke="rgba(255,215,0,0.2)"
									strokeWidth={1.5}
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
									<circle cx="8.5" cy="8.5" r="1.5" />
									<polyline points="21 15 16 10 5 21" />
								</svg>
							</div>
						) : null}
						<div className="p-5">
							{category && (
								<span
									className="inline-block font-heading text-[7px] tracking-[2px] uppercase text-primary bg-primary/10 px-2.5 py-1 mb-3"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
									}}
								>
									{category}
								</span>
							)}
							<h3 className="font-heading text-base text-text-light leading-snug mb-2">
								{titleSr || (
									<span className="text-[#444] italic">Post title…</span>
								)}
							</h3>
							<p className="font-body text-[10px] text-[#666] leading-relaxed line-clamp-4">
								{contentSr || (
									<span className="italic">Post content will appear here…</span>
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
