const path = require('path');
const fse = require('fs-extra');

const SRC_PATH = path.resolve(__dirname, '..', 'src');
const PUBLISH_PATH = path.resolve(__dirname, '..', 'publish');

const FOLDER = [
  { src: path.resolve(SRC_PATH, 'facade', 'js'), dest: PUBLISH_PATH },
  { src: path.resolve(SRC_PATH, 'facade', 'assets'), dest: path.resolve(PUBLISH_PATH, 'assets') },
  { src: path.resolve(SRC_PATH, 'impl', 'ol'), dest: path.resolve(PUBLISH_PATH, 'impl') },
  { src: path.resolve(SRC_PATH, 'templates'), dest: path.resolve(PUBLISH_PATH, 'templates') },
];

const FILES = [
  { src: path.resolve(__dirname, '..', 'package.json'), dest: path.resolve(PUBLISH_PATH, 'package.json') },
  { src: path.resolve(__dirname, '..', 'LICENSE'), dest: path.resolve(PUBLISH_PATH, 'LICENSE') },
  { src: path.resolve(__dirname, '..', 'README.md'), dest: path.resolve(PUBLISH_PATH, 'README.md') },
];

/**
 * @param {number} level
 */
const replacePath = (level) => {
  let route = './';
  if (level > 0) {
    route = '../'.repeat(level);
  }
  return route;
};

/**
 *
 * @param {string} src
 * @param {string} dest
 */
const replaceImportsPath = (src, level) => {
  const regexps = [
    content => content.replace(/(import( \w* from )?) 'assets\/css(.*)'/g, `$1 '${replacePath(level)}assets/css$3'`),
    content => content.replace(/(import( \w* from)?) 'templates(.*)'/g, `$1 '${replacePath(level)}templates$3'`),
    content => content.replace(/(from) 'impl(.*)'/g, `$1 '${replacePath(level)}impl$2'`),
    content => content.replace(/(from) 'M\/(.*)'/g, `$1 '${replacePath(level)}$2'`),
    content => content.replace(/(from) 'package.json'/g, `$1 '${replacePath(level)}package.json'`),
    content => content.replace(/(import) 'impl(.*)'/g, `$1 '${replacePath(level)}impl$2'`),
    (content) => {
      let replaceContent = content;
      if (/M.config/g.test(content)) {
        const importStatement = `import config from '${replacePath(level)}configuration.js'`;
        replaceContent = replaceContent.replace(/M.config/g, 'config');
        replaceContent = `${importStatement};\n${replaceContent}`;
      }
      return replaceContent;
    },
  ];

  const content = fse.readFileSync(src, 'utf-8');
  const replaceContent = regexps.reduce((current, next) => next(current), content);
  fse.writeFileSync(src, replaceContent);
};

/**
 * Copy file from source to destination
 * @function
 * @param {string} src
 * @param {string} dest
 */
const copyFile = (src, dest) => {
  if (!fse.existsSync(dest)) {
    fse.copyFileSync(src, dest);
  }
};

/**
 * Copy folder from source to destination recursively
 * @function
 * @param {string} src
 * @param {string} dest
 */
const copyFolder = (src, dest, level = 0) => {
  const ls = fse.readdirSync(src);
  ls.forEach((name) => {
    const srcFile = path.resolve(src, name);
    if (fse.statSync(srcFile).isFile()) {
      const destFile = path.resolve(dest, name);
      copyFile(srcFile, destFile);
    }
    if (fse.statSync(srcFile).isDirectory()) {
      const newSrc = path.resolve(dest, name);
      if (!fse.existsSync(newSrc)) {
        fse.mkdirSync(newSrc);
        const newLevel = level + 1;
        copyFolder(srcFile, newSrc, newLevel);
      }
    }
  });
};

/**
 *
 */
const replaceAllImportsPath = (src, level = 0) => {
  const ls = fse.readdirSync(src);
  ls.forEach((name) => {
    const srcFile = path.resolve(src, name);
    if (fse.statSync(srcFile).isFile()) {
      replaceImportsPath(srcFile, level);
    }
    if (fse.statSync(srcFile).isDirectory()) {
      const newLevel = level + 1;
      replaceAllImportsPath(srcFile, newLevel);
    }
  });
};

/**
 * Main function
 * @function
 */
const main = () => {
  if (fse.existsSync(PUBLISH_PATH)) {
    fse.removeSync(PUBLISH_PATH);
  }
  FOLDER.forEach((opt) => {
    const { src, dest } = opt;

    fse.ensureDirSync(dest);
    copyFolder(src, dest);
  });

  FILES.forEach((file) => {
    copyFile(file.src, file.dest);
  });

  replaceAllImportsPath(PUBLISH_PATH);

  // Prepare package.json
  const pkgPath = path.resolve(PUBLISH_PATH, 'package.json');
  const pkg = require(pkgPath);
  delete pkg.devDependencies;
  delete pkg.scripts;
  fse.writeFileSync(pkgPath, JSON.stringify(pkg));
  fse.copyFileSync(path.resolve(__dirname, 'configuration-npm.js'), path.resolve(PUBLISH_PATH, 'configuration.js'));
};

main();
