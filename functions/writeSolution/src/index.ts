import { APIGatewayProxyEvent } from 'aws-lambda';

import { uploadToCloud } from './controllers/uploadToCloud';

exports.handler = async (event: APIGatewayProxyEvent) => {
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
