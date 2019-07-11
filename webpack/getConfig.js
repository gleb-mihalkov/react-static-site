import { getEnv } from './getEnv';
import { getConfigPlugins } from './getConfigPlugins';
import { getConfigEntry } from './getConfigEntry';
import { getConfigResolve } from './getConfigResolve';
import { getConfigMode } from './getConfigMode';
import { getConfigOutput } from './getConfigOutput';

/**
 * Возвращает объект настроек webpack.
 * @param {Object} cliEnv Коллекция переменных окружения, переданных через webpack.
 * @param {Object} cliArgs Коллекция именованных флагов командной строки.
 */
export const getConfig = (cliEnv, cliArgs) => {
  const env = getEnv(cliEnv, cliArgs);

  const mode = getConfigMode(env);
  const entry = getConfigEntry(env);
  const plugins = getConfigPlugins(env);
  const resolve = getConfigResolve(env);
  const output = getConfigOutput(env);

  return {
    resolve,
    plugins,
    output,
    entry,
    mode,
  };
};
