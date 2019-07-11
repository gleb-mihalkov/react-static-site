import { setEnvMode } from './setEnvMode';
import { getEnvMode } from './getEnvMode';

/**
 * Возвращает актуальную коллекцию переменных окружения.
 * @param {Object} cliEnv Коллекция переменных окружения, переданных через webpack.
 * @param {Object} cliArgs Коллекция именованнх флагов командной строки.
 */
export const getEnv = (cliEnv, cliArgs) => {
  let env = { ...process.env, ...cliEnv };

  const mode = getEnvMode(env, cliArgs);
  env = setEnvMode(env, mode);

  return env;
};
