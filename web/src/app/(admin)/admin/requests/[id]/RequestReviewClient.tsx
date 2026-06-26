"use client";

import { Button } from "@/components/ui/components/Button";
import { Field } from "@/components/ui/components/Field";
import { Input } from "@/components/ui/components/Input";
import { Textarea } from "@/components/ui/components/Textarea";
import { getRequestFields } from "@/helpers/getRequestFields";
import { useRequestReview } from "@/hooks/useRequestReview";
import type { ContentRequest } from "@/types/request";

interface Props {
	request: ContentRequest;
}

export function RequestReviewClient({ request }: Props) {
	const {
		isPending,
		notes,
		setNotes,
		error,
		editedData,
		updateField,
		handleAction,
	} = useRequestReview(request);

	const fields = getRequestFields(editedData);

	return (
		<div className="flex flex-col gap-6">
			{/* Editable fields */}
			<div>
				<h2 className="font-heading text-xs tracking-[3px] uppercase text-text-gray/50 mb-3">
					Request Data
				</h2>
				<div className="bg-[#111] border border-primary/10 rounded-xl p-5 flex flex-col gap-4">
					{fields.map(([key, val]) => (
						<div key={key}>
							<Field label={key.replace(/_/g, " ")} htmlFor={`field-${key}`}>
								{typeof val === "string" && val.length > 80 ? (
									<Textarea
										id={`field-${key}`}
										rows={3}
										value={String(val)}
										onChange={(e) => updateField(key, e.target.value)}
									/>
								) : (
									<Input
										id={`field-${key}`}
										value={String(val ?? "")}
										onChange={(e) => updateField(key, e.target.value)}
									/>
								)}
							</Field>
						</div>
					))}
				</div>
			</div>

			{/* Admin notes */}
			<div>
				<h2 className="font-heading text-xs tracking-[3px] uppercase text-text-gray/50 mb-3">
					Admin Notes
				</h2>
				<Textarea
					rows={3}
					placeholder="Optional note to submitter…"
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
				/>
			</div>

			{error && (
				<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
					{error}
				</div>
			)}

			{/* Actions */}
			<div className="flex gap-3">
				<Button
					type="button"
					variant="ghost"
					loading={isPending}
					onClick={() => handleAction("approve")}
					className="text-green-400 hover:bg-green-500/10 border border-green-500/20"
				>
					<i className="fas fa-check" />
					Approve
				</Button>
				<Button
					type="button"
					variant="ghost"
					loading={isPending}
					onClick={() => handleAction("decline")}
					className="text-red-400 hover:bg-red-500/10 border border-red-500/20"
				>
					<i className="fas fa-times" />
					Decline
				</Button>
			</div>
		</div>
	);
}
