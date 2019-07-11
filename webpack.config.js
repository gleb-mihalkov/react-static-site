const register = require('@babel/register');

register({
  presets: ['@babel/preset-env'],
});

const { getConfig } = require('./webpack');
module.exports = getConfig;
