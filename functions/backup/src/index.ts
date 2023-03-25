/* eslint-disable no-restricted-syntax */
import { mkdirSync, rmSync } from 'fs';

import AdmZip = require('adm-zip');
import axios from 'axios';

import { downloadFile } from './controllers/downloadFile';
import { getChessFilesList } from './controllers/getChessFilesList';
import { getHanoiIndex } from './controllers/getHanoiIndex';
import { sendMessageToTelegram } from './controllers/sendTelegramMessage';
import { uploadFile } from './controllers/uploadFile';
import { uploadToCloud } from './controllers/uploadToCloud';
import { FileListType } from './types/FileListType';

async function downloadBackup(
  directory: string,
  env: { [key: string]: string },
) {
  rmSync(`${directory}/backup`, { recursive: true, force: true });
  mkdirSync(`${directory}/backup`);
  const fileList: FileListType = await getChessFilesList(env);
  for (const type of Object.keys(fileList)) {
    mkdirSync(`${directory}/backup/${type}`);
    for (const fileName of Object.keys(fileList[type])) {
      const url: string = `${fileList[type][fileName]}.pgn`;
      // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-explicit-any
      const file: any = await downloadFile(url);
      uploadFile(file, `${directory}/backup/${type}/${fileName}`);
    }
  }
}

async function compressBackup(directory: string) {
  // eslint-disable-next-line @typescript-eslint/typedef
  const zip = new AdmZip();
  zip.addLocalFolder(`${directory}/backup`);
  zip.writeZip(`${directory}/backup.zip`);
}

async function uploadBackup(directory: string, env: { [key: string]: string }) {
  const hanoiIndex: number = getHanoiIndex(5);
  uploadToCloud(
    `${directory}/backup.zip`,
    `lichess-backup-${hanoiIndex}.zip`,
    env,
  );
  uploadToCloud(`${directory}/backup.zip`, 'lichess-backup.zip', env);
  rmSync(`${directory}/backup`, { recursive: true, force: true });
  rmSync(`${directory}/backup.zip`);
}

async function triggerOpeningTreeBuild(env: { [key: string]: string }) {
  const openingTreeDeployHook: string = env.VERCEL_DEPLOY_HOOK;
  await axios.post(openingTreeDeployHook);
}

async function sendMessage(message: string, env: { [key: string]: string }) {
  const chatId: string = env.TELEGRAM_BOT_CHAT_ID || '';
  const botToken: string = env.TELEGRAM_BOT_TOKEN || '';
  await sendMessageToTelegram(message, chatId, botToken);
}

async function main(tempDirectory: string, env: { [key: string]: string }) {
  await downloadBackup(tempDirectory, env);
  await compressBackup(tempDirectory);
  await uploadBackup(tempDirectory, env);
  await triggerOpeningTreeBuild(env);
  await sendMessage('I am Alive...', env);
}

exports.handler = async () => {
  const tempDirectory: string = '/tmp';
  await main(
    tempDirectory,
    Object.entries(process.env).reduce(
      // eslint-disable-next-line @typescript-eslint/typedef
      (acc: { [key: string]: string }, [key, value]) => {
        acc[key] = value || '';
        return acc;
      },
      {},
    ),
  );
};
