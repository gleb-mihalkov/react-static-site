import { resolve } from 'path';
import { getRootDirname } from './getRootDirname';

/**
 * Возвращает путь, построенный относительно корня проекта.
 * @param  {...any} args Компоненты пути.
 */
export const getRootPath = (...args) => {
  const dirname = getRootDirname();
  return resolve(dirname, ...args);
};
