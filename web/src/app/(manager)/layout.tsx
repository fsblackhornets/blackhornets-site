import { ManagerSidebar } from "@/components/manager/ManagerSidebar";
import { ManagerTopbar } from "@/components/manager/ManagerTopbar";

export default function ManagerLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-[#0d0d0d] text-text-light">
			<ManagerSidebar />
			<ManagerTopbar />
			<main className="pl-[240px] pt-[60px] min-h-screen">
				<div className="p-6">{children}</div>
			</main>
		</div>
	);
}
