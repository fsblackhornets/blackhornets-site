"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { MemberPreview } from "@/components/forms/members/MemberPreview";
import { AlertCircleIcon, SaveIcon, UserIcon } from "@/components/icons";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { SECTION_CARD, SECTION_HEAD } from "@/constants/forms";
import { buildProfileImageUrl } from "@/lib/utils/utils";
import type { AdminMember, MemberRole } from "@/types/member";
import { MEMBER_ROLE_OPTIONS, MEMBER_TEAM_OPTIONS } from "@/types/member";

interface MemberFormProps {
	action: (
		prev: { error?: string },
		formData: FormData,
	) => Promise<{ error?: string }>;
	member?: AdminMember;
	submitLabel?: string;
}

export function MemberForm({ action, member, submitLabel }: MemberFormProps) {
	const [state, formAction, pending] = useActionState(action, {});
	const [avatarFile, setAvatarFile] = useState<string | null>(null);
	const [fullName, setFullName] = useState(member?.full_name ?? "");
	const [role, setRole] = useState<MemberRole>(member?.role ?? "team_member");
	const [position, setPosition] = useState(member?.position ?? "");

	const existingAvatar = buildProfileImageUrl(member?.profile_picture ?? null);
	const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(
		existingAvatar,
	);
	const objectUrlRef = useRef<string | null>(null);

	useEffect(() => {
		return () => {
			if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		};
	}, []);

	function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		setAvatarFile(file?.name ?? null);
		if (!file) return;
		if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		const url = URL.createObjectURL(file);
		objectUrlRef.current = url;
		setAvatarPreviewUrl(url);
	}

	const defaultLabel = member ? "Save Changes" : "Create Member";
	const defaultPendingLabel = member ? "Saving…" : "Creating…";

	return (
		<div className="flex flex-col lg:flex-row gap-8 items-start">
			<form
				action={formAction}
				className="flex flex-col max-w-[720px] flex-1 min-w-0"
			>
				{state.error && (
					<div className="bg-red-500/8 border border-red-500/20 rounded-none p-3 flex items-center gap-2 text-red-400 text-[9px] mb-4">
						<AlertCircleIcon size={12} />
						{state.error}
					</div>
				)}

				{/* Personal Info card */}
				<div className={SECTION_CARD}>
					<h2 className={SECTION_HEAD}>Personal Info</h2>
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
						<Field label="Email" htmlFor="email">
							<Input
								id="email"
								name="email"
								type="email"
								defaultValue={member?.email ?? ""}
							/>
						</Field>
						<Field label="Phone" htmlFor="phone">
							<Input
								id="phone"
								name="phone"
								type="tel"
								defaultValue={member?.phone ?? ""}
							/>
						</Field>
						<Field label="Study Field" htmlFor="study_field">
							<Input
								id="study_field"
								name="study_field"
								defaultValue={member?.study_field ?? ""}
							/>
						</Field>
						<Field label="Faculty" htmlFor="faculty">
							<Input
								id="faculty"
								name="faculty"
								defaultValue={member?.faculty ?? ""}
							/>
						</Field>
						<Field label="Academic Year" htmlFor="academic_year">
							<Input
								id="academic_year"
								name="academic_year"
								placeholder="e.g. 3rd year"
								defaultValue={member?.academic_year ?? ""}
							/>
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
				</div>

				{/* Role & Team card */}
				<div className={SECTION_CARD}>
					<h2 className={SECTION_HEAD}>Role & Team</h2>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
						<Field label="Role" htmlFor="role">
							<NativeSelect
								id="role"
								name="role"
								options={MEMBER_ROLE_OPTIONS}
								value={role}
								onChange={(e) => setRole(e.target.value as MemberRole)}
							/>
						</Field>
						<Field label="Team" htmlFor="team">
							<NativeSelect
								id="team"
								name="team"
								options={MEMBER_TEAM_OPTIONS}
								placeholder="— None —"
								defaultValue={member?.team ?? ""}
							/>
						</Field>
						<Field label="Department" htmlFor="department">
							<Input
								id="department"
								name="department"
								defaultValue={member?.department ?? ""}
								placeholder="e.g. Marketing"
							/>
						</Field>
					</div>
				</div>

				{/* Profile Picture card */}
				<div className={SECTION_CARD}>
					<h2 className={SECTION_HEAD}>Profile Picture</h2>
					<div className="flex items-start gap-4">
						{avatarPreviewUrl ? (
							// biome-ignore lint/performance/noImgElement: blob preview URL, next/image can't handle it
							<img
								src={avatarPreviewUrl}
								alt="Profile preview"
								className="w-16 h-16 object-cover border border-[#1e1e1e]"
							/>
						) : (
							<div className="w-16 h-16 bg-primary/5 border border-[#1e1e1e] flex items-center justify-center shrink-0">
								<UserIcon size={22} strokeWidth={1.5} className="text-[#333]" />
							</div>
						)}
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-1.5">
								<label
									htmlFor="profile_picture"
									className="cursor-pointer border border-primary/40 text-primary font-heading text-[7px] tracking-[2px] uppercase px-3 py-2 transition-colors hover:bg-primary/10 shrink-0"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
									}}
								>
									{member ? "Change" : "Choose"}
								</label>
								<span className="font-body text-[9px] text-[#333] truncate">
									{avatarFile ?? (member ? "Keep current" : "No file chosen")}
								</span>
							</div>
							<p className="font-body text-[8px] text-[#2a2a2a]">
								JPG, PNG or WEBP. Max 2 MB.
							</p>
							<input
								id="profile_picture"
								type="file"
								name="profile_picture"
								accept="image/*"
								className="sr-only"
								onChange={handleAvatarChange}
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

			<div className="w-full lg:w-[260px] shrink-0 lg:sticky lg:top-6">
				<MemberPreview
					fullName={fullName}
					role={role}
					position={position}
					imagePreviewUrl={avatarPreviewUrl}
				/>
			</div>
		</div>
	);
}
