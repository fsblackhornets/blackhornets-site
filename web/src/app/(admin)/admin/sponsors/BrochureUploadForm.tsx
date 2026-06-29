"use client";

import { Check, Info, Upload } from "lucide-react";
import { useActionState, useState } from "react";
import { uploadBrochureAction } from "@/app/actions/brochure";
import { Field } from "@/components/ui/components/Field";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { BROCHURE_LANG_OPTIONS } from "@/constants/sponsors";

export function BrochureUploadForm() {
	const [state, action, pending] = useActionState(uploadBrochureAction, {});
	const [fileName, setFileName] = useState("No file chosen");

	return (
		<form action={action} className="flex flex-col gap-4">
			{state.error && (
				<div className="bg-red-500/8 border border-red-500/20 rounded-none p-3 flex items-center gap-2 text-red-400 text-[9px]">
					<Info size={12} strokeWidth={2} aria-hidden="true" />
					{state.error}
				</div>
			)}
			{state.success && (
				<div className="bg-green-500/8 border border-green-500/20 rounded-none p-3 flex items-center gap-2 text-green-400 text-[9px]">
					<Check size={12} strokeWidth={2} aria-hidden="true" />
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
							className="cursor-pointer border border-primary/40 text-primary font-heading text-[7px] tracking-[2px] uppercase px-3 py-2 transition-colors hover:bg-primary/10 shrink-0"
							style={{
								clipPath:
									"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
							}}
						>
							Choose PDF
						</label>
						<span className="font-body text-[9px] text-[#333] truncate">
							{fileName}
						</span>
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

			<button
				type="submit"
				disabled={pending}
				className="bg-primary text-black font-heading text-[8px] tracking-[3px] uppercase py-3 px-6 self-start flex items-center gap-2 transition-opacity disabled:opacity-60"
				style={{
					clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
				}}
			>
				{pending ? (
					<>
						<span
							className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"
							aria-hidden="true"
						/>
						Uploading…
					</>
				) : (
					<>
						<Upload size={11} strokeWidth={2} aria-hidden="true" />
						Upload Brochure
					</>
				)}
			</button>
		</form>
	);
}
