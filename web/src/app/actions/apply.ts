"use server";

import { apiPost } from "@/lib/api-client";
import { applySchema } from "@/lib/schemas/apply";

export interface ApplyState {
	status: "idle" | "success" | "error";
	message: string;
	errors?: Record<string, string>;
}

interface PhpResponse {
	status: string;
	message: string;
}

export async function applyAction(
	_prev: ApplyState,
	formData: FormData,
): Promise<ApplyState> {
	// Honeypot
	if (formData.get("website_url")) {
		return {
			status: "success",
			message: "Application submitted successfully!",
		};
	}

	const raw = {
		firstName: formData.get("firstName") as string,
		lastName: formData.get("lastName") as string,
		email: formData.get("email") as string,
		phone: formData.get("phone") as string,
		studentId: formData.get("studentId") as string,
		faculty: formData.get("faculty") as string,
		major: formData.get("major") as string,
		gpa: formData.get("gpa") as string,
		academic_year: formData.get("academic_year") as string,
		years_studying: formData.get("years_studying") as string,
		position: formData.get("position") as string,
		experience: (formData.get("experience") as string) ?? "",
		motivation: formData.get("motivation") as string,
	};

	const result = applySchema.safeParse(raw);
	if (!result.success) {
		const errors: Record<string, string> = {};
		for (const issue of result.error.issues) {
			errors[issue.path[0] as string] = issue.message;
		}
		return { status: "error", message: "Please fix the errors below.", errors };
	}

	// Validate resume file
	const resume = formData.get("resume") as File | null;
	if (!resume || resume.size === 0) {
		return {
			status: "error",
			message: "Resume is required.",
			errors: { resume: "Resume PDF is required." },
		};
	}
	if (resume.size > 5 * 1024 * 1024) {
		return {
			status: "error",
			message: "File too large.",
			errors: { resume: "Resume must be under 5MB." },
		};
	}
	if (resume.type !== "application/pdf") {
		return {
			status: "error",
			message: "Invalid file type.",
			errors: { resume: "Only PDF files are accepted." },
		};
	}

	try {
		const res = await apiPost<PhpResponse>("applications", formData);
		if (res.status === "success") {
			return {
				status: "success",
				message: res.message ?? "Application submitted successfully!",
			};
		}
		return { status: "error", message: res.message ?? "Failed to submit." };
	} catch {
		return { status: "error", message: "An error occurred. Please try again." };
	}
}
