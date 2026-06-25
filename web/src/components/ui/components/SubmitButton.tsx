import { Button } from "./Button";
import { Spinner } from "./Spinner";

interface SubmitButtonProps {
	pending: boolean;
	label: string;
	pendingLabel?: string;
	icon?: string;
	className?: string;
}

export function SubmitButton({
	pending,
	label,
	pendingLabel = "Submitting…",
	icon,
	className = "",
}: SubmitButtonProps) {
	return (
		<Button
			type="submit"
			disabled={pending}
			className={`w-full ${className}`.trim()}
		>
			{pending ? (
				<>
					<Spinner size="sm" />
					{pendingLabel}
				</>
			) : (
				<>
					{icon && <i className={icon} aria-hidden="true" />}
					{label}
				</>
			)}
		</Button>
	);
}
