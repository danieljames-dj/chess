import {Storage} from '@google-cloud/storage';

import {logger} from '../config/logger';

export const downloadFromCloud = async (url: string, file: string) => {
  logger('controllers/downloadFromCloud');
  const storage = new Storage();
  try {
    const readStream = await storage.bucket(url).file(file).createReadStream();
    return readStream;
  } catch (error) {
    console.log(error);
    return null;
  }
};
