import axios from 'axios';
import {logger} from '../config/logger';

export const sendMessageToTelegram = async (
    message: string,
    chatId: string,
    botToken: string,
) => {
  logger('controllers/sendMessageToTelegram');
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;
  await axios.get(url);
};
