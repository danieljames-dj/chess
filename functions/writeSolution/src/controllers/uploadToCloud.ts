import AWS from 'aws-sdk';

export async function uploadToCloud(
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  env: { [key: string]: string },
) {
  const s3: AWS.S3 = new AWS.S3({
    accessKeyId: env.CLOUD_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUD_SECRET_ACCESS_KEY,
  });
  if (index && object) {
    await s3
      .putObject({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: `endgame_${index}`,
        Body: object,
        ContentType: 'application/json',
      })
      .promise();
  }
}
