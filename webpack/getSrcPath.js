import { getRootPath } from './getRootPath';

/**
 * Возвращает путь, построенный относительно папки с исходным кодом.
 * @param {...any} args Компоненты пути.
 */
export const getSrcPath = (...args) => getRootPath('src', ...args);
