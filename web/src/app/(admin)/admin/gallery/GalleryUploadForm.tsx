"use client";

import { useActionState, useState } from "react";
import { uploadGalleryImageAction } from "@/app/actions/gallery";
import { GALLERY_CATEGORY_OPTIONS } from "@/constants/gallery";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { SubmitButton } from "@/components/ui/components/SubmitButton";

const CATEGORY_OPTIONS = GALLERY_CATEGORY_OPTIONS;

export function GalleryUploadForm() {
	const [state, action, pending] = useActionState(uploadGalleryImageAction, {});
	const [fileName, setFileName] = useState("No file chosen");

	return (
		<form action={action} className="flex flex-col gap-4">
			{state.error && (
				<div className="bg-red-500/8 border border-red-500/20 rounded-none p-3 text-red-400 text-[9px]">
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
							className="cursor-pointer font-heading text-[7px] tracking-[2px] uppercase text-black bg-primary px-3 py-2 shrink-0 hover:bg-yellow-300 transition-colors"
							style={{
								clipPath:
									"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
							}}
						>
							Choose File
						</label>
						<span className="font-body text-[9px] text-[#444] truncate">
							{fileName}
						</span>
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
				className="self-start"
			/>
		</form>
	);
}
