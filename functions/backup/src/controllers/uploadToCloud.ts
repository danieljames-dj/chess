import AWS from 'aws-sdk';
import { readFileSync } from 'fs';

export async function uploadToCloud(
  file: string,
  fileName: string,
  env: { [key: string]: string },
) {
  let s3: AWS.S3;
  if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
    s3 = new AWS.S3({
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    });
  } else {
    s3 = new AWS.S3();
  }
  await s3
    .putObject({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: readFileSync(file),
      ContentType: 'application/zip',
    })
    .promise();
}
