import { apiGet } from "@/lib/api-client";
import type { TeamData } from "@/types/team";

export async function fetchMemberCount(): Promise<number | null> {
	try {
		const data = await apiGet<TeamData>("team", { next: { revalidate: 300 } });
		return data.members.length;
	} catch {
		return null;
	}
}

export async function fetchTeamData(): Promise<TeamData | null> {
	try {
		return await apiGet<TeamData>("team", { next: { revalidate: 300 } });
	} catch {
		return null;
	}
}
