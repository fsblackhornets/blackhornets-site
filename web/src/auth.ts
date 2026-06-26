import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export type UserRole =
	| "admin"
	| "manager"
	| "team_member"
	| "sub_leader"
	| "team_leader"
	| "project_leader";

declare module "next-auth" {
	interface User {
		role: UserRole;
		full_name: string;
		username: string;
	}
	interface Session {
		user: {
			id: string;
			username: string;
			full_name: string;
			role: UserRole;
		};
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) return null;

				try {
					const [user] = await db
						.select()
						.from(users)
						.where(eq(users.username, credentials.username as string))
						.limit(1);

					if (!user) return null;
					if (user.status !== "active") return null;
					if (!["admin", "manager"].includes(user.role ?? "")) return null;

					const valid = await bcrypt.compare(
						credentials.password as string,
						user.password,
					);
					if (!valid) return null;

					return {
						id: String(user.id),
						name: user.full_name,
						email: user.email,
						role: user.role as UserRole,
						full_name: user.full_name,
						username: user.username,
					};
				} catch {
					return null;
				}
			},
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				const u = user as {
					role: UserRole;
					full_name: string;
					username: string;
				};
				token.role = u.role;
				token.full_name = u.full_name;
				token.username = u.username;
			}
			return token;
		},
		session({ session, token }) {
			// @ts-expect-error — we replace session.user with our own shape
			session.user = {
				id: token.sub ?? "",
				username: (token.username as string) ?? "",
				full_name: (token.full_name as string) ?? "",
				role: (token.role as UserRole) ?? "admin",
			};
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
	session: { strategy: "jwt" },
});
