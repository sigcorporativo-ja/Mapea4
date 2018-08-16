const fs = require('fs-extra');
const path = require('path');

const inputPath = path.resolve(__dirname, '../src/plugins');
const outputFile = path.resolve(__dirname, '../webpack-config/entry-points-plugins.json');
const entrypointFile = {};

fs.readdirSync(inputPath).forEach((nameFolder) => {
  const pathName = path.resolve(__dirname, '../dist/plugins/', nameFolder);
  entrypointFile[pathName] = path.resolve(inputPath, nameFolder, 'facade/js', `${nameFolder}.js`);
});
const content = JSON.stringify(entrypointFile);
fs.writeFileSync(outputFile, content, 'utf8');
