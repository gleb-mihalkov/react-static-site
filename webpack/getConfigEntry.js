import { getProjectName } from './getProjectName';
import { getEntryPath } from './getEntryPath';

/**
 * Возвращает описание точки входа проекта в конфигурации.
 */
export const getConfigEntry = () => {
  const projectName = getProjectName();
  const entryPath = getEntryPath();

  return { [projectName]: entryPath };
};
