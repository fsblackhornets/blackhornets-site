import type { Metadata } from "next";
import { SITE_NAME } from "@/constants/site";
import { fetchApplications } from "@/lib/api/admin";
import { ApplicationsClient } from "./ApplicationsClient";

export const metadata: Metadata = {
	title: `Applications — ${SITE_NAME} Admin`,
};

interface Props {
	searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function ApplicationsPage({ searchParams }: Props) {
	const { status = "", page: pageParam } = await searchParams;
	const page = Math.max(1, Number(pageParam ?? 1));
	const res = await fetchApplications(status, page);

	return (
		<div className="max-w-[1000px]">
			<div className="flex items-center gap-3 mb-6">
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Applications
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				{res && (
					<span className="text-text-gray text-sm">{res.total} total</span>
				)}
			</div>
			<ApplicationsClient res={res} currentStatus={status} currentPage={page} />
		</div>
	);
}
