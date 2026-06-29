"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
	return (
		<RadixTooltip.Provider delayDuration={300}>
			{children}
		</RadixTooltip.Provider>
	);
}

export function Tooltip({
	children,
	content,
	className,
}: {
	children: React.ReactNode;
	content: string;
	className?: string;
}) {
	return (
		<RadixTooltip.Root>
			<RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
			<RadixTooltip.Portal>
				<RadixTooltip.Content
					sideOffset={4}
					className={cn(
						"z-50 bg-bg-panel border border-gray-mid rounded-lg px-3 py-1.5 text-xs text-text-light shadow-lg",
						"data-[state=delayed-open]:animate-[fadeIn_100ms_ease]",
						className,
					)}
				>
					{content}
					<RadixTooltip.Arrow className="fill-gray-mid" />
				</RadixTooltip.Content>
			</RadixTooltip.Portal>
		</RadixTooltip.Root>
	);
}
