import type { TextareaHTMLAttributes } from "react";
import { INPUT_BASE_CLS } from "@/constants/ui";
import { cn } from "@/lib/utils";

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
