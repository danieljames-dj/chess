import { uploadToCloud } from './controllers/uploadToCloud';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.handler = async (event: any) => {
  const { obj, index } = event;
  const env: { [key: string]: string } = Object.entries(process.env).reduce(
    // eslint-disable-next-line @typescript-eslint/typedef
    (acc: { [key: string]: string }, [key, value]) => {
      acc[key] = value || '';
      return acc;
    },
    {},
  );
  await uploadToCloud(index, obj, env);
};
