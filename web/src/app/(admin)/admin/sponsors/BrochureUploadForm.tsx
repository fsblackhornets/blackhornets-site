"use client";

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
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					{state.error}
				</div>
			)}
			{state.success && (
				<div className="bg-green-500/8 border border-green-500/20 rounded-none p-3 flex items-center gap-2 text-green-400 text-[9px]">
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						aria-hidden="true"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
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
						<svg
							width="11"
							height="11"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							aria-hidden="true"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="17 8 12 3 7 8" />
							<line x1="12" y1="3" x2="12" y2="15" />
						</svg>
						Upload Brochure
					</>
				)}
			</button>
		</form>
	);
}
