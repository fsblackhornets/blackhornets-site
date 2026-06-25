import { logoutAction } from "@/app/actions/auth";
import { auth } from "@/auth";

export async function AdminTopbar() {
	const session = await auth();
	const name = session?.user?.full_name ?? "Admin";

	return (
		<header className="fixed top-0 left-[240px] right-0 h-[60px] bg-black/90 border-b border-primary/10 backdrop-blur-md z-30 flex items-center justify-between px-6">
			<p className="text-text-gray text-sm">
				Black Hornets Racing <span className="text-primary/40 mx-2">·</span>
				<span className="text-text-light">Admin Panel</span>
			</p>

			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-heading font-bold">
						{name.charAt(0)}
					</div>
					<span className="text-text-light text-sm">{name}</span>
				</div>

				<form action={logoutAction}>
					<button
						type="submit"
						className="text-text-gray hover:text-primary transition-colors text-sm flex items-center gap-1.5"
					>
						<i className="fas fa-sign-out-alt" aria-hidden="true" />
						Logout
					</button>
				</form>
			</div>
		</header>
	);
}
