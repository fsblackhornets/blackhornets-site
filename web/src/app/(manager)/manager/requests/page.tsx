import Link from "next/link";
import { auth } from "@/auth";
import { REQUEST_STATUS_COLORS, REQUEST_TYPE_ICONS } from "@/constants/requests";
import { fetchRequests } from "@/lib/api/requests";

export const metadata = { title: "My Requests — Manager Panel" };

function getTitle(data: Record<string, unknown>): string {
	return String(
		data.name ?? data.title_sr ?? data.full_name ?? "—",
	);
}

export default async function MyRequestsPage() {
	const session = await auth();
	const userId = Number(session?.user?.id ?? 0);

	const requests = await fetchRequests({ userId, role: "manager" });

	return (
		<div className="max-w-[900px]">
			<div className="flex items-center justify-between mb-6">
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					My Requests
				</h1>
				<Link
					href="/manager"
					className="text-text-gray hover:text-primary text-sm transition-colors flex items-center gap-1.5"
				>
					<i className="fas fa-arrow-left" aria-hidden="true" />
					Dashboard
				</Link>
			</div>

			{requests.length === 0 ? (
				<div className="text-center py-16 border border-primary/10 rounded-xl">
					<i className="fas fa-inbox text-3xl text-text-gray/30 mb-3 block" />
					<p className="text-text-gray text-sm">No requests submitted yet.</p>
					<Link
						href="/manager"
						className="mt-4 inline-block text-primary text-sm hover:underline"
					>
						Submit your first request
					</Link>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{requests.map((r) => (
						<div
							key={r.id}
							className="bg-[#111] border border-primary/10 rounded-xl px-5 py-4"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex items-center gap-3 min-w-0">
									<i
										className={`${REQUEST_TYPE_ICONS[r.type]} text-primary/60 shrink-0`}
										aria-hidden="true"
									/>
									<div className="min-w-0">
										<p className="text-text-light text-sm font-semibold truncate">
											{getTitle(r.data)}
										</p>
										<p className="text-text-gray text-xs mt-0.5">
											<span className="uppercase tracking-widest font-heading">
												{r.type}
											</span>
											{" · "}
											{new Date(r.created_at).toLocaleDateString()}
										</p>
									</div>
								</div>
								<span
									className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${REQUEST_STATUS_COLORS[r.status]}`}
								>
									{r.status}
								</span>
							</div>

							{r.admin_notes && (
								<div className="mt-3 pt-3 border-t border-primary/10">
									<p className="text-xs text-text-gray">
										<span className="text-primary/60 font-semibold">
											Admin note:{" "}
										</span>
										{r.admin_notes}
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
