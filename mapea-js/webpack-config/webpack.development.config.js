const path = require('path');
const fse = require('fs-extra');
const webpack = require('webpack');
const argv = require('yargs').argv;

const testName = argv.name;
const coremin = argv['core-min'];
if (testName === undefined) {
  const error = new Error('Test name is undefined. Use: npm start -- --name=<test-name>');
  throw error;
}
const testPath = path.resolve(__dirname, '..', 'test', 'development', `${testName}.js`);
const testHTMLPath = path.resolve(__dirname, '..', 'test', 'development', `${testName}.html`);

try {
  fse.statSync(testPath).isFile();
} catch (e) {
  const error = new Error('Javascript test does not exist. Be sure to write the test name correctly.');
  throw error;
}

try {
  fse.statSync(testHTMLPath).isFile();
} catch (e) {
  const error = new Error('HTML test does not exist. Be sure to name the html test as the js test.');
  throw error;
}

const config = path.resolve(__dirname, '../test/configuration_filtered.js');
const entrypoint = {};
entrypoint[testName] = testPath;
entrypoint.config = config;

if (coremin) {
  entrypoint['mapea.ol.min'] = path.resolve(__dirname, '..', 'dist', 'js', 'mapea.ol.min.js');
}

module.exports = {
  mode: 'development',
  entry: entrypoint,
  output: {
    filename: '[name].js',
  },
  node: {
    fs: 'empty',
  },
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js',
      templates: path.resolve(__dirname, '../src/templates'),
      assets: path.resolve(__dirname, '../src/facade/assets'),
      M: path.resolve(__dirname, '../src/facade/js'),
      impl: path.resolve(__dirname, '../src/impl/ol/js'),
      configuration: path.resolve(__dirname, '../test/configuration_filtered'),
      'impl-assets': path.resolve(__dirname, '../src/impl/ol/assets'),
      plugins: path.resolve(__dirname, '../src/plugins'),
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.css', '.hbs', '.html', '.jpg'],
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: {
          loader: path.resolve(__dirname, 'mutate-loader'),
          options: {
            mode: 'dev'
          }
        },
        include: /node_modules\/ol\/*/,
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
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
        exclude: [/node_modules/, /lib/, /test/, /dist/],
      },
      {
        test: /\.js$/,
        loader: path.resolve(__dirname, 'expose-entry-loader'),
        exclude: [/node_modules/, /lib/, /dist/],
      },
      {
        test: [/\.hbs$/, /\.html$/],
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        exclude: [/node_modules\/(?!ol)/],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|jpg)$/,
        exclude: /node_modules/,
        loader: 'url-loader?name=fonts/[name].[ext]',
      }
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    open: true,
    openPage: `test/development/${testName}.html`,
    watchOptions: {
      poll: 1000,
    },
  },
  devtool: 'eval-source-map',
};
