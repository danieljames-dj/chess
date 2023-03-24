import { logger } from '../config/logger';

export function getHanoiIndex(tapeSize: number) {
  logger('controllers/getHanoiIndex');
  const indices: number[] = new Array(2 ** tapeSize);
  for (let i: number = 0; i < tapeSize; i += 1) {
    const increment: number = i === tapeSize - 1 ? 2 ** i : 2 ** (i + 1);
    for (let j: number = 2 ** i - 1; j < indices.length; j += increment) {
      indices[j] = i + 1;
    }
  }
  const todayDate: Date = new Date();
  const daysSince1970: number = Math.floor(
    Number(todayDate) / (1000 * 60 * 60 * 24),
  );
  const index: number = indices[daysSince1970 % indices.length];
  return index;
}
