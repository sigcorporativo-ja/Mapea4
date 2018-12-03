/**
 * This script is an adaptation of the jsdoc automation script of openlayers.
 * @see https://github.com/openlayers/openlayers/blob/master/tasks/generate-index.js
 */
const fse = require('fs-extra');
const path = require('path');
const generateInfo = require('./generate-info');
const generateOLInfo = require('./generate-ol-info');

const EXTERNS_LIBRARIES = require('./externs-libraries.js');
const CUSTOM_NAMESPACES = require('./custom-namespaces');
/**
 * Read the symbols from info file.
 * @return {Promise<Array>} Resolves with an array of symbol objects.
 */
async function getSymbols() {
  const info = await generateInfo();
  return info.symbols.filter(symbol => symbol.kind !== 'member' && symbol.name.startsWith('module:'));
}

/**
 * Read the ol symbols from info file
 * @return {Promise<Array>}
 */
async function getOLSymbols() {
  const info = await generateOLInfo();
  return info.symbols.filter(symbol => symbol.name.startsWith('module:'));
}

const srcPath = path.posix.resolve(__dirname, '../src').replace(/\\/g, '/');

function getPath(name) {
  const fullPath = require.resolve(path.resolve('src', name)).replace(/\.js$/, '');
  return './' + path.posix.relative(srcPath, fullPath.replace(/\\/g, '/'));
}

function getOLPath(name) {
  return name.replace(/\.\//, '');
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
    } else if (namedExport.length > 1) {
      const from = symbol.path.replace(/.*facade/, './facade');
      const importName = `${namedExport[0].replace(/[./]+/g, '').replace(/^module:/, '')}Module`;
      const namedImport = `import * as ${importName} from '${getPath(from)}';`;
      imports[namedImport] = true;
    }
  });
  return Object.keys(imports).sort();
}

/**
 * Generate a list of imports.
 * @param {Array.<Object>} symbols List of symbols.
 * @return {Promise<Array>} A list of imports sorted by export name.
 */
function getOLImports(symbols) {
  const imports = {};
  symbols.forEach((symbol) => {
    const defaultExport = symbol.name.split('~');
    const namedExport = symbol.name.split('.');
    if (defaultExport.length > 1) {
      const from = defaultExport[0].replace(/^module:/, './');
      const importName = from.replace(/[./]+/g, '$');
      const defaultImport = `import ${importName} from '${getOLPath(from)}';`;
      imports[defaultImport] = true;
    } else if (namedExport.length > 1) {
      const from = namedExport[0].replace(/^module:/, './');
      const importName = `${from.replace(/[./]+/g, '').replace(/\.\//, 'module')}Module`;
      const namedImport = `import * as ${importName} from '${getOLPath(from)}';`;
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
  const parts = name.replace(/\/_\D*_/, '').split('~');
  const isNamed = parts[0].indexOf('.') !== -1;
  const nsParts = parts[0].replace(/^module:/, '').split(/[/.]/);
  const last = nsParts.length - 1;
  const importName = isNamed ?
    nsParts.slice(0, last).join('') + 'Module' + '.' + nsParts[last] :
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
  blocks = imports.concat(['const M = window[\'M\'] = {};\nconst ol = window[\'ol\'] = {}']
    .concat(nsdefs.concat(blocks).sort()));
  blocks.push('');
  return blocks.join('\n');
}

/**
 * PATCH
 * Concat externs minified libraries
 * @param {array<object>} libraries - Object array of libraries -> [{name, path}]
 * @param {string} outputFilePath - output file path
 */
async function includeExterns(libraries, outputFilePath) {
  libraries.forEach((library) => {
    const requireLine = `window['${library.name}'] = require('${library.path}');\n`;
    fse.writeFileSync(path.resolve(__dirname, outputFilePath), requireLine, {
      flag: 'a',
    });
  });
}

/**
 * Concat custom namespaces
 * @param {array<object>} libraries - Object array of libraries -> [{name, path}]
 * @param {string} outputFilePath - output file path
 */
async function includeCustomNamespaces(customNamespaces, outputFilePath) {
  customNamespaces.forEach((library) => {
    const requireLine = `${library.name} = ${library.object}`;
    fse.writeFileSync(path.resolve(__dirname, outputFilePath), requireLine, {
      flag: 'a',
    });
  });
}

/**
 * Generate the exports code.
 * @return {Promise<string>} Resolves with the exports code.
 */
async function main() {
  const symbols = await getSymbols();
  const imports = await getImports(symbols);
  const olSymbols = await getOLSymbols();
  imports.push('\n/* eslint-disable */\n');
  const olImports = await getOLImports(olSymbols);
  const totalSymbols = symbols.concat(olSymbols);
  const totalImports = imports.concat(olImports);
  return generateExports(totalSymbols, {}, totalImports);
}

/**
 * If running this module directly, read the config file, call the main
 * function, and write the output file.
 */
if (require.main === module) {
  main().then(async (code) => {
    const filepath = path.join(__dirname, '..', 'src', 'index.js');
    fse.outputFileSync(filepath, code);
    includeExterns(EXTERNS_LIBRARIES, '../src/index.js');
    includeCustomNamespaces(CUSTOM_NAMESPACES, '../src/index.js');
  }).then(async () => {}).catch((err) => {
    process.stderr.write(`${err.message}\n`, () => process.exit(1));
  });
}


/**
 * Export main function.
 */
module.exports = main;
