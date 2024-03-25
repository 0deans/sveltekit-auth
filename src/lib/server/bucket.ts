import { S3Client } from "@aws-sdk/client-s3";
import {
	S3BUCKET_ENDPOINT,
	S3BUCKET_KEY_ID,
	S3BUCKET_KEY_SECRET,
	S3BUCKET_REGION
} from "$env/static/private";

export const s3Client = new S3Client({
	endpoint: S3BUCKET_ENDPOINT,
	credentials: {
		accessKeyId: S3BUCKET_KEY_ID,
		secretAccessKey: S3BUCKET_KEY_SECRET
	},
	region: S3BUCKET_REGION
});
