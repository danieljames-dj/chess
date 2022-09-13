import * as functions from 'firebase-functions';

import {backupRoute} from './routes/backup';
import {downloadRoute} from './routes/download';

exports.backup = functions.runWith({
  timeoutSeconds: 300,
}).https.onRequest(backupRoute);

exports.download = functions.https.onRequest(downloadRoute);
