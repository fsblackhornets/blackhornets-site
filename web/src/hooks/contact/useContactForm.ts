import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { contactAction } from "@/app/actions/contact";

const INITIAL_STATE = { status: "idle" as const, message: "" };

export function useContactForm() {
	const [state, action, pending] = useActionState(contactAction, INITIAL_STATE);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.status === "success") {
			formRef.current?.reset();
			toast.success(state.message || "Message sent!");
		}
	}, [state.status, state.message]);

	return { state, action, pending, formRef };
}
