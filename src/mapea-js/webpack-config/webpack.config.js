const path = require('path');
const webpack = require('webpack');
const entrypoints = require('./entry-points-test.json');

const env = process.env.NODE_ENV || 'development';
const plugins = [];
if (env === 'development') {
  const HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();
  plugins.push(HotModuleReplacementPlugin);
  entrypoints['ol.min'] = path.resolve(__dirname, '../lib/ol.js');
  entrypoints['chroma.min'] = path.resolve(__dirname, '../lib/chroma.min.js');
}

module.exports = {
  mode: env,
  entry: entrypoints,
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, 'dist/core/js'), // string
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
      templates: path.resolve(__dirname, 'src/templates'),
      assets: path.resolve(__dirname, 'src/facade/assets'),
      facade: path.resolve(__dirname, 'src/facade'),
      impl: path.resolve(__dirname, 'src/impl/ol/js'),
      configuration: path.resolve(__dirname, 'test/configuration_filtered'),
      'impl-assets': path.resolve(__dirname, 'src/impl/ol/assets'),
      plugins: path.resolve(__dirname, 'src/plugins'),
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.css', '.hbs', '.html'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-export-default-from'],
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
    watchOptions: {
      poll: 1000,
    },
  },
  devtool: 'source-map',
  externals: {
    ol: 'ol',
    leaflet: 'L',
  },
};
