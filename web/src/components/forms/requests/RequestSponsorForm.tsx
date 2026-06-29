"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { NativeSelect } from "@/components/ui/components/NativeSelect";
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
		<div>
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 mb-6">
				<Link
					href="/manager"
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back to Dashboard"
				>
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<line x1="19" y1="12" x2="5" y2="12" />
						<polyline points="12 19 5 12 12 5" />
					</svg>
				</Link>
				<span className="font-heading text-[8px] tracking-[2px] uppercase text-[#333]">
					Dashboard
				</span>
				<span className="text-[#2a2a2a]">›</span>
				<span className="font-heading text-[8px] tracking-[2px] uppercase text-primary">
					Request Sponsor
				</span>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
				{/* Form card */}
				<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm p-5">
					{/* Card header */}
					<div className="flex items-center gap-2 pb-2.5 mb-4 border-b border-[#1e1e1e]">
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#ffd700"
							strokeWidth={1.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
						</svg>
						<span className="font-heading text-[8px] tracking-[4px] uppercase text-primary">
							Sponsor Details
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
									className="cursor-pointer border border-primary/40 text-primary font-heading text-[7px] tracking-[2px] uppercase px-3 py-2 transition-colors hover:bg-primary/10 shrink-0"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
									}}
								>
									Choose
								</label>
								<span className="text-[#555] text-[9px] truncate">
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
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<line x1="22" y1="2" x2="11" y2="13" />
										<polygon points="22 2 15 22 11 13 2 9 22 2" />
									</svg>
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
					<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary/40 rounded-sm p-5">
						<div className="flex items-start gap-4 mb-3">
							<div className="w-14 h-14 rounded-sm bg-primary/5 border border-[#1e1e1e] flex items-center justify-center shrink-0">
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="rgba(255,215,0,0.2)"
									strokeWidth={1.5}
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
								</svg>
							</div>
							<div className="min-w-0">
								<h3 className="font-heading text-base text-text-light leading-snug">
									{name || (
										<span className="text-[#444] italic">Sponsor name…</span>
									)}
								</h3>
								<span
									className={`inline-block font-heading text-[7px] tracking-[2px] uppercase border px-2.5 py-1 mt-1.5 ${TIER_COLORS[tier]}`}
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
									}}
								>
									{tier}
								</span>
							</div>
						</div>
						<p className="font-body text-[10px] text-[#666] leading-relaxed line-clamp-3 mb-3">
							{descSr || (
								<span className="italic">Description will appear here…</span>
							)}
						</p>
						{website && (
							<p className="font-heading text-[8px] tracking-[1px] uppercase text-primary/60 truncate">
								{website}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
