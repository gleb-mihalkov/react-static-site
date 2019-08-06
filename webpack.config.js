const { resolve, join } = require('path');
const { existsSync } = require('fs');
const dotenv = require('dotenv');
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const sass = require('sass');
const Fiber = require('fibers');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MiniCssExtractLoader = MiniCssExtractPlugin.loader;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssNormalize = require('postcss-normalize');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HardSourcePlugin = require('hard-source-webpack-plugin');
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');

/**
 * Resolves the path by project root.
 * @param  {...any} args Components of the path.
 */
const root = (...args) => resolve(__dirname, ...args);

/**
 * Resolves the path by source directory.
 * @param {...any} args Components of the path.
 */
const src = (...args) => root('src', ...args);

/**
 * Resolves the path by build directory.
 * @param  {...any} args Components of the path.
 */
const dst = (...args) => root('build', ...args);

/**
 * Resolves the path by base URL pathname.
 * @param  {...any} args Components of the path.
 */
const url = (...args) => join('/', ...args);

/**
 * Resolves the path by assets directory.
 * @param  {...any} args Components of the path.
 */
const ast = (...args) => url('assets', ...args).replace(/^\//, '');

/**
 * Resolves the path by cache directory.
 * @param  {...any} args Components of the path.
 */
const cache = (...args) => root('node_modules/.cache', ...args);

/**
 * Returns the flatten not empty list of arguments.
 * @param {*[]} items List of items.
 */
const lst = (items) =>
  Object.assign(items.filter(Boolean).reduce((r, i) => [...r, ...(i._lst ? lst(i) : [i])], []), {
    _lst: true,
  });

/**
 * Returns webpack configuration object.
 * @param {object} cliEnv Collection environment variables.
 * @param {object} cliArgs Collection of the flags.
 */
module.exports = (cliEnv, cliArgs) => {
  /**
   * Environment variables from the .env file.
   */
  const fileEnv = dotenv.config({ path: root('.env') }).parsed;

  /**
   * Final collection of the environment variables.
   */
  const env = { ...fileEnv, ...process.env, ...cliEnv };

  /**
   * Mode of the build: 'development' or 'production'. Production build is optimized,
   * development build contains a full debug infromation.
   */
  const mode = env.NODE_ENV || cliArgs.mode || 'production';
  env.NODE_ENV = mode;

  /**
   * Avalible extensions of entry point of JS or TS modules.
   */
  const extensions = ['.tsx', '.ts', '.jsx', '.js'];

  /**
   * Locale of the project.
   */
  const locale = 'ru';
  env.LOCALE = locale;

  /**
   * List of supported browsers.
   */
  const browserlist = ['> 1%', 'last 2 versions', 'maintained node versions', 'not dead'];

  /**
   * Entry point of application.
   */
  const entry = extensions.map((item) => src(`index${item}`)).find(existsSync);

  /**
   * True if webpack works in bundle analyze mode.
   */
  const isAnalyze = cliArgs.analyze;

  /**
   * True if webpack works in development mode.
   */
  const isDev = mode === 'development';

  /**
   * True if webpack works in production mode.
   */
  const isProd = mode === 'production';

  return {
    mode,

    devtool: isDev && 'source-map',

    devServer: {
      contentBase: src(),
      host: 'localhost',
      port: 8080,
      open: true,
      hot: true,
    },

    entry: {
      index: entry,
    },

    output: {
      filename: isProd ? '[name].[chunkhash].js' : '[name].js',
      path: dst(),
      publicPath: url(),
    },

    resolve: {
      extensions,

      plugins: lst([new TsConfigPathsPlugin()]),
    },

    plugins: lst([
      new CheckerPlugin(),

      new DefinePlugin({
        'process.env': JSON.stringify(env),
      }),

      new HtmlWebpackPlugin({
        template: src('index.html'),
        base: url(),
        favicon: src('favicon.ico'),
      }),

      new MomentLocalesPlugin({
        localesToKeep: [locale],
      }),

      new MiniCssExtractPlugin({
        chunkFilename: isDev ? '[id].css' : '[id].[chunkhash].css',
        filename: isDev ? '[name].css' : '[name].[chunkhash].css',
      }),

      new HardSourcePlugin(),

      isProd &&
        lst([
          new CleanWebpackPlugin(),

          new CopyPlugin([
            {
              from: src('static'),
              to: dst('static'),
            },
          ]),

          new CompressionPlugin({
            cache: true,
          }),
        ]),

      isAnalyze && lst([new BundleAnalyzerPlugin()]),

      isDev && lst([new HotModuleReplacementPlugin()]),
    ]),

    optimization: {
      splitChunks: {
        automaticNameDelimiter: '-',
        chunks: 'all',
      },

      minimizer: lst([
        new OptimizeCssAssetsPlugin(),

        new TerserPlugin({
          parallel: true,
          cache: true,
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ]),
    },

    module: {
      rules: lst([
        {
          test: /\.[tj]sx?$/,
          use: lst([
            {
              loader: 'awesome-typescript-loader',
              options: {
                cacheDirectory: cache('awesome-typescript-loader'),
                useTranspileModule: true,
                useCache: true,
                useBabel: true,
                babelCore: '@babel/core',
                babelOptions: {
                  babelrc: false,
                  presets: lst([
                    [
                      '@babel/preset-env',
                      {
                        targets: browserlist,
                        loose: true,
                      },
                    ],

                    [
                      '@babel/preset-react',
                      {
                        development: isDev,
                      },
                    ],
                  ]),
                  plugins: lst([
                    ['@babel/plugin-transform-runtime'],

                    ['babel-plugin-lodash', {}],

                    isProd && lst(['@babel/plugin-transform-react-constant-elements']),

                    isDev && lst([['babel-plugin-styled-components', { pure: true }]]),
                  ]),
                },
              },
            },
            {
              loader: 'eslint-loader',
              options: {
                configFile: root('.eslintrc'),
                cache: cache('eslint-loader'),
                failOnWarning: true,
                failOnError: true,
                emitWarning: true,
                fix: true,
              },
            },
          ]),
        },

        {
          test: /\.(s[ac]|c)ss$/,
          use: lst([
            isDev
              ? {
                  loader: 'style-loader',
                  options: {
                    sourceMap: isDev,
                  },
                }
              : {
                  loader: MiniCssExtractLoader,
                  options: {},
                },
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev,
                modules: {
                  localIdentName: isDev ? '[name]_[local]' : '[hash:base64]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: isDev,
                plugins: [
                  autoprefixer({
                    overrideBrowserslist: browserlist,
                  }),
                  postcssNormalize({
                    browsers: browserlist,
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: sass,
                fiber: Fiber,
                sourceMap: isDev,
                includePaths: [src()],
              },
            },
          ]),
        },

        {
          test: /\.(woff2|ttf|otf|eot)$/i,
          loader: 'file-loader',
          options: {
            outputPath: ast(),
          },
        },
        {
          test: /\.(png|gif|jpe?g|svg)$/i,
          use: lst([
            {
              loader: 'url-loader',
              options: {
                fallback: 'file-loader',
                outputPath: ast(),
                limit: 1024 * 2,
              },
            },
          ]),
        },
      ]),
    },
  };
};
