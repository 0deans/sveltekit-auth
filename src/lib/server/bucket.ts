import { S3Client } from "@aws-sdk/client-s3";
import { S3BUCKET_KEY_ID, S3BUCKET_KEY_SECRET } from "$env/static/private";

export const s3Client = new S3Client({
	endpoint: "https://s3.tebi.io",
	credentials: {
		accessKeyId: S3BUCKET_KEY_ID,
		secretAccessKey: S3BUCKET_KEY_SECRET
	},
	region: "global"
});
