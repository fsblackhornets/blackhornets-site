export interface ContactMessage {
	id: number;
	name: string;
	email: string;
	subject: string;
	message: string;
	status: "new" | "read" | "replied";
	created_at: string;
	updated_at: string;
}
