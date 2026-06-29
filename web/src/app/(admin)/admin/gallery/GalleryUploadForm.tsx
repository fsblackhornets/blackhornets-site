"use client";

import { useActionState, useState } from "react";
import { uploadGalleryImageAction } from "@/app/actions/gallery";
import { GALLERY_SECTIONS } from "@/components/pagecomponents/gallery/constants";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { SubmitButton } from "@/components/ui/components/SubmitButton";

const CATEGORY_OPTIONS = GALLERY_SECTIONS.map(({ category, title }) => ({
	value: category,
	label: title,
}));

export function GalleryUploadForm() {
	const [state, action, pending] = useActionState(uploadGalleryImageAction, {});
	const [fileName, setFileName] = useState("No file chosen");

	return (
		<form action={action} className="flex flex-col gap-4">
			{state.error && (
				<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
					{state.error}
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Field label="Category *" htmlFor="category">
					<NativeSelect
						id="category"
						name="category"
						options={CATEGORY_OPTIONS}
						required
					/>
				</Field>
				<Field label="Title (optional)" htmlFor="title">
					<Input id="title" name="title" placeholder="e.g. Race day 2024" />
				</Field>
				<Field label="Image *" htmlFor="image">
					<div className="flex items-center gap-2">
						<label
							htmlFor="image"
							className="cursor-pointer px-3 py-2 rounded-lg border border-primary text-primary text-xs font-heading tracking-widest hover:bg-primary hover:text-bg-dark transition-colors shrink-0"
						>
							Choose
						</label>
						<span className="text-text-gray text-xs truncate">{fileName}</span>
					</div>
					<input
						id="image"
						type="file"
						name="image"
						accept="image/*"
						required
						className="sr-only"
						onChange={(e) =>
							setFileName(e.target.files?.[0]?.name ?? "No file chosen")
						}
					/>
				</Field>
			</div>

			<SubmitButton
				pending={pending}
				label="Upload Image"
				pendingLabel="Uploading…"
				icon="fas fa-upload"
				className="self-start"
			/>
		</form>
	);
}
