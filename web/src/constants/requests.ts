import type { RequestStatus, RequestType } from "@/types/request";

export const REQUEST_STATUS_COLORS: Record<RequestStatus, string> = {
	pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
	approved: "text-green-400 bg-green-400/10 border-green-400/20",
	declined: "text-red-400 bg-red-400/10 border-red-400/20",
};

export const REQUEST_TYPE_ICONS: Record<RequestType, string> = {
	post: "fas fa-newspaper",
	project: "fas fa-project-diagram",
	sponsor: "fas fa-handshake",
	member: "fas fa-user-plus",
};
