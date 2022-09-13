import AdmZip = require('adm-zip');
import axios from 'axios';
import {
  mkdirSync,
  rmSync,
} from 'fs';

import {Storage} from '@google-cloud/storage';

import {logger} from '../config/logger';
import {FileListType} from '../types/FileListType';
import {downloadFile} from './downloadFile';
import {getChessFilesList} from './getChessFilesList';
import {getHanoiIndex} from './getHanoiIndex';
import {sendMessageToTelegram} from './sendTelegramMessage';
import {uploadFile} from './uploadFile';

const sendMessage = (message: string) => {
  const chatId = process.env.TELEGRAM_BOT_CHAT_ID;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  sendMessageToTelegram(message, chatId, botToken);
};

const downloadBackup = async (directory: string) => {
  rmSync(`${directory}/backup`, {recursive: true, force: true});
  mkdirSync(`${directory}/backup`);
  const fileList: FileListType = await getChessFilesList();
  for (const type of Object.keys(fileList)) {
    mkdirSync(`${directory}/backup/` + type);
    for (const fileName of Object.keys(fileList[type])) {
      const url = fileList[type][fileName] + '.pgn';
      const file = await downloadFile(url);
      uploadFile(file, `${directory}/backup/${type}/${fileName}`);
    }
  }
};

const compressBackup = async (directory: string) => {
  const zip = new AdmZip();
  zip.addLocalFolder(`${directory}/backup`);
  zip.writeZip(`${directory}/backup.zip`);
};

const uploadBackup = async (directory: string) => {
  const hanoiIndex = getHanoiIndex(5);
  const storage = new Storage();
  await storage
      .bucket('gs://lichess-backup.appspot.com/')
      .upload(
          `${directory}/backup.zip`,
          {
            destination: `backup-${hanoiIndex}.zip`,
          }
      );
  await storage
      .bucket('gs://lichess-backup.appspot.com/')
      .upload(
          `${directory}/backup.zip`,
          {
            destination: 'backup.zip',
          }
      );
  rmSync(`${directory}/backup`, {recursive: true, force: true});
  rmSync(`${directory}/backup.zip`);
};

const triggerOpeningTreeBuild = async () => {
  const openingTreeDeployHook = process.env.VERCEL_DEPLOY_HOOK;
  await axios.post(openingTreeDeployHook);
};

export const backup = async () => {
  logger('controllers/backup');
  // '/tmp' is the temporary directory path accepted in google function
  const directory = '/tmp';
  await downloadBackup(directory);
  await compressBackup(directory);
  await uploadBackup(directory);
  await triggerOpeningTreeBuild();
  sendMessage('I am Alive...');
};
