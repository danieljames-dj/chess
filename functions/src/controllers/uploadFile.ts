import {writeFileSync} from 'fs';
import {logger} from '../config/logger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uploadFile = async (file: any, url: string) => {
  logger('controllers/uploadFile');
  writeFileSync(url, file);
};
