"use client";

import { useState, useTransition } from "react";
import { reviewRequestAction } from "@/app/actions/requests";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { Textarea } from "@/components/ui/components/Textarea";
import { getRequestFields } from "@/helpers/getRequestFields";
import type { ContentRequest } from "@/types/request";

interface Props {
	request: ContentRequest;
	isPostType?: boolean;
}

export function RequestReviewClient({ request, isPostType }: Props) {
	const [isPending, startTransition] = useTransition();
	const [notes, setNotes] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [editedData, setEditedData] = useState<Record<string, unknown>>(() => ({
		...request.data,
	}));
	const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

	const fields = getRequestFields(editedData);

	function handleAction(action: "approve" | "decline") {
		setError(null);
		startTransition(async () => {
			const result = await reviewRequestAction(
				request.id,
				action,
				notes,
				action === "approve" ? editedData : undefined,
			);
			if (result?.error) setError(result.error);
		});
	}

	return (
		<div className={isPostType ? "sticky top-6" : ""}>
			{/* Data fields — only show for non-post or when not post type */}
			{!isPostType && (
				<div className="mb-5">
					<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#333] mb-2">
						Request Data
					</p>
					<div className="bg-[#111] border border-[#1e1e1e] rounded-sm p-5 flex flex-col gap-4">
						{fields.map(([key, val]) => (
							<div key={key}>
								<Field label={key.replace(/_/g, " ")} htmlFor={`field-${key}`}>
									{typeof val === "string" && val.length > 80 ? (
										<Textarea
											id={`field-${key}`}
											rows={3}
											value={String(val)}
											onChange={(e) =>
												setEditedData((prev) => ({
													...prev,
													[key]: e.target.value,
												}))
											}
										/>
									) : (
										<Input
											id={`field-${key}`}
											value={String(val ?? "")}
											onChange={(e) =>
												setEditedData((prev) => ({
													...prev,
													[key]: e.target.value,
												}))
											}
										/>
									)}
								</Field>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Admin notes */}
			<div className="mb-4">
				<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#333] mb-2">
					Admin Notes
				</p>
				<textarea
					rows={3}
					placeholder="Optional note to submitter…"
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					className="w-full bg-[#0e0e0e] border border-[#1e1e1e] rounded-none px-3 py-2.5 text-[10px] font-body text-[#e0e0e0] resize-none focus:outline-none focus:border-primary/40 placeholder:text-[#333]"
				/>
			</div>

			{error && (
				<div className="bg-red-500/10 border border-red-500/30 rounded-none p-3 text-red-400 text-[9px] mb-4">
					{error}
				</div>
			)}

			{/* Action buttons */}
			<div className="flex flex-col gap-2">
				<button
					type="button"
					disabled={isPending}
					onClick={() => handleAction("approve")}
					className="w-full bg-green-600/20 border border-green-500/30 text-green-400 font-heading text-[8px] tracking-[3px] uppercase py-3 px-4 flex items-center justify-center gap-2 transition-colors hover:bg-green-600/30 disabled:opacity-50"
					style={{
						clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)",
					}}
				>
					{isPending ? (
						<span className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
					) : (
						<svg
							width="11"
							height="11"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden="true"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
					)}
					Approve & Publish
				</button>

				{!showDeclineConfirm ? (
					<button
						type="button"
						disabled={isPending}
						onClick={() => setShowDeclineConfirm(true)}
						className="w-full bg-transparent border border-red-500/20 text-red-400/70 font-heading text-[8px] tracking-[3px] uppercase py-3 px-4 flex items-center justify-center gap-2 transition-colors hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40 disabled:opacity-50"
						style={{
							clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)",
						}}
					>
						<svg
							width="11"
							height="11"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden="true"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
						Decline
					</button>
				) : (
					<div className="border border-red-500/20 rounded-sm p-3 bg-red-500/5">
						<p className="font-heading text-[7px] tracking-[2px] uppercase text-red-400/70 mb-2">
							Confirm decline?
						</p>
						<p className="font-body text-[8px] text-[#555] mb-3">
							Include a note above so the submitter knows what to fix.
						</p>
						<div className="flex gap-2">
							<button
								type="button"
								disabled={isPending}
								onClick={() => handleAction("decline")}
								className="flex-1 bg-red-600/20 border border-red-500/30 text-red-400 font-heading text-[7.5px] tracking-[2px] uppercase py-2 transition-colors hover:bg-red-600/30 disabled:opacity-50"
								style={{
									clipPath:
										"polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
								}}
							>
								Confirm Decline
							</button>
							<button
								type="button"
								onClick={() => setShowDeclineConfirm(false)}
								className="px-3 border border-[#2a2a2a] text-[#444] font-heading text-[7.5px] tracking-[2px] uppercase py-2 transition-colors hover:text-[#888]"
								style={{
									clipPath:
										"polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
								}}
							>
								Cancel
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Summary for post type */}
			{isPostType && (
				<div className="mt-4 border-t border-[#1e1e1e] pt-4">
					<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#333] mb-2">
						Summary
					</p>
					<div className="flex flex-col gap-1.5">
						{[
							["Category", String(request.data.category ?? "—")],
							["Author", String(request.data.author ?? "Manager")],
							["Has English", request.data.content_en ? "Yes" : "No"],
						].map(([k, v]) => (
							<div key={k} className="flex items-center justify-between">
								<span className="font-heading text-[7px] tracking-[2px] uppercase text-[#444]">
									{k}
								</span>
								<span className="font-body text-[9px] text-[#888]">{v}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
