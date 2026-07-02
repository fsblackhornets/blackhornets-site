"use client";

import { useActionState } from "react";
import { ProjectPreview } from "@/components/forms/projects/ProjectPreview";
import { AlertCircleIcon, SaveIcon } from "@/components/icons";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { Textarea } from "@/components/ui/components/Textarea";
import { SECTION_CARD, SECTION_HEAD } from "@/constants/forms";
import { PROJECT_STATUS_OPTIONS } from "@/constants/projects";
import { useProjectFormPreview } from "@/hooks/projects/useProjectFormPreview";
import type { Project } from "@/types/project";

interface ProjectFormProps {
	action: (
		prev: { error?: string },
		formData: FormData,
	) => Promise<{ error?: string }>;
	project?: Project;
	submitLabel?: string;
}

export function ProjectForm({
	action,
	project,
	submitLabel,
}: ProjectFormProps) {
	const [state, formAction, pending] = useActionState(action, {});
	const {
		formRef,
		fileName,
		handleFileChange,
		previewUrl,
		progress,
		setProgress,
		preview,
		syncPreview,
	} = useProjectFormPreview(project);

	const defaultLabel = project ? "Save Changes" : "Create Project";
	const defaultPendingLabel = project ? "Saving…" : "Creating…";

	return (
		<div className="flex flex-col lg:flex-row gap-8 items-start">
			<form
				ref={formRef}
				action={formAction}
				onInput={syncPreview}
				className="flex flex-col max-w-[720px] flex-1 min-w-0"
			>
				{state.error && (
					<div className="bg-red-500/8 border border-red-500/20 rounded-none p-3 flex items-center gap-2 text-red-400 text-[9px] mb-4">
						<AlertCircleIcon size={12} />
						{state.error}
					</div>
				)}

				{/* Project Info card */}
				<div className={SECTION_CARD}>
					<h2 className={SECTION_HEAD}>Project Info</h2>
					<div className="flex flex-col gap-5">
						<Field label="Project Name *" htmlFor="name">
							<Input
								id="name"
								name="name"
								required
								defaultValue={project?.name ?? ""}
							/>
						</Field>
						<Field label="Description" htmlFor="description">
							<Textarea
								id="description"
								name="description"
								rows={5}
								defaultValue={project?.description ?? ""}
							/>
						</Field>
						<Field
							label={project ? "Image (leave empty to keep current)" : "Image"}
							htmlFor="image"
						>
							<div className="flex items-center gap-2">
								<label
									htmlFor="image"
									className="cursor-pointer border border-primary/40 text-primary font-heading text-[7px] tracking-[2px] uppercase px-3 py-2 transition-colors hover:bg-primary/10 shrink-0"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
									}}
								>
									Choose File
								</label>
								<span className="font-body text-[9px] text-[#333] truncate">
									{fileName}
								</span>
							</div>
							<input
								id="image"
								type="file"
								name="image"
								accept="image/*"
								className="sr-only"
								onChange={handleFileChange}
							/>
							{previewUrl && (
								// biome-ignore lint/performance/noImgElement: blob preview URL, next/image can't handle it
								<img
									src={previewUrl}
									alt="Preview"
									className="mt-3 w-full max-w-[280px] h-40 object-cover rounded-sm border border-[#222]"
								/>
							)}
						</Field>
					</div>
				</div>

				{/* Details card */}
				<div className={SECTION_CARD}>
					<h2 className={SECTION_HEAD}>Details</h2>
					<div className="flex flex-col gap-5">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							<Field label="Status *" htmlFor="status">
								<NativeSelect
									id="status"
									name="status"
									options={PROJECT_STATUS_OPTIONS}
									required
									defaultValue={project?.status ?? "Active"}
								/>
							</Field>
							<Field label="Due Date *" htmlFor="due_date">
								<Input
									id="due_date"
									name="due_date"
									type="date"
									required
									defaultValue={project?.due_date?.slice(0, 10) ?? ""}
								/>
							</Field>
						</div>
						<Field label="Duration *" htmlFor="duration">
							<Input
								id="duration"
								name="duration"
								placeholder="e.g. 6 months"
								required
								defaultValue={project?.duration ?? ""}
							/>
						</Field>
						{/* Progress slider */}
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between mb-1">
								<label
									htmlFor="progress"
									className="font-heading text-[7px] tracking-[3px] uppercase text-[#444]"
								>
									Progress
								</label>
								<span className="font-heading text-[8px] tracking-[1px] text-primary tabular-nums">
									{progress}%
								</span>
							</div>
							<input
								id="progress"
								name="progress"
								type="range"
								min={0}
								max={100}
								value={progress}
								onChange={(e) => setProgress(Number(e.target.value))}
								className="w-full accent-primary"
							/>
						</div>
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

			{/* Live preview — mirrors the public ProjectCard */}
			<div className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-6">
				<ProjectPreview
					name={preview.name}
					status={preview.status}
					description={preview.description}
					dueDate={preview.due_date}
					duration={preview.duration}
					progress={progress}
					previewUrl={previewUrl}
				/>
			</div>
		</div>
	);
}
