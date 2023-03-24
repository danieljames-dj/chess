import {readFile} from 'fs';

import {logger} from '../config/logger';
import {FileListType} from '../types/FileListType';

export const getChessFilesList = async (): Promise<FileListType> => {
  logger('controllers/getChessFilesList');
  // TODO: Change to fetch from Google Sheet
  const fileListPath = 'src/tempData.json';
  return new Promise((resolve, reject) => {
    readFile(fileListPath, 'utf8', function(err, data) {
      if (!err) {
        resolve(JSON.parse(data));
      } else {
        reject(err);
      }
    });
  });
};
