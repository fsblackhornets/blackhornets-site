/**
 * One-time migration: copy local public/uploads/* → R2 public bucket
 *                     and public/uploads/resumes/* → R2 private bucket.
 *
 * Run after setting R2 env vars:
 *   npx tsx scripts/migrate-uploads-to-r2.ts
 *
 * Safe to re-run (PutObject is idempotent).
 */

import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

const client = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
	},
});

const PUBLIC_BUCKET = process.env.R2_BUCKET_PUBLIC ?? "";
const PRIVATE_BUCKET = process.env.R2_BUCKET_PRIVATE ?? "";
const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".webp": "image/webp",
	".gif": "image/gif",
	".pdf": "application/pdf",
};

async function upload(bucket: string, key: string, filePath: string) {
	const body = await readFile(filePath);
	const contentType =
		MIME[extname(filePath).toLowerCase()] ?? "application/octet-stream";
	await client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: body,
			ContentType: contentType,
		}),
	);
	console.log(`  ✓ ${bucket}/${key}`);
}

async function run() {
	const subdirs = await readdir(UPLOADS_DIR, { withFileTypes: true });

	for (const entry of subdirs) {
		if (!entry.isDirectory()) continue;
		const subdir = entry.name;
		const bucket = subdir === "resumes" ? PRIVATE_BUCKET : PUBLIC_BUCKET;
		const files = await readdir(join(UPLOADS_DIR, subdir));

		console.log(`\n→ ${subdir} → ${bucket}`);
		for (const file of files) {
			await upload(
				bucket,
				`${subdir}/${file}`,
				join(UPLOADS_DIR, subdir, file),
			);
		}
	}

	console.log("\nDone.");
}

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
