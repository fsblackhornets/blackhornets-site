import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { INPUT_BASE_CLS } from "@/constants/ui";

export function Input({
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return <input className={cn(INPUT_BASE_CLS, className)} {...props} />;
}
