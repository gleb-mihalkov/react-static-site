import { CleanWebpackPlugin } from 'clean-webpack-plugin';

/**
 * Возвращает список плагинов webpack.
 */
export const getPlugins = () => [
  new CleanWebpackPlugin(),
];
