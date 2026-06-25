import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { INPUT_BASE_CLS } from "../constants";

interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	options: readonly { value: string; label: string }[];
	placeholder?: string;
}

export function NativeSelect({
	options,
	placeholder,
	className,
	...props
}: NativeSelectProps) {
	return (
		<select className={cn(INPUT_BASE_CLS, className)} {...props}>
			{placeholder && <option value="">{placeholder}</option>}
			{options.map(({ value, label }) => (
				<option key={value} value={value}>
					{label}
				</option>
			))}
		</select>
	);
}
