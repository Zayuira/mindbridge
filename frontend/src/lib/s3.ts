import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "dummy",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "dummy",
  },
  // If using a custom endpoint like MinIO
  endpoint: process.env.AWS_ENDPOINT,
  forcePathStyle: !!process.env.AWS_ENDPOINT,
});

export const uploadFile = async (file: Buffer, fileName: string, contentType: string) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

export const getDownloadUrl = async (fileName: string) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

export default s3Client;
