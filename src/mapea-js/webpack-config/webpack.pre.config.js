const path = require('path');
const webpack = require('webpack');

const distPath = path.resolve(__dirname, '../dist/core/js/mapea.ol.min.js');
const testPreprod = path.resolve(__dirname, '../test/browser/test-preprod.js');
const plugins = [new webpack.HotModuleReplacementPlugin()];

module.exports = {
  mode: 'development',
  entry: {
    'test-preprod': testPreprod,
    'mapea.ol.min': distPath,
  },
  output: {
    path: distPath,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules\/(?!ol)|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-export-default-from'],
          },
        },
      }],
  },
  plugins: [...plugins],
  devServer: {
    hot: true,
    open: true,
    openPage: '/test/browser/test-preprod.html',
    watchOptions: {
      poll: 1000,
    },
  },
  devtool: 'source-map',
};
