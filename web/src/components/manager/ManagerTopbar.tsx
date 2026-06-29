export async function ManagerTopbar() {
	return (
		<header className="fixed top-0 left-[240px] right-0 h-[60px] bg-[#070707]/95 border-b border-primary/8 backdrop-blur-sm z-30 flex items-center justify-between px-6">
			<p className="font-body text-[9px] text-[#444] tracking-[2px]">
				Black Hornets Racing
				<span className="text-primary/30 mx-2">·</span>
				<span className="text-[#666]">Manager Panel</span>
			</p>

			<div className="flex items-center gap-3">
				<button
					type="button"
					className="relative text-[#444] hover:text-primary transition-colors"
					aria-label="Notifications"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={1.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
						<path d="M13.73 21a2 2 0 0 1-3.46 0" />
					</svg>
				</button>
			</div>
		</header>
	);
}
