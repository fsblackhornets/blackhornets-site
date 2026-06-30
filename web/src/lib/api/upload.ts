import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
	R2_BUCKET_PRIVATE,
	R2_BUCKET_PUBLIC,
	putObject,
} from "@/lib/storage/r2";

function isR2Configured(): boolean {
	return !!(
		process.env.R2_ACCOUNT_ID &&
		process.env.R2_ACCESS_KEY_ID &&
		process.env.R2_SECRET_ACCESS_KEY
	);
}

async function saveToDisk(
	file: File,
	subdir: string,
	name: string,
): Promise<void> {
	const bytes = await file.arrayBuffer();
	const dir = path.join(process.cwd(), "public", "uploads", subdir);
	await mkdir(dir, { recursive: true });
	await writeFile(path.join(dir, name), Buffer.from(bytes));
}

export async function saveUpload(file: File, subdir: string): Promise<string> {
	const ext = path.extname(file.name) || ".jpg";
	const name = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
	if (isR2Configured()) {
		await putObject(R2_BUCKET_PUBLIC, `${subdir}/${name}`, file);
	} else {
		await saveToDisk(file, subdir, name);
	}
	return name;
}

export async function saveUploadPrivate(
	file: File,
	subdir: string,
): Promise<string> {
	const ext = path.extname(file.name) || ".pdf";
	const name = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
	if (isR2Configured()) {
		await putObject(R2_BUCKET_PRIVATE, `${subdir}/${name}`, file);
	} else {
		await saveToDisk(file, subdir, name);
	}
	return name;
}
