import {
	CopyObjectCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
	},
});

export const R2_BUCKET_PUBLIC = process.env.R2_BUCKET_PUBLIC ?? "";
export const R2_BUCKET_PRIVATE = process.env.R2_BUCKET_PRIVATE ?? "";
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

export async function putObject(
	bucket: string,
	key: string,
	file: File,
): Promise<void> {
	const bytes = await file.arrayBuffer();
	await client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: Buffer.from(bytes),
			ContentType: file.type || "application/octet-stream",
		}),
	);
}

export async function moveObject(
	bucket: string,
	fromKey: string,
	toKey: string,
): Promise<void> {
	await client.send(
		new CopyObjectCommand({
			Bucket: bucket,
			CopySource: `/${bucket}/${fromKey}`,
			Key: toKey,
		}),
	);
	await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: fromKey }));
}

export async function deleteObject(bucket: string, key: string): Promise<void> {
	await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function signedGetUrl(
	bucket: string,
	key: string,
	expiresIn = 300,
): Promise<string> {
	return getSignedUrl(
		client,
		new GetObjectCommand({ Bucket: bucket, Key: key }),
		{ expiresIn },
	);
}
