const hbs = require('handlebars');
const { argv } = require('yargs');
const fs = require('fs-extra');
const path = require('path');

const testName = argv.name;
const { force } = argv;
let { mode } = argv;

if (!mode) {
  console.info('INFO: Parameter --mode is not defined. Mode \'development\' is used by default.\n');
  mode = 'development';
}

/**
 * @const
 * @type {object}
 */
const errorMessages = {
  undefinedMode: (modeTest, validValues) => `${modeTest} is not valid mode. Valid mode values: ${validValues.join(' | ')}`,
  undefinedName: 'Test name is not defined. Use: npm run generate-test -- --name=<name-of-test>',
  existFile: 'Test already exists. Use another name or use --force flag to overwrite',
};

/**
 * @const paths
 * @type {object}
 */
const paths = {
  development: {
    destFolder: path.resolve(__dirname, '..', 'test', mode),
    html: path.resolve(__dirname, 'templates-test', mode, 'html.hbs'),
    js: path.resolve(__dirname, 'templates-test', mode, 'source.js'),
  },
  production: {
    destFolder: path.resolve(__dirname, '..', 'test', mode),
    html: path.resolve(__dirname, 'templates-test', mode, 'html.hbs'),
    js: path.resolve(__dirname, 'templates-test', mode, 'source.js'),
  },
};

/**
 * @function
 */
const checkUserParamenters = (validObject, modeTest) => {
  const validValues = Object.keys(validObject);
  const isValid = validValues.includes(modeTest);
  if (isValid === false) {
    throw new Error(errorMessages.undefinedMode(modeTest, validValues));
  }
};

/**
 * @function
 */
const checkIfExists = (testname, conf) => {
  const destPathJS = path.resolve(conf.destFolder, `${testname}.js`);
  const destPathHTML = path.resolve(conf.destFolder, `${testname}.html`);
  return fs.existsSync(destPathJS) || fs.existsSync(destPathHTML);
};

/**
 * @function
 */
const generateHTML = (testname, conf) => {
  const destPath = path.resolve(conf.destFolder, `${testname}.html`);
  const html = fs.readFileSync(conf.html, 'utf8');
  const compileCB = hbs.compile(html);
  const htmlCompiled = compileCB({
    testname,
  });
  fs.writeFileSync(destPath, htmlCompiled);
  console.info(`SUCCESS: ${testname}.html file was created in ${destPath}.\n`);
};

/**
 * @function
 */
const generateJS = (testname, conf) => {
  const destPath = path.resolve(conf.destFolder, `${testname}.js`);
  fs.copySync(conf.js, `${destPath}`);
  console.info(`SUCCESS: ${testname}.js file was created in ${destPath}.\n`);
};

/**
 * Main function
 * @function
 * @param {string} testName - Name of test to generate
 * @param {string} mode - Mode of test (development | production | plugins)
 */
const main = (pathsObject, testname, testMode) => {
  checkUserParamenters(pathsObject, testMode);
  if (!testname) {
    throw new Error(errorMessages.undefinedName);
  }
  if (checkIfExists(testName, paths[testMode]) && !force) {
    throw new Error(errorMessages.existFile);
  }
  generateHTML(testname, paths[testMode]);
  generateJS(testname, paths[testMode]);
};

// executes the main function
main(paths, testName, mode);
