const { resolve } = require('path');
const { existsSync } = require('fs');
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const TerserPlugin  = require('terser-webpack-plugin');
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');
const flat = require('array-flatten');

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
const url = (...args) => `/${root(...args).substr(root().length)}`;

/**
 * Returns the list of arguments without the empties.
 * @param  {...any} args List of items.
 */
const list = (...args) => flat(args).filter(Boolean);

/**
 * Returns webpack configuration object.
 * @param {object} cliEnv Collection environment variables.
 * @param {object} cliArgs Collection of the flags.
 */
module.exports = (cliEnv, cliArgs) => {
  /**
   * Real collection of environment variables.
   */
  const env = { ...process.env, ...cliEnv };

  /**
   * Opertaion mode: 'development' or 'production';
   */
  const mode = env.NODE_ENV || cliArgs.mode || 'production';
  env.NODE_ENV = mode;

  /**
   * True if webpack works in bundle analyze mode.
   */
  const isAnalyze = cliArgs.analyze;

  /**
   * True if webpack works in development mode.
   */
  const isDev = mode === 'development';

  /**
   * Avalible extensions of entry point of modules.
   */
  const extensions = ['.tsx', '.ts', '.jsx', '.js'];

  /**
   * Entry point of application.
   */
  const entry = extensions.map(item => src(`index${item}`)).find(existsSync);

  /**
   * Base relative URL of application.
   */
  const baseUrl = url();
  env.BASE_URL = baseUrl;

  return {
    mode,

    devtool: isDev && 'source-map',

    devServer: {
      host: 'localhost',
      port: 8080,
      open: true,
      hot: true,
    },

    entry: {
      main: entry,
    },

    output: {
      filename: isDev ? '[name].js' : '[name].[chunkhash].js',
      path: dst(),
      publicPath: baseUrl,
    },

    resolve: {
      extensions,

      plugins: list(
        new TsConfigPathsPlugin(),
      ),
    },

    plugins: list(
      new CheckerPlugin(),

      new DefinePlugin({
        'process.env': JSON.stringify(env),
      }),

      new HtmlWebpackPlugin({
        template: src('index.ejs'),
      }),

      new MomentLocalesPlugin({
        localesToKeep: ['ru'],
      }),

      isAnalyze && [
        new BundleAnalyzerPlugin(),
      ],

      isDev ? [
        new HotModuleReplacementPlugin(),
      ] : [
        new CleanWebpackPlugin(),
      ],
    ),

    optimization: {
      splitChunks: {
        automaticNameDelimiter: '-',
        chunks: 'all',
      },
      minimizer: [
        new TerserPlugin({
          parallel: true,
          cache: true,
          terserOptions: {
            output: {
              comments: false,
            },
          }
        }),
      ],
    },

    module: {
      rules: list(
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          options: {
            useCache: true,
            getCustomTransformers: isDev
              ? root('webpack.dev-ts-transformers.js')
              : () => ({}),
          },
        },
      ),
    },
  };
};

