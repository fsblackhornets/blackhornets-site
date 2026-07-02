import { asc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";

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
			.select()
			.from(teamMembers)
			.where(sql`${teamMembers.status} = 'active'`)
			.orderBy(
				sql`FIELD(${teamMembers.role},'team_leader','project_leader','sub_leader','team_member')`,
				asc(teamMembers.team),
				asc(teamMembers.department),
				asc(teamMembers.full_name),
			);

		const members = rows.map((r) => ({
			...r,
			profile_picture:
				r.profile_picture && r.profile_picture !== "undefined"
					? r.profile_picture
					: "default.jpg",
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
