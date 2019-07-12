import { getExtensions } from '../common';

/**
 * Возвращает описание блока resolve конфигурации.
 */
export const getResolve = () => {
  const extensions = getExtensions();
  return { extensions };
};
