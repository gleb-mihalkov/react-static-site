import { resolve } from 'path';

/**
 * Возвращает путь, построенный относительно корня проекта.
 * @param  {...any} args Компоненты пути.
 */
export const getRootPath = (...args) => resolve(__dirname, '..', ...args);
