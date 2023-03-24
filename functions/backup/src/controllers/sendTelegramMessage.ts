import axios from 'axios';

import { logger } from '../config/logger';

export async function sendMessageToTelegram(
  message: string,
  chatId: string,
  botToken: string,
) {
  logger('controllers/sendMessageToTelegram');
  const url: string = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;
  await axios.get(url);
}
