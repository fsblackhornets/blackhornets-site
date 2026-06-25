"use client";

import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = RadixDropdown.Root;
export const DropdownMenuTrigger = RadixDropdown.Trigger;
export const DropdownMenuSeparator = RadixDropdown.Separator;

export function DropdownMenuContent({
	children,
	className,
	align = "end",
}: {
	children: React.ReactNode;
	className?: string;
	align?: "start" | "center" | "end";
}) {
	return (
		<RadixDropdown.Portal>
			<RadixDropdown.Content
				align={align}
				sideOffset={6}
				className={cn(
					"z-50 min-w-[160px] bg-bg-panel border border-gray-mid rounded-xl p-1 shadow-xl",
					"data-[state=open]:animate-[fadeIn_100ms_ease]",
					className,
				)}
			>
				{children}
			</RadixDropdown.Content>
		</RadixDropdown.Portal>
	);
}

export function DropdownMenuItem({
	children,
	onClick,
	className,
	destructive,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
	destructive?: boolean;
}) {
	return (
		<RadixDropdown.Item
			onClick={onClick}
			className={cn(
				"flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer outline-none transition-colors",
				destructive
					? "text-red-400 data-[highlighted]:bg-red-500/10"
					: "text-text-gray data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary",
				className,
			)}
		>
			{children}
		</RadixDropdown.Item>
	);
}
