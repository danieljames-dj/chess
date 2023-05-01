import AWS from 'aws-sdk';

export async function uploadToCloud(
  index: number,
  object: { [key: string]: string },
  env: { [key: string]: string },
) {
  const s3: AWS.S3 = new AWS.S3({
    accessKeyId: env.CLOUD_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUD_SECRET_ACCESS_KEY,
  });
  console.log('DJDJ', index);
  console.log('DJDJ', object);
  await s3
    .putObject({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: `endgame_${index}`,
      Body: JSON.stringify(object),
      ContentType: 'application/json',
    })
    .promise();
}
