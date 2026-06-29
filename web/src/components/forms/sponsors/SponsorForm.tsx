"use client";

import { useActionState, useState } from "react";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { Textarea } from "@/components/ui/components/Textarea";
import { SPONSOR_TIERS } from "@/constants/sponsors";
import { buildSponsorLogoUrl } from "@/lib/utils/utils";
import type { Sponsor } from "@/types/sponsor";

const TIER_OPTIONS = SPONSOR_TIERS.map((t) => ({ value: t, label: t }));

const SECTION_CARD =
	"bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm p-5 mb-4";
const SECTION_HEAD =
	"font-heading text-[8px] tracking-[4px] uppercase text-primary pb-2.5 mb-4 border-b border-[#1e1e1e]";

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
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
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
							<svg
								width="22"
								height="22"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#2a2a2a"
								strokeWidth={1.5}
								aria-hidden="true"
							>
								<rect x="3" y="3" width="18" height="18" rx="2" />
								<circle cx="8.5" cy="8.5" r="1.5" />
								<polyline points="21 15 16 10 5 21" />
							</svg>
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
						<svg
							width="11"
							height="11"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							aria-hidden="true"
						>
							<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
							<polyline points="17 21 17 13 7 13 7 21" />
							<polyline points="7 3 7 8 15 8" />
						</svg>
						{submitLabel ?? defaultLabel}
					</>
				)}
			</button>
		</form>
	);
}
