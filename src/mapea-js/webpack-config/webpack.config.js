const path = require('path');
const webpack = require('webpack');
const entrypoints = require('./entry-points-test.json');
const AllowMutateEsmExports = require('./AllowMutateEsmExportsPlugin');

const distPath = path.resolve(__dirname, '../dist/core/js');
const config = path.resolve(__dirname, '../test/configuration_filtered.js');
entrypoints.config = config;
const productionEntryPoint = path.resolve(__dirname, '../src/index.js');
const env = process.env.NODE_ENV || 'development';
const plugins = [new AllowMutateEsmExports()];
if (env === 'development') {
  const HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();
  plugins.push(HotModuleReplacementPlugin);
}

module.exports = {
  mode: env,
  entry: env === 'development' ? entrypoints : { 'mapea.ol.min': productionEntryPoint },
  output: {
    // options related to how webpack emits results
    path: distPath, // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: '[name].js', // string
    // the filename template for entry chunks
    // publicPath: "/assets", // string
    // the url to the output directory resolved relative to the HTML page
    // library: "M", // string,
    // the name of the exported library
    // libraryTarget: "umd", // universal module definition
    // the type of the exported library
    /* Advanced output configuration (click to show) */
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
      plugins: path.resolve(__dirname, '../src/plugins'),
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
      // {
      //   test: /\.js$/,
      //   loader: 'eslint-loader',
      //   exclude: [/node_modules/, /lib/, /test/],
      // },
      {
        test: [/\.hbs$/, /\.html$/],
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        exclude: [/node_modules/],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        exclude: /node_modules/,
        loader: 'url-loader?name=fonts/[name].[ext]',
      }],
  },
  plugins: [...plugins],
  devServer: {
    hot: true,
    open: true,
    openPage: '/test/development',
    watchOptions: {
      poll: 1000,
    },
  },
  devtool: 'source-map',
};
