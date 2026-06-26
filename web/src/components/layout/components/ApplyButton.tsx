"use client";

import { usePathname } from "next/navigation";
import { Button } from "../../ui/components/Button";

interface ApplyButtonProps {
	className?: string;
	onClick?: () => void;
}

export function ApplyButton({ className = "", onClick }: ApplyButtonProps) {
	const pathname = usePathname();
	const isActive = pathname === "/apply";

	return (
		<Button
			variant="secondary"
			size="sm"
			href="/apply"
			onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
			className={`${isActive ? "bg-primary/20 active" : ""} ${className}`}
		>
			<i className="fas fa-user-plus" aria-hidden="true" />
			Apply
		</Button>
	);
}
