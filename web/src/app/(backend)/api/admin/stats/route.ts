import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
	applications,
	contactMessages,
	contentRequests,
	teamMembers,
} from "@/lib/db/schema";

export async function GET() {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const [
			[{ pending_applications }],
			[{ total_messages }],
			[{ pending_requests }],
			teamRows,
			[{ unique_total }],
		] = await Promise.all([
			db
				.select({ pending_applications: sql<number>`COUNT(*)` })
				.from(applications)
				.where(eq(applications.status, "pending")),
			db
				.select({ total_messages: sql<number>`COUNT(*)` })
				.from(contactMessages),
			db
				.select({ pending_requests: sql<number>`COUNT(*)` })
				.from(contentRequests)
				.where(eq(contentRequests.status, "pending")),
			db
				.select({ team: teamMembers.team, count: sql<number>`COUNT(*)` })
				.from(teamMembers)
				.where(eq(teamMembers.status, "active"))
				.groupBy(teamMembers.team),
			// One person can hold multiple roles/teams (e.g. a project leader for
			// two departments) as separate rows — count distinct people, not rows.
			db
				.select({
					unique_total: sql<number>`COUNT(DISTINCT ${teamMembers.full_name})`,
				})
				.from(teamMembers)
				.where(eq(teamMembers.status, "active")),
		]);

		const by_team = {
			mechanical: 0,
			electrical: 0,
			operating_business: 0,
		} as Record<string, number>;
		for (const r of teamRows) {
			if (r.team) by_team[r.team] = Number(r.count);
		}
		const total = Number(unique_total);

		return NextResponse.json({
			pending_applications: Number(pending_applications),
			total_messages: Number(total_messages),
			pending_requests: Number(pending_requests),
			team_members: {
				total,
				mechanical: by_team.mechanical ?? 0,
				electrical: by_team.electrical ?? 0,
				business: by_team.operating_business ?? 0,
			},
		});
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
