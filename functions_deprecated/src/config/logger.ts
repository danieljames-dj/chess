import * as functions from 'firebase-functions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logger = (message: string, object: any = {}) => {
  functions.logger.info(message, object);
};
