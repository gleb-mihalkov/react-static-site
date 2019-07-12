import { CheckerPlugin } from 'awesome-typescript-loader';

/**
 * Возвращает массив плагинов для обработки скриптов.
 */
export const getScriptsPlugins = () => [
  new CheckerPlugin(),
];
