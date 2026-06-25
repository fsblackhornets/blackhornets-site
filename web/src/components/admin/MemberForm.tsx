"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { SubmitButton } from "@/components/ui/components/SubmitButton";
import { cn } from "@/lib/utils";
import type { AdminMember } from "@/types/member";
import { MEMBER_ROLE_OPTIONS, MEMBER_TEAM_OPTIONS } from "@/types/member";

interface MemberFormProps {
	action: (
		prev: { error?: string },
		formData: FormData,
	) => Promise<{ error?: string }>;
	member?: AdminMember;
}

export function MemberForm({ action, member }: MemberFormProps) {
	const [state, formAction, pending] = useActionState(action, {});

	return (
		<form action={formAction} className="flex flex-col gap-5 max-w-[720px]">
			{state.error && (
				<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
					{state.error}
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
				{!member && (
					<>
						<Field label="Username *" htmlFor="username">
							<Input
								id="username"
								name="username"
								required
								autoComplete="off"
							/>
						</Field>
						<Field label="Password *" htmlFor="password">
							<Input
								id="password"
								name="password"
								type="password"
								required
								autoComplete="new-password"
							/>
						</Field>
					</>
				)}
				<Field label="Full Name *" htmlFor="full_name">
					<Input
						id="full_name"
						name="full_name"
						required
						defaultValue={member?.full_name ?? ""}
					/>
				</Field>
				<Field label="Email *" htmlFor="email">
					<Input
						id="email"
						name="email"
						type="email"
						required
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
				<Field label="Position" htmlFor="position">
					<Input
						id="position"
						name="position"
						defaultValue={member?.position ?? ""}
					/>
				</Field>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
				<Field label="Role" htmlFor="role">
					<NativeSelect
						id="role"
						name="role"
						options={MEMBER_ROLE_OPTIONS}
						defaultValue={member?.role ?? "team_member"}
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

			<SubmitButton
				pending={pending}
				label={member ? "Save Changes" : "Create Member"}
				pendingLabel={member ? "Saving…" : "Creating…"}
				icon="fas fa-user-plus"
				className={cn("self-start px-8")}
			/>
		</form>
	);
}
