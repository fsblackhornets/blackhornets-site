"use client";

import { deleteSponsorAction } from "@/app/actions/sponsors";
import { Button } from "@/components/ui/components/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/components/Dialog";
import { Icon } from "@/components/ui/components/Icon";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";

export function SponsorDeleteButton({
	id,
	name,
}: {
	id: number;
	name: string;
}) {
	const { open, setOpen, loading, handleDelete } = useDeleteDialog({
		action: () => deleteSponsorAction(id),
		successMessage: "Sponsor deleted",
	});

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="text-text-gray hover:text-red-400 transition-colors text-sm px-2"
				aria-label={`Delete ${name}`}
			>
				<Icon name="trash" size={13} strokeWidth={2} />
			</button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Delete Sponsor</DialogTitle>
						<DialogDescription>
							Delete &ldquo;{name}&rdquo;? This cannot be undone.
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
