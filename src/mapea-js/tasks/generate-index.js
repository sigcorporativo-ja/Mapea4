/**
 * This script is an adaptation of the jsdoc automation script of openlayers.
 * @see https://github.com/openlayers/openlayers/blob/master/tasks/generate-index.js
 */
const fse = require('fs-extra');
const path = require('path');
const generateInfo = require('./generate-info');

const OL_MIN_FILE = '../externs/ol-v5.1.3.js';

/**
 * Read the symbols from info file.
 * @return {Promise<Array>} Resolves with an array of symbol objects.
 */
async function getSymbols() {
  const info = await generateInfo();
  return info.symbols.filter(symbol => symbol.kind !== 'member');
}

const srcPath = path.posix.resolve(__dirname, '../src').replace(/\\/g, '/');

function getPath(name) {
  const fullPath = require.resolve(path.resolve('src', name));
  return './' + path.posix.relative(srcPath, fullPath.replace(/\\/g, '/'));
}

/**
 * Generate a list of imports.
 * @param {Array.<Object>} symbols List of symbols.
 * @return {Promise<Array>} A list of imports sorted by export name.
 */
function getImports(symbols) {
  // PATCHED
  const imports = {};
  symbols.forEach((symbol) => {
    const symbolName = symbol.name.replace(/_/g, '');
    const defaultExport = symbolName.split('~');
    const namedExport = symbolName.split('.');
    if (defaultExport.length > 1) {
      // patch, original:
      const from = symbol.path.replace(/.*facade/, './facade');
      const importName = defaultExport[0].replace(/_\D*_/, '').replace(/[./]+/g, '$').replace(/^module:/, '$');
      const defaultImport = `import ${importName} from '${getPath(from)}';`;
      imports[defaultImport] = true;
    }
    else if (namedExport.length > 1) {
      const from = symbol.path.replace(/.*facade/, './facade');
      const importName = namedExport[0].replace(/[./]+/g, '_').replace(/^module:/, '_');
      const namedImport = `import * as ${importName} from '${getPath(from)}';`;
      imports[namedImport] = true;
    }
  });
  return Object.keys(imports).sort();
}


/**
 * Generate code to export a named symbol.
 * @param {string} name Symbol name.
 * @param {Object.<string, string>} namespaces Already defined namespaces.
 * @return {string} Export code.
 */
function formatSymbolExport(name, namespaces) {
  const parts = name.replace(/\/\_\D*\_/, "").split('~');
  const isNamed = parts[0].indexOf('.') !== -1;
  const nsParts = parts[0].replace(/^module\:/, '').split(/[\/\.]/);
  const last = nsParts.length - 1;
  const importName = isNamed ?
    '_' + nsParts.slice(0, last).join('_') + '.' + nsParts[last] :
    '$' + nsParts.join('$');
  let line = nsParts[0];
  for (let i = 1, ii = nsParts.length; i < ii; ++i) {
    line += `.${nsParts[i]}`;
    namespaces[line] = (line in namespaces ? namespaces[line] : true) && i < ii - 1;
  }
  line += ` = ${importName};`;
  return line;
}


/**
 * Generate export code given a list symbol names.
 * @param {Array.<Object>} symbols List of symbols.
 * @param {Object.<string, string>} namespaces Already defined namespaces.
 * @param {Array.<string>} imports List of all imports.
 * @return {string} Export code.
 */
function generateExports(symbols, namespaces, imports) {
  let blocks = [];
  symbols.forEach((symbol) => {
    const name = symbol.name;
    if (name.indexOf('#') === -1) {
      const block = formatSymbolExport(name, namespaces);
      if (block !== blocks[blocks.length - 1]) {
        blocks.push(block);
      }
    }
  });
  const nsdefs = [];
  const ns = Object.keys(namespaces).sort();
  for (let i = 0, ii = ns.length; i < ii; ++i) {
    if (namespaces[ns[i]]) {
      nsdefs.push(`${ns[i]} = {};`);
    }
  }
  blocks = imports.concat(['const M = window[\'M\'] = {};'].concat(nsdefs.concat(blocks).sort()));
  blocks.push('');
  return blocks.join('\n');
}

/**
 * PATCH
 * Concat openlayers minified code to entry point of Mapea
 * @param {string} inputFilePath - Input file path
 * @param {string} outputFilePath - output file path
 */
async function concatOL(inputFilePath, outputFilePath) {
  const olContent = fse.readFileSync(path.resolve(__dirname, inputFilePath), 'utf8');
  fse.writeFileSync(path.resolve(__dirname, outputFilePath), olContent, {
    flag: 'a',
  });
}

/**
 * Generate the exports code.
 * @return {Promise<string>} Resolves with the exports code.
 */
async function main() {
  const symbols = await getSymbols();
  const imports = await getImports(symbols);
  return generateExports(symbols, {}, imports);
}


/**
 * If running this module directly, read the config file, call the main
 * function, and write the output file.
 */
if (require.main === module) {
  main().then(async (code) => {
    const filepath = path.join(__dirname, '..', 'src', 'index.js');
    fse.outputFileSync(filepath, code);
    concatOL(OL_MIN_FILE, '../src/index.js');
  }).then(async () => {}).catch((err) => {
    process.stderr.write(`${err.message}\n`, () => process.exit(1));
  });
}


/**
 * Export main function.
 */
module.exports = main;
