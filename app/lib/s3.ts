import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { PresignedURLInsert } from "./schemas/queries/media";

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

async function s3GetPresignedUrl({
  fileId,
  name,
  mimeType,
  size,
}: PresignedURLInsert) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileId,
    ContentType: mimeType,
    ContentLength: size,
  });

  return {
    fileId,
    url: await getSignedUrl(s3, command, {
      expiresIn: 60 * 5, // 5 minutes
    }),
    name,
    mimeType,
    accessUrl: s3GetPublicUrl(fileId),
  };
}

function s3GetPublicUrl(key: string) {
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
}

export { s3, s3GetPresignedUrl, s3GetPublicUrl };
