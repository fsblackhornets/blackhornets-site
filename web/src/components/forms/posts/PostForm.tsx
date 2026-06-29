"use client";

import { useActionState, useRef, useState } from "react";
import {
	extractGalleryItems,
	RichTextEditor,
} from "@/components/editor/RichTextEditor";
import { SECTION_CARD, SECTION_HEAD } from "@/constants/forms";
import { AlertCircleIcon, SaveIcon } from "@/components/icons";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import type { Post } from "@/types/post";

interface PostFormProps {
	action: (
		prev: { error?: string },
		formData: FormData,
	) => Promise<{ error?: string }>;
	post?: Post;
	submitLabel?: string;
}

export function PostForm({ action, post, submitLabel }: PostFormProps) {
	const [state, formAction, pending] = useActionState(action, {});

	const [lang, setLang] = useState<"sr" | "en">("sr");
	const [titleSr, setTitleSr] = useState(post?.title_sr ?? "");
	const [titleEn, setTitleEn] = useState(post?.title_en ?? "");
	const [contentSr, setContentSr] = useState(post?.content_sr ?? "");
	const [contentEn, setContentEn] = useState(post?.content_en ?? "");

	const galleryItemsRef = useRef<string>("[]");

	function handleSrChange(html: string) {
		setContentSr(html);
		galleryItemsRef.current = JSON.stringify(extractGalleryItems(html));
	}

	const defaultLabel = post ? "Save Changes" : "Publish Post";
	const defaultPendingLabel = post ? "Saving…" : "Publishing…";

	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
			{/* Form column */}
			<form
				action={async (fd) => {
					fd.set("content_sr", contentSr);
					fd.set("content_en", contentEn);
					fd.set("gallery_items", galleryItemsRef.current);
					await formAction(fd);
				}}
				className="flex flex-col"
			>
				{state.error && (
					<div className="bg-red-500/8 border border-red-500/20 rounded-none p-3 flex items-center gap-2 text-red-400 text-[9px] mb-4">
						<AlertCircleIcon size={12} />
						{state.error}
					</div>
				)}

				{/* Content card */}
				<div className={SECTION_CARD}>
					<h2 className={SECTION_HEAD}>Content</h2>
					<div className="flex flex-col gap-5">
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

						{/* SR/EN toggle + Tiptap editor */}
						<div>
							<div className="flex gap-1 mb-3">
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
									onChange={setContentEn}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Settings card */}
				<div className={SECTION_CARD}>
					<h2 className={SECTION_HEAD}>Settings</h2>
					<div className="flex flex-col gap-5">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<Field label="Category" htmlFor="category">
								<Input
									id="category"
									name="category"
									placeholder="e.g. News"
									defaultValue={post?.category ?? ""}
								/>
							</Field>
							<Field label="Author" htmlFor="author">
								<Input
									id="author"
									name="author"
									defaultValue={post?.author ?? ""}
								/>
							</Field>
						</div>

						{post && (
							<Field label="Status" htmlFor="status">
								<NativeSelect
									id="status"
									name="status"
									defaultValue={post.status}
									options={[
										{ value: "published", label: "Published" },
										{ value: "draft", label: "Draft" },
									]}
								/>
							</Field>
						)}

						<label className="flex items-center gap-3 cursor-pointer group">
							<input
								type="checkbox"
								name="featured"
								value="1"
								defaultChecked={post?.featured === 1}
								className="w-3.5 h-3.5 accent-primary"
							/>
							<span className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] group-hover:text-primary transition-colors">
								Featured post
							</span>
						</label>
					</div>
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={pending}
					className="bg-primary text-black font-heading text-[8px] tracking-[3px] uppercase py-3.5 px-8 self-start flex items-center gap-2 transition-opacity disabled:opacity-60"
					style={{
						clipPath: "polygon(0 0, calc(100% - 9px) 0, 100% 100%, 9px 100%)",
					}}
				>
					{pending ? (
						<>
							<span
								className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"
								aria-hidden="true"
							/>
							{defaultPendingLabel}
						</>
					) : (
						<>
							<SaveIcon size={11} />
							{submitLabel ?? defaultLabel}
						</>
					)}
				</button>
			</form>

			{/* Preview panel */}
			<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm p-5 sticky top-6">
				<h2 className={SECTION_HEAD}>Preview</h2>
				{titleSr || contentSr ? (
					<div>
						{titleSr && (
							<h3 className="font-heading text-[13px] tracking-wider uppercase text-white mb-3">
								{titleSr}
							</h3>
						)}
						{contentSr && (
							<div
								className="font-body text-[11px] text-[#888] leading-relaxed"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: rendering trusted editor HTML
								dangerouslySetInnerHTML={{ __html: contentSr }}
							/>
						)}
					</div>
				) : (
					<p className="font-body text-[9px] text-[#2a2a2a] tracking-[2px] uppercase text-center py-8">
						Start typing to see preview…
					</p>
				)}
			</div>
		</div>
	);
}
