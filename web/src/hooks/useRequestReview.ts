"use client";

import { useState, useTransition } from "react";
import { reviewRequestAction } from "@/app/actions/requests";
import type { ContentRequest } from "@/types/request";

export function useRequestReview(request: ContentRequest) {
	const [isPending, startTransition] = useTransition();
	const [notes, setNotes] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [editedData, setEditedData] = useState<Record<string, unknown>>(() => ({
		...request.data,
	}));

	function updateField(key: string, value: unknown) {
		setEditedData((prev) => ({ ...prev, [key]: value }));
	}

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

	return {
		isPending,
		notes,
		setNotes,
		error,
		editedData,
		updateField,
		handleAction,
	};
}
