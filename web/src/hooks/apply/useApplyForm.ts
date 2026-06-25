import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { applyAction } from "@/app/actions/apply";

const INITIAL_STATE = { status: "idle" as const, message: "" };

export function useApplyForm() {
	const [state, action, pending] = useActionState(applyAction, INITIAL_STATE);
	const [fileName, setFileName] = useState("No file chosen");
	const [academicYear, setAcademicYear] = useState("");
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.status === "success") {
			formRef.current?.reset();
			toast.success(state.message || "Application submitted!");
		}
	}, [state.status, state.message]);

	const handleReset = () => {
		setFileName("No file chosen");
		setAcademicYear("");
	};

	return {
		state,
		action,
		pending,
		fileName,
		setFileName,
		academicYear,
		setAcademicYear,
		formRef,
		handleReset,
	};
}
