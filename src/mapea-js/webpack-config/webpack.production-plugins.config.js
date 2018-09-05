const path = require('path');
const webpack = require('webpack');
const AllowMutateEsmExports = require('./AllowMutateEsmExportsPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');
const entryPoints = require('./entry-points-plugins.json');

const distDir = path.resolve(__dirname, '../dist');
const pluginDir = path.resolve(__dirname, '../src/plugins');

module.exports = {
  mode: 'production',
  entry: entryPoints,
  output: {
    path: distDir,
    filename: '[name].ol.min.js',
  },
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js',
      templates: path.resolve(__dirname, '../src/templates'),
      assets: path.resolve(__dirname, '../src/facade/assets'),
      facade: path.resolve(__dirname, '../src/facade'),
      impl: path.resolve(__dirname, '../src/impl/ol/js'),
      configuration: path.resolve(__dirname, '../test/configuration_filtered'),
      'impl-assets': path.resolve(__dirname, '../src/impl/ol/assets'),
      plugins: pluginDir,
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.css', '.hbs', '.html'],
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
          },
        },
      },
      {
        test: [/\.hbs$/, /\.html$/],
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
        ],
        exclude: [/node_modules/],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        exclude: /node_modules/,
        loader: 'url-loader?name=fonts/[name].[ext]',
      }],
  },
  plugins: [
    new AllowMutateEsmExports(),
    new CopywebpackPlugin([{
      from: path.join(pluginDir, '**', 'api.json'),
      to: path.join(distDir, 'plugins/[1]/api.json'),
      test: /([^/]+)\/api\.json/,
    }]),
    new CopywebpackPlugin([{
      from: path.join(pluginDir, '**', '.mplugin'),
      to: path.join(distDir, 'plugins/[1]/.mplugin'),
      test: /([^/]+)\/\.mplugin$/,
    }]),
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
    }),
  ],
};
