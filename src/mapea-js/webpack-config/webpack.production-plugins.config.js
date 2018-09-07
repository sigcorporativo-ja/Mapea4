const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');
const entryPoints = require('./entry-points-plugins.json');

const distDir = path.resolve(__dirname, '..', 'dist');
const pluginDir = path.resolve(__dirname, '..', 'src', 'plugins');

module.exports = {
  mode: 'production',
  entry: entryPoints,
  output: {
    path: distDir,
    filename: '[name].ol.min.js',
  },
  resolve: {
    alias: {
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
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: [/node_modules/],
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
  optimization: {
    noEmitOnErrors: true,
  },
  plugins: [
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
