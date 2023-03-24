import axios from 'axios';
import {logger} from '../config/logger';

export const downloadFile = async (url: string) => {
  logger('controllers/downloadFile');
  const response = await axios.get(url, {responseType: 'blob'});
  return response.data;
};
