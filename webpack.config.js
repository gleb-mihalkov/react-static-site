const { resolve } = require('path');
const { existsSync } = require('fs');
const dotenv = require('dotenv');
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const sass = require('sass');
const Fiber = require('fibers');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const TerserPlugin  = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MiniCssExtractLoader = MiniCssExtractPlugin.loader;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssNormalize = require('postcss-normalize');
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
const url = (...args) => `/${root(...args).substr(root().length)}`;

/**
 * Returns the flatten not empty list of arguments.
 * @param  {...any} args List of items.
 */
const lst = (...args) => {
  const items = args.filter(Boolean).reduce((r, i) => [...r, ...(i._lst ? lst(...i) : [i])], []);
  items._lst = true;
  return items;
};

/**
 * Returns webpack configuration object.
 * @param {object} cliEnv Collection environment variables.
 * @param {object} cliArgs Collection of the flags.
 */
module.exports = (cliEnv, cliArgs) => {
  /**
   * Environment variables from the file.
   */
  const fileEnv = dotenv.config({ path: root('.env') }).parsed;

  /**
   * Real collection of environment variables.
   */
  const env = { ...fileEnv, ...process.env, ...cliEnv };

  /**
   * Opertaion mode: 'development' or 'production';
   */
  const mode = env.NODE_ENV || cliArgs.mode || 'production';
  env.NODE_ENV = mode;

  /**
   * Avalible extensions of entry point of modules.
   */
  const extensions = ['.tsx', '.ts', '.jsx', '.js'];

  /**
   * Avalible locales of the project.
   */
  const locales = ['ru'];

  /**
   * List of browsers on which the build should works.
   */
  const browserlist = [
    '> 1%',
    'last 2 versions',
    'maintained node versions',
    'not dead',
  ];

  /**
   * Entry point of application.
   */
  const entry = extensions.map(item => src(`index${item}`)).find(existsSync);

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

  /**
   * Base relative URL of application.
   */
  const baseUrl = url();
  env.BASE_URL = baseUrl;

  /**
   * Options of the Babel JS.
   */
  const babelOptions = {
    babelrc: false,
    presets: lst(
      ['@babel/preset-env', {
        targets: browserlist,
        useBuiltIns: 'entry',
        loose: true,
        corejs: {
          proposals: true,
          version: 3,
        },
      }],

      ['@babel/preset-react', {
        development: isDev,
      }],
    ),
    plugins: lst(
      'babel-plugin-lodash',

      isProd && lst(
        '@babel/plugin-transform-react-constant-elements',
      ),

      isDev && lst(
        ['babel-plugin-styled-components', { pure: true }],
      ),
    ),
  };

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
      filename: isProd ? '[name].[chunkhash].js' : '[name].js',
      path: dst(),
      publicPath: baseUrl,
    },

    resolve: {
      extensions,

      plugins: lst(
        new TsConfigPathsPlugin(),
      ),
    },

    plugins: lst(
      new CheckerPlugin(),

      new DefinePlugin({
        'process.env': JSON.stringify(env),
      }),

      new HtmlWebpackPlugin({
        template: src('index.ejs'),
      }),

      new MomentLocalesPlugin({
        localesToKeep: locales,
      }),

      new MiniCssExtractPlugin({
        chunkFilename: isDev ? '[id].css' : '[id].[chunkhash].css',
        filename: isDev ? '[name].css' : '[name].[chunkhash].css',
      }),

      isProd && lst(
        new CleanWebpackPlugin(),
      ),

      isAnalyze && lst(
        new BundleAnalyzerPlugin(),
      ),

      isDev && lst(
        new HotModuleReplacementPlugin(),
      ),
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
          },
        }),

        new OptimizeCssAssetsPlugin(),
      ],
    },

    module: {
      rules: lst(
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          options: {
            cacheDirectory: root('node_modules/.cache/awesome-typescript-loader'),
            useTranspileModule: true,
            useCache: true,
            useBabel: true,
            babelCore: '@babel/core',
            babelOptions: { ...babelOptions },
          },
        },

        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: root('node_modules/.cache/babel-loader'),
            ...babelOptions,
          },
        },

        {
          test: /\.(s[ac]|c)ss$/,
          use: [
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
              },
            },
          ],
        }
      ),
    },
  };
};

