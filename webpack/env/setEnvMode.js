/**
 * Возвращает коллекцию переменных окружения с установленным режимом работы webpack.
 * @param {Object} env Коллекция переменных окружения.
 * @param {String} mode Режим работы webpack.
 */
export const setEnvMode = (env, mode) => ({ ...env, NODE_ENV: mode });
