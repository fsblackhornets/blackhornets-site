export type RequestType = "post" | "project" | "sponsor" | "member";
export type RequestStatus = "pending" | "approved" | "declined";

export interface ContentRequest {
	id: number;
	type: RequestType;
	data: Record<string, unknown>;
	submitted_by: number;
	submitter_name: string;
	status: RequestStatus;
	admin_notes: string | null;
	reviewed_by: number | null;
	reviewed_at: string | null;
	created_at: string;
}
