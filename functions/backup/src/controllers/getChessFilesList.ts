import axios, { AxiosResponse } from 'axios';
import { parse } from 'csv-parse';

import { logger } from '../config/logger';
import { FileListType } from '../types/FileListType';

function getSheetUrlForCsv(sheetId: string, sheetName: string): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
}

export async function getChessFilesList(env: {
  [key: string]: string;
}): Promise<FileListType> {
  logger('controllers/getChessFilesList');
  // TODO: Rename this file to more meaningful as it is no longer fetching the JSON file like before.
  const fileList: FileListType = { Games: {}, Openings: {} };
  let isGamesCompleted: boolean = false;
  let isOpeningsCompleted: boolean = false;
  const openingResponse: AxiosResponse = await axios.get(
    getSheetUrlForCsv(env.SPREADSHEET_ID, env.OPENING_SHEET_NAME),
    { responseType: 'stream' },
  );
  const gamesResponse: AxiosResponse = await axios.get(
    getSheetUrlForCsv(env.SPREADSHEET_ID, env.GAMES_SHEET_NAME),
    { responseType: 'stream' },
  );
  return new Promise<FileListType>((resolve: (value: FileListType) => void) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openingReq: any = openingResponse.data.pipe(
      parse({ delimiter: ',', fromLine: 2 }),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gamesReq: any = gamesResponse.data.pipe(
      parse({ delimiter: ',', fromLine: 2 }),
    );
    openingReq
      .on('data', (csvrow: string[]) => {
        if (csvrow.length < 2 || csvrow[1].length === 0) {
          openingReq.pause();
          isOpeningsCompleted = true;
          if (isGamesCompleted && isOpeningsCompleted) {
            resolve(fileList);
          }
        } else {
          // eslint-disable-next-line prefer-destructuring
          fileList.Openings[csvrow[0]] = csvrow[1];
        }
      })
      .on('end', () => {
        isOpeningsCompleted = true;
        if (isGamesCompleted && isOpeningsCompleted) {
          resolve(fileList);
        }
      });
    gamesReq
      .on('data', (csvrow: string[]) => {
        if (csvrow.length < 2 || csvrow[1].length === 0) {
          gamesReq.pause();
          isGamesCompleted = true;
          if (isGamesCompleted && isOpeningsCompleted) {
            resolve(fileList);
          }
        } else {
          // eslint-disable-next-line prefer-destructuring
          fileList.Games[csvrow[0]] = csvrow[1];
        }
      })
      .on('end', () => {
        isGamesCompleted = true;
        if (isGamesCompleted && isOpeningsCompleted) {
          resolve(fileList);
        }
      });
  });
}
