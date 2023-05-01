import { uploadToCloud } from './controllers/uploadToCloud';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.handler = async (event: any) => {
  const { index, object } = event.queryStringParameters;
  console.log('DJDJ', index);
  console.log('DJDJ', object);
  const env: { [key: string]: string } = Object.entries(process.env).reduce(
    // eslint-disable-next-line @typescript-eslint/typedef
    (acc: { [key: string]: string }, [key, value]) => {
      acc[key] = value || '';
      return acc;
    },
    {},
  );
  await uploadToCloud(
    parseInt(index, 10),
    JSON.parse(decodeURIComponent(object)),
    env,
  );
};
