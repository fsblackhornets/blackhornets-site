"use client";

import { useActionState, useState } from "react";
import { uploadBrochureAction } from "@/app/actions/brochure";
import { Field } from "@/components/ui/components/Field";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { SubmitButton } from "@/components/ui/components/SubmitButton";
import { BROCHURE_LANG_OPTIONS } from "@/constants/sponsors";

export function BrochureUploadForm() {
	const [state, action, pending] = useActionState(uploadBrochureAction, {});
	const [fileName, setFileName] = useState("No file chosen");

	return (
		<form
			action={action}
			encType="multipart/form-data"
			className="flex flex-col gap-4"
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

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Field label="Language" htmlFor="lang">
					<NativeSelect id="lang" name="lang" options={BROCHURE_LANG_OPTIONS} />
				</Field>
				<Field label="PDF File *" htmlFor="brochure_pdf">
					<div className="flex items-center gap-2">
						<label
							htmlFor="brochure_pdf"
							className="cursor-pointer px-3 py-2 rounded-lg border border-primary text-primary text-xs font-heading tracking-widest hover:bg-primary hover:text-bg-dark transition-colors shrink-0"
						>
							Choose
						</label>
						<span className="text-text-gray text-xs truncate">{fileName}</span>
					</div>
					<input
						id="brochure_pdf"
						type="file"
						name="brochure_pdf"
						accept="application/pdf"
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
				label="Upload Brochure"
				pendingLabel="Uploading…"
				icon="fas fa-file-upload"
				className="self-start"
			/>
		</form>
	);
}
