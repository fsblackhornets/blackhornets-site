import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { routing } from "@/i18n/routing";

const ADMIN_ROLES = ["admin"] as const;
const MANAGER_ROLES = ["admin", "manager"] as const;

const authMiddleware = auth((req) => {
	const { pathname } = req.nextUrl;
	const role = req.auth?.user?.role;

	if (pathname.startsWith("/admin")) {
		if (!role) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
		if (!ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
			return NextResponse.redirect(new URL("/manager", req.url));
		}
	}

	if (pathname.startsWith("/manager")) {
		if (
			!role ||
			!MANAGER_ROLES.includes(role as (typeof MANAGER_ROLES)[number])
		) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
	}

	return NextResponse.next();
});

function intlMiddleware(req: NextRequest) {
	const cookie = req.cookies.get("NEXT_LOCALE")?.value;
	const locale =
		cookie && (routing.locales as readonly string[]).includes(cookie)
			? cookie
			: routing.defaultLocale;

	const headers = new Headers(req.headers);
	headers.set("X-NEXT-INTL-LOCALE", locale);
	return NextResponse.next({ request: { headers } });
}

export default function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname.startsWith("/admin") || pathname.startsWith("/manager")) {
		return (authMiddleware as (req: NextRequest) => Response | Promise<Response>)(req);
	}

	return intlMiddleware(req);
}

export const config = {
	matcher: [
		"/admin/:path*",
		"/manager/:path*",
		"/((?!api|_next|_vercel|login|.*\\..*).*)",
	],
};
