import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { contentRequests } from "@/lib/db/schema";
import type { ContentRequest } from "@/types/request";

export async function fetchRequests(options: {
	userId?: number;
	role?: string;
	status?: string;
	type?: string;
}): Promise<ContentRequest[]> {
	try {
		const conditions = [];

		if (options.role !== "admin" && options.userId) {
			conditions.push(eq(contentRequests.submitted_by, options.userId));
		}
		if (options.status && options.status !== "all") {
			conditions.push(
				eq(
					contentRequests.status,
					options.status as "pending" | "approved" | "declined",
				),
			);
		}
		if (options.type && options.type !== "all") {
			conditions.push(
				eq(
					contentRequests.type,
					options.type as "post" | "project" | "sponsor" | "member",
				),
			);
		}

		const rows = await db
			.select()
			.from(contentRequests)
			.where(conditions.length ? and(...conditions) : undefined)
			.orderBy(desc(contentRequests.created_at));

		return rows as unknown as ContentRequest[];
	} catch {
		return [];
	}
}

export async function fetchRequest(id: number): Promise<ContentRequest | null> {
	try {
		const [row] = await db
			.select()
			.from(contentRequests)
			.where(eq(contentRequests.id, id))
			.limit(1);
		return (row as unknown as ContentRequest) ?? null;
	} catch {
		return null;
	}
}
