import { TsConfigPathsPlugin } from 'awesome-typescript-loader';

import { getExtensions } from '../common';

/**
 * Возвращает описание блока resolve конфигурации.
 */
export const getResolve = () => {
  const extensions = getExtensions();

  return {
    extensions,

    plugins: [
      new TsConfigPathsPlugin(),
    ],
  };
};
