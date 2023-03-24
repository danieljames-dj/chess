import {logger} from '../config/logger';
import {downloadFromCloud} from '../controllers/downloadFromCloud';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const downloadRoute = async (request: any, response: any) => {
  logger('routes/downloadRoute');
  try {
    // TODO: Rename URL to bucket
    const {url, file} = request.query;
    const readStream = await downloadFromCloud(url, file);
    readStream?.pipe(response);
  } catch (error) {
    response.status(500).send(error);
  }
};
