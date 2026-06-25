import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { reviewApplicationAction } from "@/app/actions/admin";
import type { Application } from "@/types/application";

export function useApplicationReview() {
	const router = useRouter();
	const [selected, setSelected] = useState<Application | null>(null);
	const [loading, setLoading] = useState<"accept" | "reject" | "review" | null>(
		null,
	);

	const handleReview = async (action: "accept" | "reject" | "review") => {
		if (!selected) return;
		setLoading(action);
		const res = await reviewApplicationAction(selected.id, action);
		setLoading(null);
		if (res.error) {
			toast.error(res.error);
		} else {
			toast.success(`Application ${res.status}`);
			setSelected(null);
			router.refresh();
		}
	};

	return { selected, setSelected, loading, handleReview };
}
