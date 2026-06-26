import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function saveUpload(file: File, subdir: string): Promise<string> {
	const bytes = await file.arrayBuffer();
	const ext = path.extname(file.name) || ".jpg";
	const name = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
	const dir = path.join(process.cwd(), "public", "uploads", subdir);
	await mkdir(dir, { recursive: true });
	await writeFile(path.join(dir, name), Buffer.from(bytes));
	return name;
}
