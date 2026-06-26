"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
import { SubmitButton } from "@/components/ui/components/SubmitButton";
import { Textarea } from "@/components/ui/components/Textarea";
import type { SponsorTier } from "@/constants/sponsors";
import { SPONSOR_TIERS, TIER_COLORS } from "@/constants/sponsors";
import { useRequestSponsorPreview } from "@/hooks/useRequestPreview";

const TIER_OPTIONS = SPONSOR_TIERS.map((t) => ({ value: t, label: t }));

interface Props {
	action: (
		prev: { error?: string; success?: string },
		formData: FormData,
	) => Promise<{ error?: string; success?: string }>;
}

export function RequestSponsorForm({ action }: Props) {
	const [state, formAction, pending] = useActionState(action, {});
	const {
		name,
		setName,
		tier,
		setTier,
		website,
		setWebsite,
		descSr,
		setDescSr,
		logoFile,
		setLogoFile,
	} = useRequestSponsorPreview();

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

				<input type="hidden" name="type" value="sponsor" />

				<Field label="Sponsor Name *" htmlFor="name">
					<Input
						id="name"
						name="name"
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</Field>

				<Field label="Tier *" htmlFor="tier">
					<NativeSelect
						id="tier"
						name="tier"
						options={TIER_OPTIONS}
						required
						value={tier}
						onChange={(e) => setTier(e.target.value as SponsorTier)}
					/>
				</Field>

				<Field label="Website URL" htmlFor="website">
					<Input
						id="website"
						name="website"
						type="url"
						placeholder="https://example.com"
						value={website}
						onChange={(e) => setWebsite(e.target.value)}
					/>
				</Field>

				<Field label="Description (Serbian) *" htmlFor="description_sr">
					<Textarea
						id="description_sr"
						name="description_sr"
						rows={4}
						required
						value={descSr}
						onChange={(e) => setDescSr(e.target.value)}
					/>
				</Field>

				<Field label="Description (English)" htmlFor="description_en">
					<Textarea id="description_en" name="description_en" rows={4} />
				</Field>

				<Field label="Logo" htmlFor="logo">
					<div className="flex items-center gap-2">
						<label
							htmlFor="logo"
							className="cursor-pointer px-3 py-2 rounded-lg border border-primary text-primary text-xs font-heading tracking-widest hover:bg-primary hover:text-bg-dark transition-colors shrink-0"
						>
							Choose
						</label>
						<span className="text-text-gray text-xs truncate">
							{logoFile ?? "No file chosen"}
						</span>
					</div>
					<input
						id="logo"
						type="file"
						name="logo"
						accept="image/*"
						className="sr-only"
						onChange={(e) => setLogoFile(e.target.files?.[0]?.name ?? null)}
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
				<div className="bg-[#111] border border-primary/10 rounded-xl p-5">
					<div className="flex items-start gap-4 mb-3">
						<div className="w-14 h-14 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
							{logoFile ? (
								<i className="fas fa-image text-primary/30 text-xl" />
							) : (
								<i className="fas fa-handshake text-primary/30 text-xl" />
							)}
						</div>
						<div className="min-w-0">
							<h3 className="font-heading text-base text-text-light leading-snug">
								{name || (
									<span className="text-text-gray/40 italic">
										Sponsor name…
									</span>
								)}
							</h3>
							<span
								className={`inline-block text-[10px] tracking-[2px] uppercase font-heading border rounded-full px-2.5 py-0.5 mt-1.5 ${TIER_COLORS[tier]}`}
							>
								{tier}
							</span>
						</div>
					</div>
					<p className="text-text-gray text-sm leading-relaxed line-clamp-3 mb-3">
						{descSr || (
							<span className="italic">Description will appear here…</span>
						)}
					</p>
					{website && (
						<p className="text-primary text-xs truncate">
							<i className="fas fa-link mr-1.5" />
							{website}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
