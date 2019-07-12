import { resolve } from 'path';
import { existsSync } from 'fs';

import { memoize } from './memoize';

/**
 * Возвращает полный путь к корневому каталога проекта.
 */
export const getRootDirname = memoize(() => {
  let dirname = __dirname;

  while (dirname !== '/') {
    const project = resolve(dirname, 'package.json');

    if (existsSync(project)) {
      return dirname;
    }

    dirname = resolve(dirname, '..');
  }

  return null;
});