import { getCommonPlugins } from './getCommonPlugins';
import { getScriptsPlugins } from './getScriptsPlugins';

/**
 * Возвращает список плагинов webpack.
 * @param {Object} env Коллекция переменных окружения.
 */
export const getPlugins = (env) => [
  ...getCommonPlugins(env),
  ...getScriptsPlugins(env),
];
