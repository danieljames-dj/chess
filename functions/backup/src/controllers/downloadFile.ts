import axios, { AxiosResponse } from 'axios';

import { logger } from '../config/logger';

export async function downloadFile(url: string) {
  logger('controllers/downloadFile');
  const response: AxiosResponse = await axios.get(url, {
    responseType: 'blob',
  });
  return response.data;
}
