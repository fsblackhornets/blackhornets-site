"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";

interface CheckboxProps {
	checked: boolean | "indeterminate";
	onCheckedChange: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	label?: string;
	id?: string;
}

export function Checkbox({
	checked,
	onCheckedChange,
	disabled,
	className,
	label,
	id,
}: CheckboxProps) {
	return (
		<RadixCheckbox.Root
			id={id}
			checked={checked}
			onCheckedChange={(v) => onCheckedChange(v === true)}
			disabled={disabled}
			aria-label={label}
			className={cn(
				"flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-mid",
				"transition-colors outline-none",
				"data-[state=checked]:bg-primary data-[state=checked]:border-primary",
				"disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
		>
			<RadixCheckbox.Indicator>
				<i
					className="fas fa-check text-[10px] text-bg-dark"
					aria-hidden="true"
				/>
			</RadixCheckbox.Indicator>
		</RadixCheckbox.Root>
	);
}
