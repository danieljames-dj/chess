import { readFile } from 'fs';

import { logger } from '../config/logger';
import { FileListType } from '../types/FileListType';

export async function getChessFilesList(env: {
  [key: string]: string;
}): Promise<FileListType> {
  logger('controllers/getChessFilesList');
  // TODO: Change to fetch from Google Sheet
  const fileListPath: string = env.CHESS_LIST_PATH;
  // eslint-disable-next-line @typescript-eslint/typedef
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/typedef
    readFile(fileListPath, 'utf8', (err, data) => {
      if (!err) {
        resolve(JSON.parse(data));
      } else {
        reject(err);
      }
    });
  });
}
