import { NextResponse } from "next/server";
import { auth } from "@/auth";

const ADMIN_ROLES = ["admin"] as const;
const MANAGER_ROLES = ["admin", "manager"] as const;

export default auth((req) => {
	const { pathname } = req.nextUrl;
	const role = req.auth?.user?.role;

	if (pathname.startsWith("/admin")) {
		if (!role || !ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
			return NextResponse.redirect(new URL("/login", req.url));
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

export const config = {
	matcher: ["/admin/:path*", "/manager/:path*"],
};
