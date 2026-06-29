import { ParaButton } from "./ParaButton";

interface SubmitButtonProps {
	pending: boolean;
	label: string;
	pendingLabel?: string;
	className?: string;
}

export function SubmitButton({
	pending,
	label,
	pendingLabel = "Submitting…",
	className,
}: SubmitButtonProps) {
	return (
		<ParaButton
			type="submit"
			size="lg"
			variant="solid"
			disabled={pending}
			className={className}
		>
			{pending ? (
				<>
					<span
						className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"
						aria-hidden="true"
					/>
					{pendingLabel}
				</>
			) : (
				<>
					<svg
						width="13"
						height="13"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<line x1="22" y1="2" x2="11" y2="13" />
						<polygon points="22 2 15 22 11 13 2 9 22 2" />
					</svg>
					{label}
				</>
			)}
		</ParaButton>
	);
}
