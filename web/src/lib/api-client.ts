const BASE =
	process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/backend/api";

class ApiError extends Error {
	constructor(
		public readonly status: number,
		public readonly path: string,
	) {
		super(`API ${status}: ${path}`);
	}
}

type FetchInit = RequestInit & {
	next?: { revalidate?: number | false; tags?: string[] };
};

export async function apiGet<T>(path: string, init?: FetchInit): Promise<T> {
	const res = await fetch(`${BASE}/${path}`, init);
	if (!res.ok) throw new ApiError(res.status, path);
	return res.json() as Promise<T>;
}

export async function apiPut<T>(
	path: string,
	body: Record<string, unknown>,
): Promise<T> {
	const res = await fetch(`${BASE}/${path}`, {
		method: "PUT",
		body: JSON.stringify(body),
		headers: { "Content-Type": "application/json" },
	});
	if (!res.ok) throw new ApiError(res.status, path);
	return res.json() as Promise<T>;
}

export async function apiDelete<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE}/${path}`, { method: "DELETE" });
	if (!res.ok) throw new ApiError(res.status, path);
	return res.json() as Promise<T>;
}

export async function apiPost<T>(
	path: string,
	body: FormData | Record<string, unknown>,
	extraHeaders?: Record<string, string>,
): Promise<T> {
	const isForm = body instanceof FormData;
	const headers: Record<string, string> = {
		...(isForm ? {} : { "Content-Type": "application/json" }),
		...extraHeaders,
	};
	const res = await fetch(`${BASE}/${path}`, {
		method: "POST",
		body: isForm ? body : JSON.stringify(body),
		headers: Object.keys(headers).length > 0 ? headers : undefined,
	});
	if (!res.ok) throw new ApiError(res.status, path);
	return res.json() as Promise<T>;
}
