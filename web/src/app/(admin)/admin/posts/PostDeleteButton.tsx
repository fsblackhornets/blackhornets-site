"use client";

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
import { useDeleteDialog } from "@/hooks/useDeleteDialog";

export function PostDeleteButton({ id, title }: { id: number; title: string }) {
	const { open, setOpen, loading, handleDelete } = useDeleteDialog({
		action: () => deletePostAction(id),
		successMessage: "Post deleted",
	});

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="text-[#444] hover:text-red-400 transition-colors p-1"
				aria-label={`Delete ${title}`}
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
					<polyline points="3 6 5 6 21 6" />
					<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
					<path d="M10 11v6M14 11v6" />
					<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
				</svg>
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
