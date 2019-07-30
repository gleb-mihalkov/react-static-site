/**
 * This module exists as fallback for css-modules-typescript-loader.
 * @see https://github.com/seek-oss/css-modules-typescript-loader
 */
declare module '*.module.scss' {
  /**
   * Collection of the classnames.
   */
  interface DefaultCssExport { [name: string]: string }

  /**
   * Collection of the classnames.
   */
  const value: DefaultCssExport;
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
