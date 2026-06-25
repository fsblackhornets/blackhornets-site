import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-[#0d0d0d] text-text-light">
			<AdminSidebar />
			<AdminTopbar />
			<main className="pl-[240px] pt-[60px] min-h-screen">
				<div className="p-6">{children}</div>
			</main>
		</div>
	);
}
