import { getRootPath } from './getRootPath';

/**
 * Возвращает путь, построенный относительно папки с итоговой сборкой.
 * @param  {...any} args Компоненты пути.
 */
export const getDstPath = (...args) => getRootPath('build', ...args);
