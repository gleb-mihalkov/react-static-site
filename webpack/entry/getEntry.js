import { getProjectName } from '../common';

import { getEntryPath } from './getEntryPath';

/**
 * Возвращает описание точки входа проекта в конфигурации.
 */
export const getEntry = () => {
  const projectName = getProjectName();
  const entryPath = getEntryPath();

  return { [projectName]: entryPath };
};
