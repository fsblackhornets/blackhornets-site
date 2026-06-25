import type { Metadata } from "next";
import { deleteMessageAction } from "@/app/actions/messages";
import { SITE_NAME } from "@/constants/site";
import { fetchMessages } from "@/lib/api/admin";
import { formatDate } from "@/lib/utils/utils";

export const metadata: Metadata = { title: `Messages — ${SITE_NAME} Admin` };

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
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Messages
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				{res && (
					<span className="text-text-gray text-sm">{res.total} total</span>
				)}
			</div>

			{!res || res.data.length === 0 ? (
				<div className="bg-[#111] border border-primary/12 rounded-2xl p-16 text-center text-text-gray">
					<i
						className="fas fa-inbox text-4xl text-primary/30 mb-4 block"
						aria-hidden="true"
					/>
					No messages found.
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{res.data.map((msg) => (
						<div
							key={msg.id}
							className="bg-[#111] border border-primary/12 rounded-xl p-5"
						>
							<div className="flex items-start justify-between gap-4 mb-3">
								<div>
									<p className="text-text-light font-semibold text-sm">
										{msg.name}
									</p>
									<a
										href={`mailto:${msg.email}`}
										className="text-text-gray text-xs hover:text-primary transition-colors"
									>
										{msg.email}
									</a>
								</div>
								<span className="text-text-gray text-xs shrink-0">
									{formatDate(msg.created_at)}
								</span>
							</div>

							<p className="text-primary text-sm font-heading tracking-wide mb-2">
								{msg.subject}
							</p>
							<p className="text-text-gray text-sm leading-relaxed">
								{msg.message}
							</p>

							<div className="flex gap-3 mt-4 pt-3 border-t border-gray-mid">
								<a
									href={`mailto:${msg.email}`}
									className="flex items-center gap-1.5 text-xs text-text-gray hover:text-primary transition-colors"
								>
									<i className="fas fa-reply" aria-hidden="true" />
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
										className="flex items-center gap-1.5 text-xs text-text-gray hover:text-red-400 transition-colors"
									>
										<i className="fas fa-trash" aria-hidden="true" />
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
							className={`w-9 h-9 rounded-lg font-heading text-sm flex items-center justify-center transition-colors ${
								p === page
									? "bg-primary text-bg-dark"
									: "border border-gray-mid text-text-gray hover:border-primary hover:text-primary"
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
