"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/auth";

export async function loginAction(
	_prev: { error?: string },
	formData: FormData,
): Promise<{ error?: string }> {
	try {
		await signIn("credentials", {
			username: formData.get("username") as string,
			password: formData.get("password") as string,
			redirectTo: "/admin",
		});
	} catch (e) {
		if (e instanceof AuthError) {
			return { error: "Invalid username or password." };
		}
		throw e;
	}
	return {};
}

export async function logoutAction() {
	await signOut({ redirectTo: "/login" });
}
