import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["sr", "en"] as const,
	defaultLocale: "sr",
	localePrefix: "never",
});

export type Locale = (typeof routing.locales)[number];
