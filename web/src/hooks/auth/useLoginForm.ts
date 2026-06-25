import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";

const INITIAL_STATE: { error?: string } = {};

export function useLoginForm() {
	const [state, action, pending] = useActionState(loginAction, INITIAL_STATE);
	return { state, action, pending };
}
