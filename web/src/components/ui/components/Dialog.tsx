"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

export function DialogContent({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<RadixDialog.Portal>
			<RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-[fadeIn_150ms_ease]" />
			<RadixDialog.Content
				className={cn(
					"fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg",
					"bg-bg-panel border border-gray-mid rounded-2xl p-6 shadow-xl",
					"data-[state=open]:animate-[fadeIn_150ms_ease]",
					className,
				)}
			>
				{children}
				<RadixDialog.Close className="absolute top-4 right-4 text-text-gray hover:text-primary transition-colors">
					<i className="fas fa-times" aria-hidden="true" />
					<span className="sr-only">Close</span>
				</RadixDialog.Close>
			</RadixDialog.Content>
		</RadixDialog.Portal>
	);
}

export function DialogHeader({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <div className={cn("mb-4", className)}>{children}</div>;
}

export function DialogTitle({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<RadixDialog.Title
			className={cn(
				"font-heading text-lg text-primary tracking-widest uppercase",
				className,
			)}
		>
			{children}
		</RadixDialog.Title>
	);
}

export function DialogDescription({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<RadixDialog.Description
			className={cn("text-text-gray text-sm mt-1", className)}
		>
			{children}
		</RadixDialog.Description>
	);
}

export function DialogFooter({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex justify-end gap-3 mt-6", className)}>
			{children}
		</div>
	);
}
