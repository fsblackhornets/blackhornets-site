"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { SubmitButton } from "@/components/ui/components/SubmitButton";
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
		<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
			<form
				action={formAction}
				encType="multipart/form-data"
				className="flex flex-col gap-5"
			>
				{state.error && (
					<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
						{state.error}
					</div>
				)}
				{state.success && (
					<div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-green-400 text-sm">
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
							className="cursor-pointer px-3 py-2 rounded-lg border border-primary text-primary text-xs font-heading tracking-widest hover:bg-primary hover:text-bg-dark transition-colors shrink-0"
						>
							Choose
						</label>
						<span className="text-text-gray text-xs truncate">
							{imageFile ?? "No file chosen"}
						</span>
					</div>
					<input
						id="image"
						type="file"
						name="image"
						accept="image/*"
						className="sr-only"
						onChange={(e) => {
							const file = e.target.files?.[0];
							setImageFile(file?.name ?? null);
						}}
					/>
				</Field>

				<SubmitButton
					pending={pending}
					label="Submit for Review"
					pendingLabel="Submitting…"
					icon="fas fa-paper-plane"
					className="self-start px-8"
				/>
			</form>

			{/* Live preview */}
			<div className="sticky top-[80px]">
				<p className="text-[10px] tracking-[3px] uppercase text-text-gray/50 font-semibold mb-3">
					Live Preview
				</p>
				<div className="bg-[#111] border border-primary/10 rounded-xl overflow-hidden">
					{imageFile ? (
						<div className="h-40 bg-primary/5 flex items-center justify-center border-b border-primary/10">
							<i className="fas fa-image text-primary/30 text-3xl" />
						</div>
					) : null}
					<div className="p-5">
						{category && (
							<span className="inline-block text-[10px] tracking-[2px] uppercase text-primary font-heading border border-primary/30 rounded-full px-2.5 py-0.5 mb-3">
								{category}
							</span>
						)}
						<h3 className="font-heading text-lg text-text-light leading-snug mb-2">
							{titleSr || (
								<span className="text-text-gray/40 italic">Post title…</span>
							)}
						</h3>
						<p className="text-text-gray text-sm leading-relaxed line-clamp-4">
							{contentSr || (
								<span className="italic">Post content will appear here…</span>
							)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
