const fs = require('fs-extra');
const path = require('path');

const inputPath = path.resolve(__dirname, '../src/plugins');
const jsonOutput = path.resolve(__dirname, '..', 'webpack-config', 'entry-points-plugins.json');

/**
 * @function
 */
const getClassName = (pathfile) => {
  const sourceCode = fs.readFileSync(pathfile, 'utf8');
  let match = sourceCode.match(/export default class ([A-Za-z]*)/);
  if (match === null) {
    match = sourceCode.match(/export default ([A-Za-z]*)/);
  }
  return match[0].split(' ').slice(-1)[0];
};

/**
 * @function
 */
const generateEntryPoints = (pluginspath) => {
  const entrypoints = [];
  fs.readdirSync(pluginspath).forEach((nameFolder) => {
    const entrypoint = {};
    entrypoint.path = path.resolve(__dirname, '..', 'src', `index-${nameFolder}.js`);
    entrypoint.from = path.join('plugins', nameFolder, 'facade/js', `${nameFolder}`);
    entrypoint.name = getClassName(path.resolve(__dirname, '..', 'src', `${entrypoint.from}.js`));
    entrypoint.webpackPath = path.join('dist', 'plugins', `${nameFolder}`, `${nameFolder}.ol.min`);
    entrypoints.push(entrypoint);
  });
  return entrypoints;
};

/**
 * @function
 * @param {object}
 */
const generateContent = (entry) => {
  const pluginNS = 'if (window.M.plugin == null) window.M.plugin = {};';
  const content = `import $${entry.name} from '${entry.from}';\n\n${pluginNS}\nwindow.M.plugin.${entry.name} = $${entry.name};\n`;
  return {
    path: entry.path,
    content,
  };
};

/**
 * @function
 * @param {Array<object>}
 */
const generateAllContent = (entries) => {
  return entries.map(entry => generateContent(entry));
};

/**
 * @function
 * @param {Array<object>}
 */
const main = (entries) => {
  entries.forEach((entry) => {
    fs.writeFileSync(entry.path, entry.content);
  });
};

const entrypoints = generateEntryPoints(inputPath);
const entries = generateAllContent(entrypoints);
main(entries);

const generateEntryPointFile = (entryPoints) => {
  const json = {};
  entryPoints.forEach((entry) => {
    json[entry.webpackPath] = entry.path;
  });
  return json;
};

const jsonEntry = JSON.stringify(generateEntryPointFile(entrypoints));
fs.writeFileSync(jsonOutput, jsonEntry);
