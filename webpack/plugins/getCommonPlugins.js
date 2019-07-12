import { CleanWebpackPlugin } from 'clean-webpack-plugin';

/**
 * Возвращает список общих плагинов проекта.
 */
export const getCommonPlugins = () => [
  new CleanWebpackPlugin(),
];
