const styledTransformer = require('typescript-plugin-styled-components').default();

/**
 * Returns a list of transformers.
 */
module.exports = () => ({
  before: [styledTransformer],
});
