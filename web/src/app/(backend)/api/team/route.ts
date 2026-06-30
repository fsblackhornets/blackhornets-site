import { asc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teamMembers, users } from "@/lib/db/schema";

const DEPARTMENT_NAMES: Record<string, string> = {
	chassis_aero: "Chassis and Aerodynamics",
	suspension_steering: "Suspension and Steering",
	transmission_braking: "Transmission and Braking",
	carbody: "Car Body",
	rolling_stock: "Rolling Stock",
	high_voltage: "High Voltage",
	low_voltage: "Low Voltage",
	bms_can_battery: "BMS / Battery",
	drive_and_cooling: "Drive & Cooling",
	motor_inverter: "Motor & Inverter",
	marketing: "Marketing",
	sponsorships: "Sponsorships",
	management: "Management",
};

const ROLE_DISPLAY: Record<string, string> = {
	team_leader: "Team Leader",
	project_leader: "Project Leader",
	sub_leader: "Sub Leader",
};

export async function GET() {
	try {
		const rows = await db
			.select({
				id: teamMembers.id,
				user_id: teamMembers.user_id,
				full_name: users.full_name,
				email: users.email,
				phone: users.phone,
				role: users.role,
				status: users.status,
				position: teamMembers.position,
				position_en: teamMembers.position_en,
				academic_year: teamMembers.academic_year,
				study_field: teamMembers.study_field,
				faculty: teamMembers.faculty,
				department: teamMembers.department,
				team: teamMembers.team,
				age: teamMembers.age,
				date_of_birth: teamMembers.date_of_birth,
				profile_picture: teamMembers.profile_picture,
				image_position: teamMembers.image_position,
				motivation: teamMembers.motivation,
				skills: teamMembers.skills,
				projects: teamMembers.projects,
				achievements: teamMembers.achievements,
				created_at: teamMembers.created_at,
			})
			.from(teamMembers)
			.innerJoin(users, eq(teamMembers.user_id, users.id))
			.where(sql`${users.status} = 'active'`)
			.orderBy(
				sql`FIELD(${users.role},'team_leader','project_leader','sub_leader','team_member')`,
				asc(teamMembers.team),
				asc(teamMembers.department),
				asc(users.full_name),
			);

		const members = rows.map((r) => ({
			...r,
			profile_picture: (r.profile_picture && r.profile_picture !== "undefined") ? r.profile_picture : "default.jpg",
			position: ROLE_DISPLAY[r.role ?? ""] ?? r.position,
			department_name: r.department
				? (DEPARTMENT_NAMES[r.department] ?? r.department)
				: null,
		}));

		return NextResponse.json({
			success: true,
			members,
			organized_data: {
				operating_business: members.filter(
					(m) => m.team === "operating_business",
				),
				mechanical: members.filter((m) => m.team === "mechanical"),
				electrical: members.filter((m) => m.team === "electrical"),
			},
			team_leader: members.find((m) => m.role === "team_leader") ?? null,
			mechanical_project_leader:
				members.find(
					(m) => m.role === "project_leader" && m.team === "mechanical",
				) ?? null,
			electrical_project_leader:
				members.find(
					(m) => m.role === "project_leader" && m.team === "electrical",
				) ?? null,
			business_project_leader:
				members.find(
					(m) => m.role === "project_leader" && m.team === "operating_business",
				) ?? null,
		});
	} catch (e) {
		console.error("[/api/team]", e);
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 },
		);
	}
}
