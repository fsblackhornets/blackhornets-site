import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const PHP_BASE = process.env.PHP_BASE ?? "http://localhost:8080/backend";

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

				const body = new URLSearchParams({
					username: credentials.username as string,
					password: credentials.password as string,
				});

				try {
					const res = await fetch(`${PHP_BASE}/process_login.php`, {
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: body.toString(),
					});

					const data = (await res.json()) as {
						status: string;
						full_name?: string;
						role?: string;
						user_id?: number;
					};

					if (data.status !== "success") return null;

					return {
						id: String(data.user_id ?? ""),
						name: data.full_name ?? "",
						email: `${credentials.username}@blackhornets.rs`,
						role: (data.role ?? "admin") as UserRole,
						full_name: data.full_name ?? "",
						username: credentials.username as string,
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
