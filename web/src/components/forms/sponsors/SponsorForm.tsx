"use client";

import { useActionState, useState } from "react";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { SubmitButton } from "@/components/ui/components/SubmitButton";
import { Textarea } from "@/components/ui/components/Textarea";
import { SPONSOR_TIERS } from "@/constants/sponsors";
import type { Sponsor } from "@/types/sponsor";

const TIER_OPTIONS = SPONSOR_TIERS.map((t) => ({ value: t, label: t }));

interface SponsorFormProps {
	action: (
		prev: { error?: string },
		formData: FormData,
	) => Promise<{ error?: string }>;
	sponsor?: Sponsor;
}

export function SponsorForm({ action, sponsor }: SponsorFormProps) {
	const [state, formAction, pending] = useActionState(action, {});
	const [fileName, setFileName] = useState("No file chosen");

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

			<Field label="Sponsor Name *" htmlFor="name">
				<Input
					id="name"
					name="name"
					required
					defaultValue={sponsor?.name ?? ""}
				/>
			</Field>

			<Field label="Description (Serbian) *" htmlFor="description">
				<Textarea
					id="description"
					name="description"
					rows={4}
					required
					defaultValue={sponsor?.description ?? ""}
				/>
			</Field>

			<Field label="Description (English)" htmlFor="description_en">
				<Textarea
					id="description_en"
					name="description_en"
					rows={4}
					defaultValue={sponsor?.description_en ?? ""}
				/>
			</Field>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<Field label="Tier *" htmlFor="tier">
					<NativeSelect
						id="tier"
						name="tier"
						options={TIER_OPTIONS}
						required
						defaultValue={sponsor?.tier ?? ""}
					/>
				</Field>
				<Field label="Tier Order" htmlFor="tier_order">
					<Input
						id="tier_order"
						name="tier_order"
						type="number"
						min={1}
						max={99}
						defaultValue={String(sponsor?.tier_order ?? 1)}
					/>
				</Field>
			</div>

			<Field label="Website URL" htmlFor="website">
				<Input
					id="website"
					name="website"
					type="url"
					placeholder="https://example.com"
					defaultValue={sponsor?.website ?? ""}
				/>
			</Field>

			<Field
				label={sponsor ? "Logo (leave empty to keep current)" : "Logo"}
				htmlFor="logo"
			>
				<div className="flex items-center gap-2">
					<label
						htmlFor="logo"
						className="cursor-pointer px-3 py-2 rounded-lg border border-primary text-primary text-xs font-heading tracking-widest hover:bg-primary hover:text-bg-dark transition-colors shrink-0"
					>
						Choose
					</label>
					<span className="text-text-gray text-xs truncate">{fileName}</span>
				</div>
				<input
					id="logo"
					type="file"
					name="logo"
					accept="image/*"
					className="sr-only"
					onChange={(e) =>
						setFileName(e.target.files?.[0]?.name ?? "No file chosen")
					}
				/>
			</Field>

			<SubmitButton
				pending={pending}
				label={sponsor ? "Save Changes" : "Create Sponsor"}
				pendingLabel={sponsor ? "Saving…" : "Creating…"}
				icon="fas fa-save"
				className="self-start px-8"
			/>
		</form>
	);
}
