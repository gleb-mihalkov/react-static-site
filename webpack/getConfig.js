import { getMode } from './common';

import { getPlugins } from './plugins';
import { getResolve } from './resolve';
import { getOutput } from './output';
import { getRules } from './rules';
import { getEntry } from './entry';
import { getEnv } from './env';

/**
 * Возвращает объект настроек webpack.
 * @param {Object} cliEnv Коллекция переменных окружения, переданных через webpack.
 * @param {Object} cliArgs Коллекция именованных флагов командной строки.
 */
export const getConfig = (cliEnv, cliArgs) => {
  const env = getEnv(cliEnv, cliArgs);

  const resolve = getResolve(env);
  const plugins = getPlugins(env);
  const output = getOutput(env);
  const entry = getEntry(env);
  const rules = getRules(env);
  const mode = getMode(env);

  return {
    resolve,
    plugins,
    output,
    entry,
    mode,
    module: { rules },
  };
};
