import { getDstPath } from './getDstPath';

/**
 * Возвращает блок output конфигурации.
 */
export const getConfigOutput = () => {
  const filename = '[name].[hash].js';
  const path = getDstPath();
  return { path, filename };
};