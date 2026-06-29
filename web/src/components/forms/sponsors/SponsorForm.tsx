"use client";

import { useActionState, useState } from "react";
import { AlertCircleIcon, ImageIcon, SaveIcon } from "@/components/icons";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { Textarea } from "@/components/ui/components/Textarea";
import { SECTION_CARD, SECTION_HEAD } from "@/constants/forms";
import { SPONSOR_TIERS } from "@/constants/sponsors";
import { buildSponsorLogoUrl } from "@/lib/utils/utils";
import type { Sponsor } from "@/types/sponsor";

const TIER_OPTIONS = SPONSOR_TIERS.map((t) => ({ value: t, label: t }));

interface SponsorFormProps {
	action: (
		prev: { error?: string },
		formData: FormData,
	) => Promise<{ error?: string }>;
	sponsor?: Sponsor;
	submitLabel?: string;
}

export function SponsorForm({
	action,
	sponsor,
	submitLabel,
}: SponsorFormProps) {
	const [state, formAction, pending] = useActionState(action, {});
	const [fileName, setFileName] = useState("No file chosen");

	const existingLogo = buildSponsorLogoUrl(sponsor?.logo ?? null);
	const defaultLabel = sponsor ? "Save Changes" : "Create Sponsor";
	const defaultPendingLabel = sponsor ? "Saving…" : "Creating…";

	return (
		<form action={formAction} className="flex flex-col max-w-[720px]">
			{state.error && (
				<div className="bg-red-500/8 border border-red-500/20 rounded-none p-3 flex items-center gap-2 text-red-400 text-[9px] mb-4">
					<AlertCircleIcon size={12} />
					{state.error}
				</div>
			)}

			{/* Sponsor Info card */}
			<div className={SECTION_CARD}>
				<h2 className={SECTION_HEAD}>Sponsor Info</h2>
				<div className="flex flex-col gap-5">
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
				</div>
			</div>

			{/* Logo card */}
			<div className={SECTION_CARD}>
				<h2 className={SECTION_HEAD}>Logo</h2>
				<div className="flex items-start gap-4">
					{existingLogo ? (
						// biome-ignore lint/performance/noImgElement: logo preview uses dynamic URL
						<img
							src={existingLogo}
							alt={sponsor?.name ?? "Sponsor logo"}
							className="w-24 h-14 object-contain border border-[#1e1e1e] bg-[#0a0a0a] p-2 shrink-0"
						/>
					) : (
						<div className="w-24 h-14 bg-primary/5 border border-[#1e1e1e] flex items-center justify-center shrink-0">
							<ImageIcon
								size={22}
								strokeWidth={1.5}
								className="text-[#2a2a2a]"
							/>
						</div>
					)}
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1.5">
							<label
								htmlFor="logo"
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
						{sponsor && (
							<p className="font-body text-[8px] text-[#2a2a2a]">
								Leave empty to keep the current logo.
							</p>
						)}
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
	);
}
