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
						WHEN 'carbody'              THEN 'Car Body'
						WHEN 'rolling_stock'        THEN 'Rolling Stock'
						WHEN 'high_voltage'         THEN 'High Voltage'
						WHEN 'low_voltage'          THEN 'Low Voltage'
						WHEN 'bms_can_battery'      THEN 'BMS / Battery'
						WHEN 'drive_and_cooling'    THEN 'Drive & Cooling'
						WHEN 'motor_inverter'       THEN 'Motor & Inverter'
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

		const members = rows.map((r) => ({
			...r,
			profile_picture: r.profile_picture ?? "default.jpg",
		}));

		const organized_data: Record<string, typeof members> = {
			operating_business: members.filter((m) => m.team === "operating_business"),
			mechanical: members.filter((m) => m.team === "mechanical"),
			electrical: members.filter((m) => m.team === "electrical"),
		};

		const team_leader = members.find((m) => m.role === "team_leader") ?? null;
		const mechanical_project_leader =
			members.find(
				(m) => m.role === "project_leader" && m.team === "mechanical",
			) ?? null;
		const electrical_project_leader =
			members.find(
				(m) => m.role === "project_leader" && m.team === "electrical",
			) ?? null;
		const business_project_leader =
			members.find(
				(m) =>
					m.role === "project_leader" && m.team === "operating_business",
			) ?? null;

		return NextResponse.json({
			success: true,
			members,
			organized_data,
			team_leader,
			mechanical_project_leader,
			electrical_project_leader,
			business_project_leader,
		});
	} catch {
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 },
		);
	}
}
