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
		<div className="relative">
			<select
				className={cn(INPUT_BASE_CLS, "appearance-none pr-8", className)}
				{...props}
			>
				{placeholder && <option value="">{placeholder}</option>}
				{options.map(({ value, label }) => (
					<option key={value} value={value}>
						{label}
					</option>
				))}
			</select>
			<svg
				className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#444"
				strokeWidth={2}
				strokeLinecap="round"
				aria-hidden="true"
			>
				<polyline points="6 9 12 15 18 9" />
			</svg>
		</div>
	);
}
