"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import {
	extractGalleryItems,
	RichTextEditor,
} from "@/components/editor/RichTextEditor";
import {
	ArrowLeftIcon,
	ImageIcon,
	PencilIcon,
	SendIcon,
} from "@/components/icons";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";

interface DefaultValues {
	title_sr?: string;
	title_en?: string;
	content_sr?: string;
	content_en?: string;
	category?: string;
}

interface Props {
	action: (
		prev: { error?: string; success?: string },
		formData: FormData,
	) => Promise<{ error?: string; success?: string }>;
	defaultValues?: DefaultValues;
	label?: string;
}

export function RequestPostForm({
	action,
	defaultValues,
	label = "Request Post",
}: Props) {
	const [state, formAction, pending] = useActionState(action, {});

	const [lang, setLang] = useState<"sr" | "en">("sr");
	const [titleSr, setTitleSr] = useState(defaultValues?.title_sr ?? "");
	const [titleEn, setTitleEn] = useState(defaultValues?.title_en ?? "");
	const [contentSr, setContentSr] = useState(defaultValues?.content_sr ?? "");
	const [contentEn, setContentEn] = useState(defaultValues?.content_en ?? "");
	const [category, setCategory] = useState(defaultValues?.category ?? "");
	const [imageFile, setImageFile] = useState<string | null>(null);
	const [previewTab, setPreviewTab] = useState<"card" | "full">("card");

	const galleryItemsRef = useRef<string>("[]");

	function handleSrChange(html: string) {
		setContentSr(html);
		const items = extractGalleryItems(html);
		galleryItemsRef.current = JSON.stringify(items);
	}

	function handleEnChange(html: string) {
		setContentEn(html);
	}

	const galleryCount = (() => {
		try {
			return (JSON.parse(galleryItemsRef.current) as unknown[]).length;
		} catch {
			return 0;
		}
	})();

	return (
		<div>
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 mb-6">
				<Link
					href="/manager"
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back to Dashboard"
				>
					<ArrowLeftIcon size={13} />
				</Link>
				<span className="font-heading text-[8px] tracking-[2px] uppercase text-[#333]">
					Dashboard
				</span>
				<span className="text-[#2a2a2a]">›</span>
				<span className="font-heading text-[8px] tracking-[2px] uppercase text-primary">
					{label}
				</span>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
				{/* Form card */}
				<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm p-5">
					{/* Card header */}
					<div className="flex items-center gap-2 pb-2.5 mb-4 border-b border-[#1e1e1e]">
						<PencilIcon size={13} strokeWidth={1.5} className="text-primary" />
						<span className="font-heading text-[8px] tracking-[4px] uppercase text-primary">
							Post Details
						</span>
					</div>

					<form
						action={async (fd) => {
							fd.set("content_sr", contentSr);
							fd.set("content_en", contentEn);
							fd.set("gallery_items", galleryItemsRef.current);
							await formAction(fd);
						}}
						className="flex flex-col gap-5"
					>
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
								<Input
									id="title_en"
									name="title_en"
									value={titleEn}
									onChange={(e) => setTitleEn(e.target.value)}
								/>
							</Field>
						</div>

						{/* SR/EN toggle for content */}
						<div>
							<div className="flex gap-1 mb-2">
								{(["sr", "en"] as const).map((l) => (
									<button
										key={l}
										type="button"
										onClick={() => setLang(l)}
										className="font-heading text-[7px] tracking-[2px] uppercase px-3 py-1.5 transition-colors"
										style={{
											clipPath:
												"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
											border:
												lang === l ? "1px solid #ffd700" : "1px solid #222",
											background:
												lang === l ? "rgba(255,215,0,0.1)" : "transparent",
											color: lang === l ? "#ffd700" : "#555",
										}}
									>
										{l === "sr" ? "Serbian" : "English"}
									</button>
								))}
								<span className="ml-auto font-heading text-[7px] tracking-[2px] uppercase text-[#333] self-center">
									Content *
								</span>
							</div>

							<div style={{ display: lang === "sr" ? "block" : "none" }}>
								<RichTextEditor
									content={contentSr}
									placeholder="Write the Serbian content…"
									onChange={handleSrChange}
								/>
							</div>
							<div style={{ display: lang === "en" ? "block" : "none" }}>
								<RichTextEditor
									content={contentEn}
									placeholder="Write the English content…"
									onChange={handleEnChange}
								/>
							</div>
						</div>

						<Field label="Category" htmlFor="category">
							<Input
								id="category"
								name="category"
								placeholder="e.g. News"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							/>
						</Field>

						<Field label="Cover Image" htmlFor="image">
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

						{galleryCount > 0 && (
							<div className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-sm px-3 py-2">
								<ImageIcon
									size={11}
									strokeWidth={1.5}
									className="text-primary"
								/>
								<span className="font-body text-[8px] text-primary/70">
									{galleryCount} image{galleryCount !== 1 ? "s" : ""} will be
									added to Gallery on approval
								</span>
							</div>
						)}

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
									<SendIcon size={12} />
									Submit for Review
								</>
							)}
						</button>
					</form>
				</div>

				{/* Live preview */}
				<div className="sticky top-[80px]">
					<div className="flex items-center justify-between mb-3">
						<p className="font-heading text-[7px] tracking-[4px] uppercase text-[#333]">
							Live Preview
						</p>
						<div className="flex gap-1">
							{(["card", "full"] as const).map((t) => (
								<button
									key={t}
									type="button"
									onClick={() => setPreviewTab(t)}
									className="font-heading text-[6.5px] tracking-[2px] uppercase px-2 py-1 transition-colors"
									style={{
										border:
											previewTab === t ? "1px solid #ffd700" : "1px solid #222",
										background:
											previewTab === t ? "rgba(255,215,0,0.08)" : "transparent",
										color: previewTab === t ? "#ffd700" : "#444",
										clipPath:
											"polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
									}}
								>
									{t === "card" ? "Blog Card" : "Full Post"}
								</button>
							))}
						</div>
					</div>

					{previewTab === "card" ? (
						<div className="bg-bg-panel rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary/40 overflow-hidden">
							{imageFile && (
								<div className="h-40 bg-primary/5 flex items-center justify-center border-b border-[#1e1e1e]">
									<ImageIcon
										size={28}
										strokeWidth={1.5}
										className="text-primary/20"
									/>
								</div>
							)}
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
									{contentSr.replace(/<[^>]+>/g, " ").trim() || (
										<span className="italic">
											Post content will appear here…
										</span>
									)}
								</p>
							</div>
						</div>
					) : (
						<div className="bg-bg-dark border border-[#1e1e1e] border-t-2 border-t-primary/40 rounded-sm overflow-hidden">
							<div className="p-8">
								{category && (
									<span
										className="inline-block font-body text-[7px] tracking-[1.5px] uppercase bg-primary/10 text-primary border border-primary/20 px-2.5 py-1.5 mb-4"
										style={{
											clipPath:
												"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
										}}
									>
										{category}
									</span>
								)}
								{titleSr && (
									<h1 className="font-heading text-[clamp(1.6rem,4vw,2.4rem)] text-primary uppercase tracking-[1px] leading-tight mb-5">
										{titleSr}
									</h1>
								)}
								<div
									className="prose prose-invert prose-yellow max-w-none text-text-light leading-relaxed
										[&_h2]:font-heading [&_h2]:text-white [&_h2]:uppercase [&_h2]:tracking-[2px] [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2.5 [&_h2]:before:content-[''] [&_h2]:before:w-[3px] [&_h2]:before:h-5 [&_h2]:before:bg-primary [&_h2]:before:flex-shrink-0
										[&_h3]:font-heading [&_h3]:text-primary
										[&_blockquote]:border-l-[3px] [&_blockquote]:border-primary [&_blockquote]:bg-primary/[0.04] [&_blockquote]:rounded-none [&_blockquote]:px-5 [&_blockquote]:py-4
										[&_img]:rounded-none [&_img]:border [&_img]:border-[#1e1e1e]
										[&_a]:text-primary [&_a]:no-underline [&_a]:border-b [&_a]:border-primary/30 [&_a]:hover:border-primary"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: rendering user-authored post preview
									dangerouslySetInnerHTML={{
										__html:
											contentSr ||
											"<p class='text-[#333] italic'>Post content will appear here…</p>",
									}}
								/>
							</div>
							{galleryCount > 0 && (
								<div className="border-t border-[#1e1e1e] px-5 py-3 flex items-center gap-2">
									<ImageIcon
										size={10}
										strokeWidth={1.5}
										className="text-primary/40"
									/>
									<span className="font-body text-[8px] text-[#333]">
										Gallery: {galleryCount} image{galleryCount !== 1 ? "s" : ""}{" "}
										queued
									</span>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
