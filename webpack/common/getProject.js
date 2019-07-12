import { getRootPath } from './getRootPath';
import { memoize } from './memoize';

/**
 * Возвращает содержимое файла package.json из корня проекта.
 */
export const getProject = memoize(() => {
  const projectPath = getRootPath('package.json');
  return require(projectPath);
});
