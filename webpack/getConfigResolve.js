import { getEntryExtensions } from './getEntryExtensions';

/**
 * Возвращает описание блока resolve конфигурации.
 */
export const getConfigResolve = () => {
  const extensions = getEntryExtensions();
  return { extensions };
};
