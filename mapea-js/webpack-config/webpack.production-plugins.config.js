const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const GenerateVersionPlugin = require('./GenerateVersionPlugin');
const CopywebpackPlugin = require('./CopyPlugin');
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
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules\/(?!ol)|bower_components)/        
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
        loader: MiniCssExtractPlugin.loader,
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        exclude: /node_modules/,

      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|jpg)$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },      }
    ],
  },
  optimization: {
    noEmitOnErrors: true,
  },
  plugins: [
    new GenerateVersionPlugin({
      fileName: '.mplugin',
      regex: /([A-Za-z]+)(\..*)/,
      aliasRoot: 'plugins',
      override: true,
    }),
    new CopywebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
    }),
  ],
};
