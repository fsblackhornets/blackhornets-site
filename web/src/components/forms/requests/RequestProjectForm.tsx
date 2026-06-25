"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { SubmitButton } from "@/components/ui/components/SubmitButton";
import { Textarea } from "@/components/ui/components/Textarea";
import { PROJECT_STATUS_COLORS, PROJECT_STATUS_OPTIONS } from "@/constants/projects";
import type { ProjectStatus } from "@/constants/projects";
import { useRequestProjectPreview } from "@/hooks/useRequestPreview";

interface Props {
	action: (
		prev: { error?: string; success?: string },
		formData: FormData,
	) => Promise<{ error?: string; success?: string }>;
}

export function RequestProjectForm({ action }: Props) {
	const [state, formAction, pending] = useActionState(action, {});
	const { name, setName, description, setDescription, status, setStatus, progress, setProgress, imageFile, setImageFile } =
		useRequestProjectPreview();

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
						<Input id="due_date" name="due_date" type="date" required />
					</Field>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<Field label="Duration *" htmlFor="duration">
						<Input
							id="duration"
							name="duration"
							placeholder="e.g. 6 months"
							required
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
						onChange={(e) => setImageFile(e.target.files?.[0]?.name ?? null)}
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
						<div className="flex items-center justify-between gap-2 mb-3">
							<h3 className="font-heading text-lg text-text-light leading-snug">
								{name || (
									<span className="text-text-gray/40 italic">Project name…</span>
								)}
							</h3>
							<span
								className={`text-[10px] tracking-[2px] uppercase font-heading border rounded-full px-2.5 py-0.5 shrink-0 ${PROJECT_STATUS_COLORS[status]}`}
							>
								{status}
							</span>
						</div>
						<p className="text-text-gray text-sm leading-relaxed mb-4 line-clamp-3">
							{description || (
								<span className="italic">Project description…</span>
							)}
						</p>
						<div>
							<div className="flex justify-between text-xs text-text-gray mb-1">
								<span>Progress</span>
								<span>{progress}%</span>
							</div>
							<div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
								<div
									className="h-full bg-primary rounded-full transition-all"
									style={{ width: `${progress}%` }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
