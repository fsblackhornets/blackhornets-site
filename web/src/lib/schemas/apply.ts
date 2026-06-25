import { z } from "zod";

export const applySchema = z.object({
	firstName: z
		.string()
		.min(2, "First name must be at least 2 characters")
		.max(50),
	lastName: z
		.string()
		.min(2, "Last name must be at least 2 characters")
		.max(50),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(6, "Phone number too short").max(20),
	studentId: z.string().min(2, "Student ID required").max(20),
	faculty: z.string().min(2, "Faculty required").max(100),
	major: z.string().min(2, "Major required").max(50),
	gpa: z.coerce
		.number()
		.min(6, "GPA must be at least 6.00")
		.max(10, "GPA cannot exceed 10.00"),
	academic_year: z.string().min(1, "Academic year required"),
	years_studying: z.coerce.number().min(1).max(10),
	position: z.string().min(2, "Desired position required").max(50),
	experience: z.string().max(2000).optional(),
	motivation: z
		.string()
		.min(50, "Motivation must be at least 50 characters")
		.max(5000),
	website_url: z.string().max(0).optional(),
});

export type ApplyInput = z.infer<typeof applySchema>;
