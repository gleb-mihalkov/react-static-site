import { getDstPath } from '../common';

/**
 * Возвращает блок output конфигурации.
 */
export const getOutput = () => {
  const filename = '[name].[hash].js';
  const path = getDstPath();
  return { path, filename };
};