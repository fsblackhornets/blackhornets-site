import Link from "next/link";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import {
	BUTTON_SIZE_CLASSES,
	BUTTON_VARIANT_CLASSES,
	type ButtonSize,
	type ButtonVariant,
} from "@/constants/ui";
import { cn } from "@/lib/utils";
import { SpinnerIcon } from "../../icons/SpinnerIcon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = "primary",
			size = "md",
			loading = false,
			disabled,
			href,
			children,
			className,
			onClick,
			...props
		},
		ref,
	) => {
		const cls = cn(
			"inline-flex items-center justify-center rounded-lg cursor-pointer transition-colors duration-200 font-body",
			BUTTON_VARIANT_CLASSES[variant],
			BUTTON_SIZE_CLASSES[size],
			className,
		);

		if (href) {
			return (
				<Link
					href={href}
					onClick={
						onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>
					}
					className={cls}
				>
					{children}
				</Link>
			);
		}

		return (
			<button
				ref={ref}
				disabled={disabled || loading}
				className={cls}
				onClick={onClick}
				{...props}
			>
				{loading && (
					<SpinnerIcon
						className="animate-spin w-4 h-4 shrink-0 mr-2"
						aria-hidden="true"
					/>
				)}
				{children}
			</button>
		);
	},
);
Button.displayName = "Button";
