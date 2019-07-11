import { getRootPath } from './getRootPath';

let project;

/**
 * Возвращает содержимое файла package.json из корня проекта.
 * @function
 */
export const getProject = () => {
  if (project == null) {
    const projectPath = getRootPath('package.json');
    project = require(projectPath);
  }

  return project;
};
