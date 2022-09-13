import {logger} from '../config/logger';

export const getHanoiIndex = (tapeSize: number) => {
  logger('controllers/getHanoiIndex');
  const indices = new Array(Math.pow(2, tapeSize));
  for (let i = 0; i < tapeSize; i++) {
    const increment = i === tapeSize - 1 ? Math.pow(2, i) : Math.pow(2, i+1);
    for (let j = Math.pow(2, i) - 1; j < indices.length; j += increment) {
      indices[j] = i+1;
    }
  }
  const todayDate = new Date();
  const daysSince1970: number = Math.floor(Number(todayDate)/(1000*60*60*24));
  const index = indices[daysSince1970 % indices.length];
  return index;
};
