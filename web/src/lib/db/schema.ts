import {
	date,
	decimal,
	int,
	json,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	tinyint,
	varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
	id: int("id").autoincrement().primaryKey(),
	username: varchar("username", { length: 100 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	email: varchar("email", { length: 100 }).notNull(),
	full_name: varchar("full_name", { length: 100 }).notNull(),
	role: mysqlEnum("role", [
		"admin",
		"manager",
		"team_member",
		"sub_leader",
		"team_leader",
		"project_leader",
	]).default("team_member"),
	team: varchar("team", { length: 50 }),
	department: varchar("department", { length: 50 }),
	phone: varchar("phone", { length: 20 }),
	study_field: varchar("study_field", { length: 100 }),
	position: varchar("position", { length: 100 }),
	profile_picture: varchar("profile_picture", { length: 255 }).default(
		"default.jpg",
	),
	status: mysqlEnum("status", ["active", "inactive"]).default("active"),
	created_at: timestamp("created_at").notNull().defaultNow(),
});

export const teamMembers = mysqlTable("team_members", {
	id: int("id").autoincrement().primaryKey(),
	user_id: int("user_id").notNull(),
	position: varchar("position", { length: 100 }),
	position_en: varchar("position_en", { length: 255 }),
	academic_year: varchar("academic_year", { length: 20 }),
	study_field: varchar("study_field", { length: 100 }),
	faculty: varchar("faculty", { length: 100 }).default(""),
	department: varchar("department", { length: 50 }),
	team: varchar("team", { length: 50 }),
	age: int("age"),
	date_of_birth: date("date_of_birth", { mode: "string" }),
	profile_picture: varchar("profile_picture", { length: 255 }),
	image_position: varchar("image_position", { length: 50 }).default("50% 50%"),
	motivation: text("motivation"),
	skills: text("skills"),
	projects: text("projects"),
	achievements: text("achievements"),
	created_at: timestamp("created_at").notNull().defaultNow(),
});

export const posts = mysqlTable("posts", {
	id: int("id").autoincrement().primaryKey(),
	title: varchar("title", { length: 255 }),
	title_sr: varchar("title_sr", { length: 255 }),
	title_en: varchar("title_en", { length: 255 }),
	content: text("content"),
	content_sr: text("content_sr"),
	content_en: text("content_en"),
	image: varchar("image", { length: 255 }),
	image_position: varchar("image_position", { length: 50 }).default("50% 50%"),
	category: varchar("category", { length: 100 }),
	author: varchar("author", { length: 100 }),
	featured: tinyint("featured").default(0),
	views: int("views").default(0),
	status: mysqlEnum("status", ["published", "draft"]).default("published"),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const projects = mysqlTable("projects", {
	id: int("id").autoincrement().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	status: varchar("status", { length: 50 }).default("Active"),
	due_date: date("due_date", { mode: "string" }),
	duration: varchar("duration", { length: 100 }),
	progress: int("progress").default(0),
	image: varchar("image", { length: 255 }),
	image_position: varchar("image_position", { length: 50 }).default("50% 50%"),
	created_at: timestamp("created_at").notNull().defaultNow(),
});

export const galleryImages = mysqlTable("gallery_images", {
	id: int("id").autoincrement().primaryKey(),
	title: varchar("title", { length: 255 }),
	description: text("description"),
	description_en: text("description_en"),
	image_path: varchar("image_path", { length: 255 }).notNull(),
	category: varchar("category", { length: 50 }).default("team"),
	alt_text: varchar("alt_text", { length: 255 }),
	sort_order: int("sort_order").default(0),
	is_active: tinyint("is_active").default(1),
	created_by: int("created_by"),
	created_at: timestamp("created_at").notNull().defaultNow(),
});

export const sponsors = mysqlTable("sponsors", {
	id: int("id").autoincrement().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	description_en: text("description_en"),
	tier: varchar("tier", { length: 50 }).notNull(),
	website: varchar("website", { length: 255 }),
	logo: varchar("logo", { length: 255 }),
	image_position: varchar("image_position", { length: 50 }).default("50% 50%"),
	tier_order: int("tier_order").default(0),
	created_at: timestamp("created_at").notNull().defaultNow(),
});

export const applications = mysqlTable("applications", {
	id: int("id").autoincrement().primaryKey(),
	first_name: varchar("first_name", { length: 50 }).notNull(),
	last_name: varchar("last_name", { length: 50 }).notNull(),
	email: varchar("email", { length: 100 }).notNull(),
	phone: varchar("phone", { length: 20 }).notNull(),
	student_id: varchar("student_id", { length: 20 }).notNull(),
	faculty: varchar("faculty", { length: 100 }).notNull().default(""),
	major: varchar("major", { length: 50 }).notNull(),
	academic_year: int("academic_year").notNull(),
	gpa: decimal("gpa", { precision: 4, scale: 2 }).notNull(),
	desired_position: varchar("desired_position", { length: 50 }).notNull(),
	experience: text("experience"),
	motivation: text("motivation").notNull(),
	resume_path: varchar("resume_path", { length: 255 }).notNull(),
	status: mysqlEnum("status", [
		"pending",
		"reviewing",
		"accepted",
		"rejected",
	]).default("pending"),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const contactMessages = mysqlTable("contact_messages", {
	id: int("id").autoincrement().primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	email: varchar("email", { length: 100 }).notNull(),
	subject: varchar("subject", { length: 200 }).notNull(),
	message: text("message").notNull(),
	status: mysqlEnum("status", ["new", "read", "replied"]).default("new"),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const contentRequests = mysqlTable("content_requests", {
	id: int("id").autoincrement().primaryKey(),
	type: mysqlEnum("type", [
		"member",
		"post",
		"project",
		"sponsor",
		"gallery",
	]).notNull(),
	data: json("data").notNull(),
	submitted_by: int("submitted_by").notNull(),
	submitter_name: varchar("submitter_name", { length: 255 })
		.notNull()
		.default(""),
	status: mysqlEnum("status", ["pending", "approved", "declined"])
		.notNull()
		.default("pending"),
	admin_notes: text("admin_notes"),
	reviewed_by: int("reviewed_by"),
	reviewed_at: timestamp("reviewed_at"),
	created_at: timestamp("created_at").notNull().defaultNow(),
});

export const siteSettings = mysqlTable("site_settings", {
	id: int("id").autoincrement().primaryKey(),
	setting_key: varchar("setting_key", { length: 100 }).notNull().unique(),
	setting_value: text("setting_value").notNull(),
	updated_at: timestamp("updated_at").notNull().defaultNow(),
	updated_by: int("updated_by"),
});
