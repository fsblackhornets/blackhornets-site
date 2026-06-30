import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env.local manually (no dotenv dep)
const envPath = resolve(__dirname, "../.env.local");
try {
	const raw = readFileSync(envPath, "utf8");
	for (const line of raw.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eq = trimmed.indexOf("=");
		if (eq < 0) continue;
		const key = trimmed.slice(0, eq).trim();
		const val = trimmed.slice(eq + 1).trim();
		if (!process.env[key]) process.env[key] = val;
	}
} catch {
	// no .env.local — rely on real env vars
}

const TEST_PASSWORD = "TestPass123!";

const db = await mysql.createConnection({
	host: process.env.DB_HOST ?? "localhost",
	port: Number(process.env.DB_PORT ?? 3306),
	user: process.env.DB_USER ?? "root",
	password: process.env.DB_PASSWORD ?? "",
	database: process.env.DB_NAME ?? "blackhornets",
});

// Truncate content tables (preserve real users/team)
await db.execute("SET FOREIGN_KEY_CHECKS = 0");
await db.execute("TRUNCATE TABLE content_requests");
await db.execute("TRUNCATE TABLE posts");
await db.execute("TRUNCATE TABLE sponsors");
await db.execute("TRUNCATE TABLE projects");
await db.execute("TRUNCATE TABLE gallery_images");
// Remove test-created members only
await db.execute(
	"DELETE tm FROM team_members tm JOIN users u ON u.id = tm.user_id WHERE u.username IN ('test_admin', 'test_manager')",
);
await db.execute("SET FOREIGN_KEY_CHECKS = 1");

const hash = await bcrypt.hash(TEST_PASSWORD, 10);

await db.execute(
	`INSERT INTO users (username, password, email, full_name, role, status)
   VALUES ('test_admin', ?, 'test_admin@test.local', 'Test Admin', 'admin', 'active')
   ON DUPLICATE KEY UPDATE password = VALUES(password), role = VALUES(role), status = VALUES(status)`,
	[hash],
);

await db.execute(
	`INSERT INTO users (username, password, email, full_name, role, status)
   VALUES ('test_manager', ?, 'test_manager@test.local', 'Test Manager', 'manager', 'active')
   ON DUPLICATE KEY UPDATE password = VALUES(password), role = VALUES(role), status = VALUES(status)`,
	[hash],
);

console.log(
	"Seed complete. test_admin and test_manager ready. Content tables truncated.",
);
await db.end();
