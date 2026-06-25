"use server";

import { signIn, signOut } from "@/auth";

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
		return {};
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		if (msg.includes("CredentialsSignin") || msg.includes("credentials")) {
			return { error: "Invalid username or password." };
		}
		return { error: "An error occurred. Please try again." };
	}
}

export async function logoutAction() {
	await signOut({ redirectTo: "/login" });
}
