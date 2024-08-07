const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const GenerateVersionPlugin = require('./GenerateVersionPlugin');
const CopywebpackPlugin = require('./CopyPlugin');
const entryPoints = require('./entry-points-plugins.json');

const distDir = path.resolve(__dirname, '..', 'dist');
const pluginDir = path.resolve(__dirname, '..', 'src', 'plugins');
const ESLintPlugin = require('eslint-webpack-plugin');


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
    fallback: {
      fs: false,
      path: false,
      crypto: false,
    },
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules\/(?!ol)|bower_components)/        
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
        type: 'asset/inline',
      },
    ],
  },
  optimization: {
    emitOnErrors: false,
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
    new ESLintPlugin({
      extensions: [`js`, `jsx`],
      // files: 'src/**/*',
      exclude: ['**/src/index.js', '**/node_modules/**', '/lib/', '/test/', '/dist/'],
    }),
  ],
};
