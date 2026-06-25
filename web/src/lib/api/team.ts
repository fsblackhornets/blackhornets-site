import { apiGet } from "@/lib/api-client";

interface TeamResponse {
	members: unknown[];
}

export async function fetchMemberCount(): Promise<number | null> {
	try {
		const data = await apiGet<TeamResponse>("team", {
			next: { revalidate: 300 },
		});
		return data.members.length;
	} catch {
		return null;
	}
}
