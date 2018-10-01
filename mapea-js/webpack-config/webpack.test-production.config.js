const path = require('path');
const webpack = require('webpack');
const fse = require('fs-extra');
const argv = require('yargs').argv;

const testName = argv.name;
if (testName === undefined) {
  const error = new Error('Test name is undefined. Use: npm debug:build -- --name=<test-name>');
  throw error;
}
const testPath = path.resolve(__dirname, '..', 'test', 'production', `${testName}.js`);
const testHTMLPath = path.resolve(__dirname, '..', 'test', 'production', `${testName}.html`);

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

const plugins = [new webpack.HotModuleReplacementPlugin()];

module.exports = {
  mode: 'development',
  entry: {
    'test-preprod': testPath,
  },
  output: {
    filename: '[name].js',
  },
  plugins: [...plugins],
  devServer: {
    hot: true,
    open: true,
    openPage: `test/production/${testName}.html`,
    watchOptions: {
      poll: 1000,
    },
  },
  devtool: 'source-map',
};
