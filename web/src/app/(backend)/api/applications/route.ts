import { type NextRequest, NextResponse } from "next/server";
import { saveUploadPrivate } from "@/lib/api/upload";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
	try {
		const form = await req.formData();

		if ((form.get("company_name") as string)?.trim()) {
			return NextResponse.json({
				status: "success",
				message: "Application submitted!",
			});
		}

		const required = [
			"firstName",
			"lastName",
			"email",
			"phone",
			"studentId",
			"faculty",
			"major",
			"academic_year",
			"gpa",
			"position",
			"motivation",
		];
		for (const field of required) {
			if (!(form.get(field) as string)?.trim()) {
				return NextResponse.json(
					{ error: `${field} is required.` },
					{ status: 400 },
				);
			}
		}

		const email = (form.get("email") as string).trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email address." },
				{ status: 400 },
			);
		}

		const resume = form.get("resume") as File | null;
		if (!resume)
			return NextResponse.json(
				{ error: "Please upload a resume (PDF)." },
				{ status: 400 },
			);
		if (resume.size > 5 * 1024 * 1024) {
			return NextResponse.json(
				{ error: "File size must be under 5MB." },
				{ status: 400 },
			);
		}

		const resumeFilename = await saveUploadPrivate(resume, "resumes");
		const resumePath = `resumes/${resumeFilename}`;

		await db.insert(applications).values({
			first_name: (form.get("firstName") as string).trim(),
			last_name: (form.get("lastName") as string).trim(),
			email,
			phone: (form.get("phone") as string).trim(),
			student_id: (form.get("studentId") as string).trim(),
			faculty: (form.get("faculty") as string).trim(),
			major: (form.get("major") as string).trim(),
			academic_year: Number(form.get("academic_year")),
			gpa: (form.get("gpa") as string).trim(),
			desired_position: (form.get("position") as string).trim(),
			experience: (form.get("experience") as string)?.trim() ?? null,
			motivation: (form.get("motivation") as string).trim(),
			resume_path: resumePath,
			status: "pending",
		});

		return NextResponse.json({
			status: "success",
			message:
				"Application submitted successfully! We will review it and contact you soon.",
		});
	} catch {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
