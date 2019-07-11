import { existsSync } from 'fs';
import { getSrcPath } from './getSrcPath';
import { getEntryExtensions } from './getEntryExtensions';

/**
 * Возвращает путь к точке сборки проекта.
 */
export const getEntryPath = () =>
  getEntryExtensions()
    .map((extension) => getSrcPath(`index${extension}`))
    .find((path) => existsSync(path));
