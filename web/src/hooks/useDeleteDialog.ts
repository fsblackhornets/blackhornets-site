import { useState } from "react";
import { toast } from "sonner";
import { handleDeleteAction } from "@/helpers/handleDeleteAction";

interface UseDeleteDialogOptions {
	action: () => Promise<{ error?: string }>;
	successMessage?: string;
}

export function useDeleteDialog({
	action,
	successMessage = "Deleted",
}: UseDeleteDialogOptions) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleDelete = () =>
		handleDeleteAction({
			action,
			onLoadingChange: setLoading,
			onSuccess: () => {
				toast.success(successMessage);
				setOpen(false);
			},
			onError: (msg) => toast.error(msg),
		});

	return { open, setOpen, loading, handleDelete };
}
