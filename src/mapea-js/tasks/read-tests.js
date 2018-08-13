const fs = require('fs-extra');
const path = require('path');

const pathBrowserTest = path.resolve(__dirname, '../test');
const pathEntrypoint = path.resolve(__dirname, '../webpack-config/entry-points-test.json');
const entrypointFile = {};

const jsRegexp = /\.js$/;
let tests = fs.readdirSync(pathBrowserTest);
tests = tests.filter(filename => jsRegexp.test(filename));
tests.forEach((filename) => {
  const name = filename.split(".")[0];
  entrypointFile[name] = path.resolve(__dirname, '../test', filename);
});

if (tests.length > 0) {
  const content = JSON.stringify(entrypointFile);
  fs.writeFileSync(pathEntrypoint, content, 'utf8');
}
