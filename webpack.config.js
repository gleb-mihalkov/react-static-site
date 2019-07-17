const { resolve } = require('path');
const { existsSync } = require('fs');
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const package = require('./package.json');

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
 * Returns the list of arguments without the empties.
 * @param  {...any} args List of items.
 */
const list = (...args) => args.filter(Boolean);

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
   * Project name.
   */
  const name = package.name;

  /**
   * Avalible extensions of entry point of modules.
   */
  const extensions = ['.tsx', '.ts', '.jsx', '.js'];

  /**
   * Entry point of application.
   */
  const entry = extensions.map(item => src(`index${item}`)).find(existsSync);

  return {
    mode,

    entry: {
      [name]: entry,
    },

    output: {
      filename: '[name].[hash].js',
      path: dst(),
    },

    resolve: {
      extensions,

      plugins: list(
        new TsConfigPathsPlugin(),
      ),
    },

    plugins: list(
      new CleanWebpackPlugin(),
      new CheckerPlugin(),

      new HtmlWebpackPlugin({
        template: src('index.html'),
      }),

      new DefinePlugin({
        'process.env': JSON.stringify(env),
      }),
    ),

    module: {
      rules: list(
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          options: {
            useCache: true,
          },
        },
      ),
    },
  };
};

