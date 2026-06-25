import type { Metadata } from "next";
import { SITE_NAME } from "@/constants/site";

export function buildAdminMeta(page: string, context?: string): Metadata {
	const title = context
		? `${context} — ${page} — ${SITE_NAME} Admin`
		: `${page} — ${SITE_NAME} Admin`;
	return { title };
}
