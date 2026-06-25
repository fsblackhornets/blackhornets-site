import type { TextareaHTMLAttributes } from "react";
import { INPUT_BASE_CLS } from "../constants";

export function Textarea({
	className = "",
	...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return (
		<textarea
			className={`${INPUT_BASE_CLS} resize-none ${className}`.trim()}
			{...props}
		/>
	);
}
