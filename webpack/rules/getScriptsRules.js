/**
 * Возвращает массив загрузчиков для обработки скриптов.
 */
export const getScriptsRules = () => [
  {
    test: /\.ts$/,
    loader: 'awesome-typescript-loader',
    options: {
      useCache: true,
    },
  },
];
