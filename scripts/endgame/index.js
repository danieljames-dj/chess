import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import games from './games.json' assert {
  type: 'json',
};

async function main() {
  const s3 = new AWS.S3({
    accessKeyId: process.env.CLOUD_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUD_SECRET_ACCESS_KEY,
  });
  for (var i = 0; i < games.length; i++) {
    await s3
      .putObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `endgame_${i+1}`,
        Body: JSON.stringify({
          fen: games[i]
        }),
        ContentType: 'application/json',
      })
      .promise();
  }
}

dotenv.config()
await main();
