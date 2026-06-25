"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = RadixTabs.Root;
export const TabsContent = RadixTabs.Content;

export function TabsList({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<RadixTabs.List
			className={cn(
				"flex gap-1 bg-bg-dark border border-gray-mid rounded-xl p-1",
				className,
			)}
		>
			{children}
		</RadixTabs.List>
	);
}

export function TabsTrigger({
	value,
	children,
	className,
}: {
	value: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<RadixTabs.Trigger
			value={value}
			className={cn(
				"px-4 py-1.5 rounded-lg text-sm font-body transition-colors outline-none",
				"text-text-gray hover:text-text-light",
				"data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold",
				className,
			)}
		>
			{children}
		</RadixTabs.Trigger>
	);
}
