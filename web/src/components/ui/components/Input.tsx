import type { InputHTMLAttributes } from "react";
import { INPUT_BASE_CLS } from "../constants";

export function Input({
	className = "",
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input className={`${INPUT_BASE_CLS} ${className}`.trim()} {...props} />
	);
}
