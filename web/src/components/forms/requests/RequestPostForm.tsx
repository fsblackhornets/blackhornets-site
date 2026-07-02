"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import {
	extractGalleryItems,
	RichTextEditor,
} from "@/components/editor/RichTextEditor";
import { BlogPostPreview } from "@/components/forms/posts/BlogPostPreview";
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
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

	const galleryItemsRef = useRef<string>("[]");
	const objectUrlRef = useRef<string | null>(null);

	useEffect(() => {
		return () => {
			if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		};
	}, []);

	function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		setImageFile(file?.name ?? null);
		if (!file) return;
		if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		const url = URL.createObjectURL(file);
		objectUrlRef.current = url;
		setImagePreviewUrl(url);
	}

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
								onChange={handleImageChange}
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
					<BlogPostPreview
						titleSr={titleSr}
						category={category}
						contentSr={contentSr}
						imagePreviewUrl={imagePreviewUrl}
						galleryCount={galleryCount}
					/>
				</div>
			</div>
		</div>
	);
}
