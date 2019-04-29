const path = require('path');
const webpack = require('webpack');
const fse = require('fs-extra');
const argv = require('yargs').argv;

const testPath = path.resolve(__dirname, '..', 'test', 'production');

const plugins = [new webpack.HotModuleReplacementPlugin()];

module.exports = {
  mode: 'development',
  entry: {
    'test-preprod': testPath,
  },
  output: {
    filename: '[name].js',
  },
  plugins: [...plugins],
  devServer: {
    hot: true,
    open: true,
    openPage: 'test/production',
    watchOptions: {
      poll: 1000,
    },
  },
  devtool: 'source-map',
};
