import { deleteMessageAction } from "@/app/actions/messages";
import { Icon } from "@/components/ui/components/Icon";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchMessages } from "@/lib/api/admin";
import { formatDate } from "@/lib/utils/utils";

export const metadata = buildAdminMeta("Messages");

interface Props {
	searchParams: Promise<{ page?: string }>;
}

export default async function MessagesPage({ searchParams }: Props) {
	const { page: pageParam } = await searchParams;
	const page = Math.max(1, Number(pageParam ?? 1));
	const res = await fetchMessages(page);

	return (
		<div className="max-w-[900px]">
			<div className="flex items-center gap-3 mb-6">
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					Messages
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				{res && (
					<span className="font-body text-[8.5px] text-[#444]">
						{res.total} total
					</span>
				)}
			</div>

			{!res || res.data.length === 0 ? (
				<div className="border border-[#1e1e1e] rounded-sm p-16 text-center">
					<svg
						className="mx-auto mb-4"
						width="36"
						height="36"
						viewBox="0 0 24 24"
						fill="none"
						stroke="rgba(255,215,0,.2)"
						strokeWidth={1.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
						<path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
					</svg>
					<p className="font-heading text-[9px] tracking-[3px] uppercase text-[#333]">
						No messages found.
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{res.data.map((msg) => (
						<div
							key={msg.id}
							className="bg-[#111] border border-[#1e1e1e] border-l-[2px] border-l-primary/20 rounded-sm p-5 hover:border-l-primary/60 transition-colors"
						>
							<div className="flex items-start justify-between gap-4 mb-3">
								<div>
									<p className="font-body font-semibold text-[10.5px] text-[#e0e0e0]">
										{msg.name}
									</p>
									<a
										href={`mailto:${msg.email}`}
										className="font-body text-[8.5px] text-[#444] hover:text-primary transition-colors"
									>
										{msg.email}
									</a>
								</div>
								<span className="font-body text-[8px] text-[#333] shrink-0">
									{formatDate(msg.created_at)}
								</span>
							</div>

							<p className="font-heading text-[9px] tracking-[2px] uppercase text-primary mb-2">
								{msg.subject}
							</p>
							<p className="font-body text-[9.5px] text-[#888] leading-relaxed">
								{msg.message}
							</p>

							<div className="border-t border-[#1a1a1a] pt-3 mt-3 flex gap-4">
								<a
									href={`mailto:${msg.email}`}
									className="flex items-center gap-1.5 font-body text-[8.5px] text-[#444] hover:text-primary transition-colors"
								>
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<polyline points="9 17 4 12 9 7" />
										<path d="M20 18v-2a4 4 0 0 0-4-4H4" />
									</svg>
									Reply
								</a>

								<form
									action={async () => {
										"use server";
										await deleteMessageAction(msg.id);
									}}
								>
									<button
										type="submit"
										className="flex items-center gap-1.5 font-body text-[8.5px] text-[#444] hover:text-red-400 transition-colors"
									>
										<Icon name="trash" size={12} strokeWidth={2} />
										Delete
									</button>
								</form>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Pagination */}
			{res && res.total_pages > 1 && (
				<div className="flex justify-center gap-2 mt-6">
					{Array.from({ length: res.total_pages }, (_, i) => i + 1).map((p) => (
						<a
							key={p}
							href={`?page=${p}`}
							className={`w-9 h-9 rounded-sm font-heading text-[8px] flex items-center justify-center transition-colors ${
								p === page
									? "bg-primary text-black"
									: "border border-[#1e1e1e] text-[#444] hover:border-primary hover:text-primary"
							}`}
						>
							{p}
						</a>
					))}
				</div>
			)}
		</div>
	);
}
