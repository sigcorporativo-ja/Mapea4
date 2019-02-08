const path = require('path');
const GenerateVersionPlugin = require('./GenerateVersionPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');
const argv = require('yargs').argv;

const PJSON_PATH = path.resolve(__dirname, '..', 'package.json');
const pjson = require(PJSON_PATH);

const sourcemap = argv['source-map'];

module.exports = {
  mode: 'production',
  entry: {
    'mapea.ol.min': path.resolve(__dirname, '..', 'src', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'js/[name].js',
  },
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js',
      templates: path.resolve(__dirname, '..', 'src', 'templates'),
      assets: path.resolve(__dirname, '..', 'src', 'facade', 'assets'),
      M: path.resolve(__dirname, '../src/facade/js'),
      impl: path.resolve(__dirname, '..', 'src', 'impl', 'ol', 'js'),
      'impl-assets': path.resolve(__dirname, '..', 'src', 'impl', 'ol', 'assets'),
      patches: path.resolve(__dirname, '../src/impl/ol/js/patches.js'),
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
        exclude: /node_modules/,
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
    new GenerateVersionPlugin({
      version: pjson.version,
      regex: /([A-Za-z]+)(\..*)/,
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
    }),
    new CopywebpackPlugin([{
      from: 'src/configuration.js',
      to: 'js/configuration.js',
    }]),
    new CopywebpackPlugin([{
      from: 'src/configuration.js',
      to: `js/configuration-${pjson.version}.js`,
    }]),
    new CopywebpackPlugin([{
      from: 'src/facade/assets/img',
      to: 'assets/img',
    }]),
  ],
  devtool: 'source-map',
};
