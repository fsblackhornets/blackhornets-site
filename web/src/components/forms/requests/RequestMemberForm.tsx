"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeftIcon, SendIcon, UsersIcon } from "@/components/icons";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
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
					Request Member
				</span>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
				{/* Form card */}
				<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm p-5">
					{/* Card header */}
					<div className="flex items-center gap-2 pb-2.5 mb-4 border-b border-[#1e1e1e]">
						<UsersIcon size={13} strokeWidth={1.5} className="text-primary" />
						<span className="font-heading text-[8px] tracking-[4px] uppercase text-primary">
							Member Details
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
								id="profile_picture"
								type="file"
								name="profile_picture"
								accept="image/*"
								className="sr-only"
								onChange={(e) =>
									setImageFile(e.target.files?.[0]?.name ?? null)
								}
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
					<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary/40 rounded-sm p-5 flex items-center gap-4">
						<div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-2xl font-heading font-bold text-primary">
							{fullName ? fullName.charAt(0).toUpperCase() : "?"}
						</div>
						<div className="min-w-0">
							<h3 className="font-heading text-base text-text-light leading-snug">
								{fullName || (
									<span className="text-[#444] italic">Full name…</span>
								)}
							</h3>
							{position && (
								<p className="font-body text-[10px] text-[#666] mt-0.5">
									{position}
								</p>
							)}
							{team && (
								<span
									className="inline-block font-heading text-[7px] tracking-[2px] uppercase text-primary bg-primary/10 px-2 py-1 mt-1.5"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
									}}
								>
									{team.replace(/_/g, " ")}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
