"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowLeftIcon, ImageIcon, SendIcon } from "@/components/icons";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { GALLERY_CATEGORY_OPTIONS } from "@/constants/gallery";

const CATEGORY_OPTIONS = GALLERY_CATEGORY_OPTIONS;

interface Props {
	action: (
		prev: { error?: string; success?: string },
		formData: FormData,
	) => Promise<{ error?: string; success?: string }>;
}

export function RequestGalleryForm({ action }: Props) {
	const [state, formAction, pending] = useActionState(action, {});
	const [fileCount, setFileCount] = useState(0);

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
					Request Gallery
				</span>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
				{/* Form card */}
				<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm p-5">
					{/* Card header */}
					<div className="flex items-center gap-2 pb-2.5 mb-4 border-b border-[#1e1e1e]">
						<ImageIcon size={13} strokeWidth={1.5} className="text-primary" />
						<span className="font-heading text-[8px] tracking-[4px] uppercase text-primary">
							Gallery Upload
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

						<input type="hidden" name="type" value="gallery" />

						<Field label="Category *" htmlFor="category">
							<NativeSelect
								id="category"
								name="category"
								options={CATEGORY_OPTIONS}
								required
							/>
						</Field>

						<Field label="Title (optional)" htmlFor="title">
							<Input
								id="title"
								name="title"
								placeholder="e.g. Formula Student 2025"
							/>
						</Field>

						<Field label="Images *" htmlFor="images">
							<div className="flex items-center gap-2">
								<label
									htmlFor="images"
									className="cursor-pointer border border-primary/40 text-primary font-heading text-[7px] tracking-[2px] uppercase px-3 py-2 transition-colors hover:bg-primary/10 shrink-0"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
									}}
								>
									Choose Files
								</label>
								<span className="text-[#555] text-[9px] truncate">
									{fileCount > 0
										? `${fileCount} file${fileCount > 1 ? "s" : ""} selected`
										: "No files chosen"}
								</span>
							</div>
							<input
								id="images"
								type="file"
								name="images"
								accept="image/*"
								multiple
								className="sr-only"
								onChange={(e) => setFileCount(e.target.files?.length ?? 0)}
							/>
						</Field>

						<Field label="Alt Text (optional)" htmlFor="alt_text">
							<Input
								id="alt_text"
								name="alt_text"
								placeholder="Brief description of the images"
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
									<SendIcon size={12} />
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
					<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary/40 rounded-sm p-4">
						<p className="font-heading text-[7px] tracking-[2px] uppercase text-[#444] mb-3">
							Gallery Tiles
						</p>
						<div className="grid grid-cols-2 gap-2">
							{[0, 1, 2, 3].map((i) => (
								<div
									key={i}
									className="aspect-square bg-[#0f0f0f] border border-[#1e1e1e] flex items-center justify-center"
								>
									<ImageIcon
										size={20}
										strokeWidth={1.5}
										className="text-primary/[0.12]"
									/>
								</div>
							))}
						</div>
						<p className="font-body text-[8px] text-[#333] mt-3 text-center">
							{fileCount > 0
								? `${fileCount} image${fileCount > 1 ? "s" : ""} queued for review`
								: "Select images to preview count"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
