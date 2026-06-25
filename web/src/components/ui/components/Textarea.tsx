import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { INPUT_BASE_CLS } from "../constants";

export function Textarea({
	className,
	...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return (
		<textarea
			className={cn(INPUT_BASE_CLS, "resize-none", className)}
			{...props}
		/>
	);
}
