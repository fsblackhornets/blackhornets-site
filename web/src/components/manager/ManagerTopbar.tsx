import { Bell } from "lucide-react";

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
					<Bell size={16} strokeWidth={1.5} aria-hidden="true" />
				</button>
			</div>
		</header>
	);
}
