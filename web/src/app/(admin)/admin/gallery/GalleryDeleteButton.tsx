"use client";

import { deleteGalleryImageAction } from "@/app/actions/gallery";
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

export function GalleryDeleteButton({ id }: { id: number }) {
	const { open, setOpen, loading, handleDelete } = useDeleteDialog({
		action: () => deleteGalleryImageAction(id),
		successMessage: "Image deleted",
	});

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="text-white/60 hover:text-red-400 transition-colors"
				aria-label="Delete image"
			>
				<i className="fas fa-trash text-xs" aria-hidden="true" />
			</button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Delete Image</DialogTitle>
						<DialogDescription>
							Remove this image? This cannot be undone.
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
