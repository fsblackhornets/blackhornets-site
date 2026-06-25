"use server";

import { apiPost } from "@/lib/api-client";
import { contactSchema } from "@/lib/schemas/contact";

export interface ContactState {
	status: "idle" | "success" | "error";
	message: string;
	errors?: Record<string, string>;
}

interface PhpResponse {
	status: string;
	message: string;
}

export async function contactAction(
	_prev: ContactState,
	formData: FormData,
): Promise<ContactState> {
	const raw = {
		name: formData.get("name") as string,
		email: formData.get("email") as string,
		subject: formData.get("subject") as string,
		message: formData.get("message") as string,
		website_url: (formData.get("website_url") as string) ?? "",
	};

	// Honeypot — silently succeed
	if (raw.website_url) {
		return {
			status: "success",
			message: "Message sent! We will get back to you soon.",
		};
	}

	const result = contactSchema.safeParse(raw);
	if (!result.success) {
		const errors: Record<string, string> = {};
		for (const issue of result.error.issues) {
			errors[issue.path[0] as string] = issue.message;
		}
		return { status: "error", message: "Please fix the errors below.", errors };
	}

	try {
		const res = await apiPost<PhpResponse>("contact/send", formData);
		if (res.status === "success") {
			return { status: "success", message: res.message };
		}
		return { status: "error", message: res.message ?? "Failed to send." };
	} catch {
		return { status: "error", message: "An error occurred. Please try again." };
	}
}
