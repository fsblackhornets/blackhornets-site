"use client";

import { deletePostAction } from "@/app/actions/posts";
import { TrashIcon } from "@/components/icons";
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
				<TrashIcon size={13} strokeWidth={2} />
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
