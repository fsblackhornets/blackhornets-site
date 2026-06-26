import { asc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teamMembers, users } from "@/lib/db/schema";

export async function GET() {
	try {
		const rows = await db
			.select({
				id: users.id,
				full_name: users.full_name,
				email: users.email,
				role: users.role,
				team: users.team,
				department: users.department,
				position: sql<string>`
					CASE
						WHEN ${users.role} IN ('sub_leader','project_leader','team_leader')
							THEN REPLACE(REPLACE(${users.role},'_',' '),'leader','Leader')
						ELSE ${teamMembers.position}
					END
				`,
				position_en: teamMembers.position_en,
				study_field: teamMembers.study_field,
				faculty: teamMembers.faculty,
				academic_year: teamMembers.academic_year,
				motivation: teamMembers.motivation,
				skills: teamMembers.skills,
				profile_picture: teamMembers.profile_picture,
				department_name: sql<string>`
					CASE ${users.department}
						WHEN 'chassis_aero'        THEN 'Chassis and Aerodynamics'
						WHEN 'suspension_steering'  THEN 'Suspension and Steering'
						WHEN 'transmission_braking' THEN 'Transmission and Braking'
						WHEN 'high_voltage'         THEN 'High Voltage'
						WHEN 'low_voltage'          THEN 'Low Voltage'
						WHEN 'marketing'            THEN 'Marketing'
						WHEN 'sponsorships'         THEN 'Sponsorships'
						WHEN 'management'           THEN 'Management'
						ELSE ${users.department}
					END
				`,
			})
			.from(users)
			.leftJoin(teamMembers, sql`${users.id} = ${teamMembers.user_id}`)
			.where(
				sql`${users.status} = 'active' AND ${users.role} NOT IN ('admin','manager')`,
			)
			.orderBy(
				sql`FIELD(${users.role},'team_leader','project_leader','sub_leader','team_member')`,
				asc(users.team),
				asc(users.department),
				asc(users.full_name),
			);

		const data = rows.map((r) => ({
			...r,
			profile_picture: r.profile_picture ?? "default.jpg",
		}));

		return NextResponse.json({ success: true, data });
	} catch {
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 },
		);
	}
}
