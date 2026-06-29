import { auth } from "@/auth";
import { fetchRequests } from "@/lib/api/requests";
import { RequestsFilterClient } from "./RequestsFilterClient";

export const metadata = { title: "My Requests — Manager Panel" };

export default async function MyRequestsPage() {
	const session = await auth();
	const userId = Number(session?.user?.id ?? 0);

	const requests = await fetchRequests({ userId, role: "manager" });

	return (
		<div className="max-w-[900px]">
			<div className="mb-6">
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					My Requests
				</h1>
			</div>

			<RequestsFilterClient requests={requests} />
		</div>
	);
}
