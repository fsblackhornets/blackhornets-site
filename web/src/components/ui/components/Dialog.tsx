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
					"bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm p-6 shadow-xl",
					"data-[state=open]:animate-[fadeIn_150ms_ease]",
					className,
				)}
			>
				{children}
				<RadixDialog.Close className="absolute top-4 right-4 text-[#444] hover:text-primary transition-colors">
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						aria-hidden="true"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
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
				"font-heading text-[13px] text-white tracking-[2px] uppercase",
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
			className={cn("font-body text-[10px] text-[#555] mt-1", className)}
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
