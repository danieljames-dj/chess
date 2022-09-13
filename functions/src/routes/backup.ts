import {logger} from '../config/logger';
import {backup} from '../controllers/backup';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const backupRoute = async (request: any, response: any) => {
  logger('routes/backup');
  try {
    await backup();
    response.send();
  } catch (error) {
    response.status(500).send(error);
  }
};
