import { existsSync } from 'fs';
import { getSrcPath, getExtensions } from '../common';

/**
 * Возвращает путь к точке сборки проекта.
 */
export const getEntryPath = () =>
  getExtensions()
    .map((extension) => getSrcPath(`index${extension}`))
    .find((path) => existsSync(path));
