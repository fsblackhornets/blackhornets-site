"use client";

import { useActionState, useState } from "react";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { SubmitButton } from "@/components/ui/components/SubmitButton";
import { Textarea } from "@/components/ui/components/Textarea";
import { PROJECT_STATUS_OPTIONS } from "@/constants/projects";
import type { Project } from "@/types/project";

interface ProjectFormProps {
	action: (
		prev: { error?: string },
		formData: FormData,
	) => Promise<{ error?: string }>;
	project?: Project;
}

export function ProjectForm({ action, project }: ProjectFormProps) {
	const [state, formAction, pending] = useActionState(action, {});
	const [fileName, setFileName] = useState("No file chosen");
	const [progress, setProgress] = useState(project?.progress ?? 0);

	return (
		<form
			action={formAction}
			encType="multipart/form-data"
			className="flex flex-col gap-5 max-w-[720px]"
		>
			{state.error && (
				<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
					{state.error}
				</div>
			)}

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

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<Field label="Duration *" htmlFor="duration">
					<Input
						id="duration"
						name="duration"
						placeholder="e.g. 6 months"
						required
						defaultValue={project?.duration ?? ""}
					/>
				</Field>
				<Field label={`Progress: ${progress}%`} htmlFor="progress">
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
				</Field>
			</div>

			<Field
				label={project ? "Image (leave empty to keep current)" : "Image"}
				htmlFor="image"
			>
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
					className="sr-only"
					onChange={(e) =>
						setFileName(e.target.files?.[0]?.name ?? "No file chosen")
					}
				/>
			</Field>

			<SubmitButton
				pending={pending}
				label={project ? "Save Changes" : "Create Project"}
				pendingLabel={project ? "Saving…" : "Creating…"}
				icon="fas fa-save"
				className="self-start px-8"
			/>
		</form>
	);
}
