"use client";

import { deleteMemberAction } from "@/app/actions/members";
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

export function MemberDeleteButton({ id, name }: { id: number; name: string }) {
	const { open, setOpen, loading, handleDelete } = useDeleteDialog({
		action: () => deleteMemberAction(id),
		successMessage: "Member deleted",
	});

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="text-[#444] hover:text-red-400 transition-colors p-1"
				aria-label={`Delete ${name}`}
			>
				<TrashIcon size={13} strokeWidth={2} />
			</button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Delete Member</DialogTitle>
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
