/**
 * Collection of the classnames.
 */
interface CssExport { [name: string]: string }

/**
 * This module exists as fallback for css-modules-typescript-loader.
 * @see https://github.com/seek-oss/css-modules-typescript-loader
 */
declare module '*.module.scss' {
  const value: CssExport;
  export = value;
}

/**
 * This module exists as fallback for css-modules-typescript-loader.
 * @see https://github.com/seek-oss/css-modules-typescript-loader
 */
declare module '*.module.css' {
  const value: CssExport;
  export = value;
}

/**
 * Declarations for extensions that avalible for import.
 */

declare module '*.png';
declare module '*.svg';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.woff';
declare module '*.woff2';
declare module '*.eot';
declare module '*.otf';
declare module '*.ttf';
declare module '*.scss';
declare module '*.css';
