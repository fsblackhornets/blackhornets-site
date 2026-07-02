"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ProjectPreview } from "@/components/forms/projects/ProjectPreview";
import { ArrowLeftIcon, GearIcon, SendIcon } from "@/components/icons";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { Textarea } from "@/components/ui/components/Textarea";
import type { ProjectStatus } from "@/constants/projects";
import { PROJECT_STATUS_OPTIONS } from "@/constants/projects";
import { useRequestProjectPreview } from "@/hooks/useRequestPreview";

interface Props {
	action: (
		prev: { error?: string; success?: string },
		formData: FormData,
	) => Promise<{ error?: string; success?: string }>;
}

export function RequestProjectForm({ action }: Props) {
	const [state, formAction, pending] = useActionState(action, {});
	const {
		name,
		setName,
		description,
		setDescription,
		status,
		setStatus,
		dueDate,
		setDueDate,
		duration,
		setDuration,
		progress,
		setProgress,
		imageFile,
		imagePreviewUrl,
		handleImageChange,
	} = useRequestProjectPreview();

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
					Request Project
				</span>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
				{/* Form card */}
				<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm p-5">
					{/* Card header */}
					<div className="flex items-center gap-2 pb-2.5 mb-4 border-b border-[#1e1e1e]">
						<GearIcon size={13} strokeWidth={1.5} className="text-primary" />
						<span className="font-heading text-[8px] tracking-[4px] uppercase text-primary">
							Project Details
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

						<input type="hidden" name="type" value="project" />

						<Field label="Project Name *" htmlFor="name">
							<Input
								id="name"
								name="name"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Field>

						<Field label="Description" htmlFor="description">
							<Textarea
								id="description"
								name="description"
								rows={5}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</Field>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<Field label="Status *" htmlFor="status">
								<NativeSelect
									id="status"
									name="status"
									options={PROJECT_STATUS_OPTIONS}
									required
									value={status}
									onChange={(e) => setStatus(e.target.value as ProjectStatus)}
								/>
							</Field>
							<Field label="Due Date *" htmlFor="due_date">
								<Input
									id="due_date"
									name="due_date"
									type="date"
									required
									value={dueDate}
									onChange={(e) => setDueDate(e.target.value)}
								/>
							</Field>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<Field label="Duration *" htmlFor="duration">
								<Input
									id="duration"
									name="duration"
									placeholder="e.g. 6 months"
									required
									value={duration}
									onChange={(e) => setDuration(e.target.value)}
								/>
							</Field>
							<Field label={`Progress: ${progress}%`} htmlFor="progress">
								<div className="flex items-center gap-3">
									<input
										id="progress"
										name="progress"
										type="range"
										min={0}
										max={100}
										value={progress}
										onChange={(e) => setProgress(Number(e.target.value))}
										className="flex-1 accent-primary"
									/>
									<span className="font-heading text-[11px] text-primary shrink-0 w-8 text-right">
										{progress}%
									</span>
								</div>
							</Field>
						</div>

						<Field label="Image" htmlFor="image">
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
					<ProjectPreview
						name={name}
						status={status}
						description={description}
						dueDate={dueDate}
						duration={duration}
						progress={progress}
						previewUrl={imagePreviewUrl}
					/>
				</div>
			</div>
		</div>
	);
}
