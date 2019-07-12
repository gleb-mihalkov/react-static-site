import { getCommonRules } from './getCommonRules';
import { getScriptsRules } from './getScriptsRules';

/**
 * Возвращает список загрузчиков для конфигурации webpack.
 * @param {Object} env Коллекция переменных окружения.
 */
export const getRules = (env) => [
  ...getCommonRules(env),
  ...getScriptsRules(env),
];
