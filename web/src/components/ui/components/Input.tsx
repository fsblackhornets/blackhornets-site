import type { InputHTMLAttributes } from "react";
import { INPUT_BASE_CLS } from "@/constants/ui";
import { cn } from "@/lib/utils";

export function Input({
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return <input className={cn(INPUT_BASE_CLS, className)} {...props} />;
}
