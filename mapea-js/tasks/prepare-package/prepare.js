const path = require('path');
const fse = require('fs-extra');
const exec = require('./generate-index');
const { create } = require('domain');
const SRC_PATH = path.resolve(__dirname, '..', '..', 'src');
const PUBLISH_PATH = path.resolve(__dirname, '..', '..', 'publish');

const FOLDER = [
  { src: path.resolve(SRC_PATH, 'facade', 'js'), dest: PUBLISH_PATH },
  { src: path.resolve(SRC_PATH, 'facade', 'assets'), dest: path.resolve(PUBLISH_PATH, 'assets') },
  { src: path.resolve(SRC_PATH, 'impl', 'ol'), dest: path.resolve(PUBLISH_PATH, 'impl') },
  { src: path.resolve(SRC_PATH, 'templates'), dest: path.resolve(PUBLISH_PATH, 'templates') },
  { src: path.resolve(SRC_PATH, 'plugins'), dest: path.resolve(PUBLISH_PATH, 'plugins') },
];

const FILES = [
  { src: path.resolve(__dirname, '..', '..', 'src', 'index.js'), dest: path.resolve(PUBLISH_PATH, 'index.js') },
  { src: path.resolve(__dirname, '..', '..', 'package.json'), dest: path.resolve(PUBLISH_PATH, 'package.json') },
  { src: path.resolve(__dirname, '..', '..', 'LICENSE'), dest: path.resolve(PUBLISH_PATH, 'LICENSE') },
  { src: path.resolve(__dirname, '..', '..', 'README.md'), dest: path.resolve(PUBLISH_PATH, 'README.md') },
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
        if (!src.endsWith('index.js')) {
          replaceContent = replaceContent.replace(/M.config/g, 'config');
          replaceContent = `${importStatement};\n${replaceContent}`;
        } else {
          replaceContent = replaceContent.replace(/MModule.config/g, 'config');
          replaceContent = `${importStatement};\n${replaceContent}`;
        }
      }
      return replaceContent;
    },
  ];

  const content = fse.readFileSync(src, 'utf-8');
  const replaceContent = regexps.reduce((current, next) => next(current), content);
  fse.writeFileSync(src, replaceContent);
};

/**
 *
 * @param {string} src
 * @param {string} dest
 */
const replacePluginsImportsPath = (src, level) => {
  const regexps = [
    content => `import {M} from '${replacePath(level)}index.js';\n` + content,
    content => `import {ol} from '${replacePath(level)}index.js';\n` + content,
  ];

  const content = fse.readFileSync(src, 'utf-8');
  const replaceContent = regexps.reduce((current, next) => next(current), content);
  fse.writeFileSync(src, replaceContent);
};

const createIndexPlugin = () => {
  const PLUGINS_DIR = path.resolve(PUBLISH_PATH, 'plugins');
  fse.readdirSync(PLUGINS_DIR).forEach((name) => {
    const indexPath = path.resolve(PLUGINS_DIR, name, 'index.js');
    const code = `import ${name} from './facade/js/${name}.js'\nexport default ${name};`;
    fse.writeFileSync(indexPath, code);
  });
};

/**
 * Copy file from source to destination
 * @function
 * @param {string} src
 * @param {string} dest
 */
const copyFile = (src, dest) => {
  if (!fse.existsSync(dest)) {
    if (src.match(/fonts\//)) {
      fse.createReadStream(src).pipe(fse.createWriteStream(dest));
    } else {
      fse.copyFileSync(src, dest);
    }
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
      if (!src.includes('/plugins')) {
        replaceImportsPath(srcFile, level);
      } else {
        if (srcFile.endsWith('.js')) {
          replacePluginsImportsPath(srcFile, level);
        }
      }
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
const main = async () => {
  await exec();
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

  createIndexPlugin();
  // Prepare package.json
  const pkgPath = path.resolve(PUBLISH_PATH, 'package.json');
  const pkg = require(pkgPath);
  delete pkg.devDependencies;
  delete pkg.scripts;
  fse.writeFileSync(pkgPath, JSON.stringify(pkg));
  fse.copyFileSync(path.resolve(__dirname, 'configuration-npm.js'), path.resolve(PUBLISH_PATH, 'configuration.js'));
};

main();
