"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deletePostAction } from "@/app/actions/posts";
import { Button } from "@/components/ui/components/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/components/Dialog";
import { handleDeleteAction } from "@/helpers/handleDeleteAction";

export function PostDeleteButton({ id, title }: { id: number; title: string }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleDelete = () =>
		handleDeleteAction({
			action: () => deletePostAction(id),
			onLoadingChange: setLoading,
			onSuccess: () => {
				toast.success("Post deleted");
				setOpen(false);
			},
			onError: (msg) => toast.error(msg),
		});

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="text-text-gray hover:text-red-400 transition-colors text-sm px-2"
				aria-label={`Delete ${title}`}
			>
				<i className="fas fa-trash" aria-hidden="true" />
			</button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Delete Post</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete &ldquo;{title}&rdquo;? This cannot
							be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="ghost"
							onClick={() => setOpen(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button variant="danger" onClick={handleDelete} disabled={loading}>
							{loading ? "Deleting…" : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
