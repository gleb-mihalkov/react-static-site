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
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
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
 * Resolves the relative that generated by specified resovle function.
 * @param {Function} fn Resolve function.
 * @param  {...any} args Component of the path.
 */
const rel = (fn, ...args) => fn(...args).substr(fn().length);

/**
 * Resolves the path by assets directory.
 * @param  {...any} args Components of the path.
 */
const ast = (...args) => rel(dst, 'assets', ...args).replace(/^\//, '');

/**
 * Resolves the path by base URL pathname.
 * @param  {...any} args Components of the path.
 */
const url = (...args) => `/${rel(root, ...args)}`;

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
        template: src('index.html'),
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

        new CopyPlugin([{
          from: src('static'),
          to: dst('static'),
        }]),

        new CompressionPlugin({
          cache: true,
        }),
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

      minimizer: lst(
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
      ),
    },

    module: {
      rules: lst(
        {
          test: /\.[tj]sx?$/,
          loader: 'awesome-typescript-loader',
          options: {
            cacheDirectory: root('node_modules/.cache/awesome-typescript-loader'),
            useTranspileModule: true,
            useCache: true,
            useBabel: true,
            babelCore: '@babel/core',
            babelOptions: {
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
            },
          },
        },

        {
          test: /\.(s[ac]|c)ss$/,
          use: lst(
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
              },
            },
          ),
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
          use: lst(
            {
              loader: 'url-loader',
              options: {
                fallback: 'file-loader',
                outputPath: ast(),
                limit: 1024 * 2,
              },
            },
          ),
        },
      ),
    },
  };
};

