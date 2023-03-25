import AWS from 'aws-sdk';
import { readFileSync } from 'fs';

export async function uploadToCloud(
  file: string,
  fileName: string,
  env: { [key: string]: string },
) {
  const s3: AWS.S3 = new AWS.S3({
    accessKeyId: env.CLOUD_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUD_SECRET_ACCESS_KEY,
  });
  await s3
    .putObject({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: readFileSync(file),
      ContentType: 'application/zip',
    })
    .promise();
}
