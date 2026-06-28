import { auth } from "@/auth";
import { ManagerSidebar } from "@/components/manager/ManagerSidebar";
import { ManagerTopbar } from "@/components/manager/ManagerTopbar";

export default async function ManagerLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	const userName = session?.user?.full_name ?? "Manager";
	const userRole = session?.user?.role ?? "manager";

	return (
		<div
			className="min-h-screen bg-[#0a0a0a] text-text-light"
			style={{ fontFamily: "'Poppins', sans-serif" }}
		>
			<ManagerSidebar userName={userName} userRole={userRole} />
			<ManagerTopbar />
			<main className="pl-[240px] pt-[60px] min-h-screen">
				<div className="p-6">{children}</div>
			</main>
		</div>
	);
}
