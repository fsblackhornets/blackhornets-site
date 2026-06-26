import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
	try {
		const form = await req.formData();
		const honeypot = (form.get("website_url") as string) ?? "";
		if (honeypot.trim()) {
			return NextResponse.json({
				status: "success",
				message: "Message sent successfully!",
			});
		}

		const name = (form.get("name") as string)?.trim() ?? "";
		const email = (form.get("email") as string)?.trim() ?? "";
		const subject = (form.get("subject") as string)?.trim() ?? "";
		const message = (form.get("message") as string)?.trim() ?? "";

		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{ error: "All fields are required." },
				{ status: 400 },
			);
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email address." },
				{ status: 400 },
			);
		}

		await db.insert(contactMessages).values({ name, email, subject, message });

		return NextResponse.json({
			status: "success",
			message: "Message sent! We will get back to you soon.",
		});
	} catch {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
