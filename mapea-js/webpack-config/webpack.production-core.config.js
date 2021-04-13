const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');
const argv = require('yargs').argv;

const PJSON_PATH = path.resolve(__dirname, '..', 'package.json');
const pjson = require(PJSON_PATH);

const sourcemap = argv['source-map'];

module.exports = {
  mode: 'production',
  node: {
    fs: 'empty',
  },
  entry: {
    [`mapea-${pjson.version}.ol.min`]: path.resolve(__dirname, '..', 'src', 'index.js'),
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
      impl: path.resolve(__dirname, '..', 'src', 'impl', 'ol'),
      'package.json': path.resolve(__dirname, '..', 'package.json'),
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.css', '.hbs', '.html', '.jpg'],
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: {
          loader: path.resolve(__dirname, 'mutate-loader'),
          options: {
            mode: 'prod',
          }
        },
        include: /node_modules\/ol\/*/,
      }, {
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
        loader: MiniCssExtractPlugin.loader,
        exclude: /node_modules\/(?!ol)/,
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        exclude: [/node_modules\/(?!ol)/],

      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|jpg)$/,
        exclude: /node_modules/,
        loader: 'url-loader?name=fonts/[name].[ext]',
      }
    ],
  },
  optimization: {
    minimize: true,
    noEmitOnErrors: true,
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin({
        sourceMap: true,
        exclude: `filter/configuration-${pjson.version}.js`,
        extractComments: false,
        parallel: true,
      }),
    ],
  },
  plugins: [
    // new GenerateVersionPlugin({
    //   version: pjson.version,
    //   regex: /([A-Za-z]+)(\..*)/,
    // }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
    }),
    new CopywebpackPlugin({
      patterns: [{
        from: 'src/configuration.js',
        to: `filter/configuration-${pjson.version}.js`,
      }],
    }),
    new CopywebpackPlugin({
      patterns: [{
        from: 'src/facade/assets/img',
        to: 'assets/img',
      }],
    }),
    new CopywebpackPlugin({
      patterns: [{
        from: 'src/facade/assets/fonts',
        to: 'assets/fonts',
      }],
    }),
  ],
  devtool: 'source-map',
};
