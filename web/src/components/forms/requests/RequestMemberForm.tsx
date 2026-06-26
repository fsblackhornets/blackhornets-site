"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { SubmitButton } from "@/components/ui/components/SubmitButton";
import { useRequestMemberPreview } from "@/hooks/useRequestPreview";
import { MEMBER_ROLE_OPTIONS, MEMBER_TEAM_OPTIONS } from "@/types/member";

interface Props {
	action: (
		prev: { error?: string; success?: string },
		formData: FormData,
	) => Promise<{ error?: string; success?: string }>;
}

export function RequestMemberForm({ action }: Props) {
	const [state, formAction, pending] = useActionState(action, {});
	const {
		fullName,
		setFullName,
		position,
		setPosition,
		team,
		setTeam,
		imageFile,
		setImageFile,
	} = useRequestMemberPreview();

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

				<input type="hidden" name="type" value="member" />

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<Field label="Full Name *" htmlFor="full_name">
						<Input
							id="full_name"
							name="full_name"
							required
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
						/>
					</Field>
					<Field label="Email *" htmlFor="email">
						<Input id="email" name="email" type="email" required />
					</Field>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<Field label="Phone" htmlFor="phone">
						<Input id="phone" name="phone" type="tel" />
					</Field>
					<Field label="Position" htmlFor="position">
						<Input
							id="position"
							name="position"
							value={position}
							onChange={(e) => setPosition(e.target.value)}
						/>
					</Field>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
					<Field label="Role" htmlFor="role">
						<NativeSelect
							id="role"
							name="role"
							options={MEMBER_ROLE_OPTIONS}
							defaultValue="team_member"
						/>
					</Field>
					<Field label="Team" htmlFor="team">
						<NativeSelect
							id="team"
							name="team"
							options={MEMBER_TEAM_OPTIONS}
							placeholder="— None —"
							value={team}
							onChange={(e) => setTeam(e.target.value)}
						/>
					</Field>
					<Field label="Department" htmlFor="department">
						<Input
							id="department"
							name="department"
							placeholder="e.g. Marketing"
						/>
					</Field>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<Field label="Study Field" htmlFor="study_field">
						<Input id="study_field" name="study_field" />
					</Field>
					<Field label="Faculty" htmlFor="faculty">
						<Input id="faculty" name="faculty" />
					</Field>
				</div>

				<Field label="Academic Year" htmlFor="academic_year">
					<Input
						id="academic_year"
						name="academic_year"
						placeholder="e.g. 3rd year"
					/>
				</Field>

				<Field label="Profile Picture" htmlFor="profile_picture">
					<div className="flex items-center gap-2">
						<label
							htmlFor="profile_picture"
							className="cursor-pointer px-3 py-2 rounded-lg border border-primary text-primary text-xs font-heading tracking-widest hover:bg-primary hover:text-bg-dark transition-colors shrink-0"
						>
							Choose
						</label>
						<span className="text-text-gray text-xs truncate">
							{imageFile ?? "No file chosen"}
						</span>
					</div>
					<input
						id="profile_picture"
						type="file"
						name="profile_picture"
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
				<div className="bg-[#111] border border-primary/10 rounded-xl p-5 flex items-center gap-4">
					<div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-2xl font-heading font-bold text-primary">
						{fullName ? fullName.charAt(0).toUpperCase() : "?"}
					</div>
					<div className="min-w-0">
						<h3 className="font-heading text-base text-text-light leading-snug">
							{fullName || (
								<span className="text-text-gray/40 italic">Full name…</span>
							)}
						</h3>
						{position && (
							<p className="text-text-gray text-xs mt-0.5">{position}</p>
						)}
						{team && (
							<span className="inline-block text-[10px] tracking-[2px] uppercase font-heading border border-primary/30 text-primary rounded-full px-2 py-0.5 mt-1.5">
								{team.replace(/_/g, " ")}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
