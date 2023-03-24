/* eslint-disable no-restricted-syntax */
import { mkdirSync, rmSync } from 'fs';

// import AdmZip = require('adm-zip');
import { downloadFile } from './controllers/downloadFile';
import { getChessFilesList } from './controllers/getChessFilesList';
import { sendMessageToTelegram } from './controllers/sendTelegramMessage';
import { uploadFile } from './controllers/uploadFile';
import { FileListType } from './types/FileListType';

async function downloadBackup(directory: string) {
  rmSync(`${directory}/backup`, { recursive: true, force: true });
  mkdirSync(`${directory}/backup`);
  const fileList: FileListType = await getChessFilesList();
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
  // const zip = new AdmZip();
  // zip.addLocalFolder(`${directory}/backup`);
  // zip.writeZip(`${directory}/backup.zip`);
}

async function uploadBackup(directory: string) {
  // const hanoiIndex: number = getHanoiIndex(5);
  // const storage = new Storage();
  // await storage
  //   .bucket('gs://lichess-backup.appspot.com/')
  //   .upload(`${directory}/backup.zip`, {
  //     destination: `backup-${hanoiIndex}.zip`,
  //   });
  // await storage
  //   .bucket('gs://lichess-backup.appspot.com/')
  //   .upload(`${directory}/backup.zip`, {
  //     destination: 'backup.zip',
  //   });
  rmSync(`${directory}/backup`, { recursive: true, force: true });
  rmSync(`${directory}/backup.zip`);
}

async function triggerOpeningTreeBuild() {
  // const openingTreeDeployHook = process.env.VERCEL_DEPLOY_HOOK;
  // await axios.post(openingTreeDeployHook);
}

async function sendMessage(message: string) {
  const chatId: string = 'process.env.TELEGRAM_BOT_CHAT_ID';
  const botToken: string = 'process.env.TELEGRAM_BOT_TOKEN';
  sendMessageToTelegram(message, chatId, botToken);
}

async function main(tempDirectory: string) {
  console.log(process.env.TELEGRAM_BOT_TOKEN);
  return;
  await downloadBackup(tempDirectory);
  await compressBackup(tempDirectory);
  await uploadBackup(tempDirectory);
  await triggerOpeningTreeBuild();
  sendMessage('I am Alive...');
}

exports.handler = async () => {
  const tempDirectory: string = '/tmp';
  main(tempDirectory);
};
