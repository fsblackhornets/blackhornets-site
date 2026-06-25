export function buildApplicationsUrl(status: string, page?: number): string {
	const params = new URLSearchParams();
	if (status) params.set("status", status);
	if (page && page > 1) params.set("page", String(page));
	const query = params.toString();
	return `/admin/applications${query ? `?${query}` : ""}`;
}
