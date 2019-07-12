/**
 * Возвращает режим работы webpack
 * @param {Object} env Коллекция переменных окружения.
 * @param {Object} cliArgs Коллекция именованнх флагов командной строки.
 */
export const getEnvMode = (env, cliArgs) => {
  const avalibleValues = ['development', 'production'];
  const defaultValue = avalibleValues[0];

  const value = cliArgs.mode || env.NODE_ENV || defaultValue;
  const formattedValue = value.toLowerCase();

  if (!avalibleValues.includes(formattedValue)) {
    throw new Error(`Mode '${value}' is not supported`);
  }

  return formattedValue;
};
