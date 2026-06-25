"use client";

import * as RadixSwitch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface SwitchProps {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	label?: string;
}

export function Switch({
	checked,
	onCheckedChange,
	disabled,
	className,
	label,
}: SwitchProps) {
	return (
		<RadixSwitch.Root
			checked={checked}
			onCheckedChange={onCheckedChange}
			disabled={disabled}
			aria-label={label}
			className={cn(
				"relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
				"transition-colors duration-200 outline-none",
				"data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-mid",
				"disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
		>
			<RadixSwitch.Thumb
				className={cn(
					"pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm",
					"transition-transform duration-200",
					"data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
				)}
			/>
		</RadixSwitch.Root>
	);
}
