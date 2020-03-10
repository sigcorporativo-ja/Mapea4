const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;

const inputPath = path.resolve(__dirname, '..', 'src', 'plugins-extern');

/**
 * @function
 */
const generateEntryPoints = (pluginspath) => {
  const entrypoints = [];
  fs.readdirSync(pluginspath).forEach((nameFolder) => {
    const props = {};
    props.pathFolder = path.resolve(pluginspath, nameFolder);
    props.name = nameFolder;
    entrypoints.push(props);
  });
  return entrypoints;
};

const installDeps = async (folder) => {
  if (!fs.existsSync(path.resolve(folder, 'node_modules'))) {
    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['install'], {
        cwd: folder,
        stdio: 'inherit',
      });

      child.on('error', (error) => {
        reject(new Error(error));
      });

      child.on('exit', (code) => {
        if (code) {
          reject(new Error(code));
          return;
        }
        resolve();
      });
    });
  }
};

const compilePlugin = async (folder) => {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'build'], {
      cwd: folder,
      stdio: 'inherit',
    });

    child.on('error', (error) => {
      reject(new Error(error));
    });

    child.on('exit', (code) => {
      if (code) {
        reject(new Error(code));
        return;
      }
      resolve();
    });
  });
};

/**
 * @function
 */
const copyPlugin = async (entry) => {
  const dist = path.resolve(entry.pathFolder, 'dist');
  const dirPlugins = path.resolve(__dirname, '..', 'dist', 'plugins', entry.name);
  fs.ensureDir(dirPlugins, () => {
    fs.copy(dist, dirPlugins);
  });
};

/**
 * @function
 * @param {Array<object>}
 */
const main = async (entries) => {
  if (entries.length > 0) {
    const entry = entries.pop();
    await installDeps(entry.pathFolder);
    compilePlugin(entry.pathFolder).then(async () => {
      await copyPlugin(entry);
      main(entries);
    }).catch((err) => {
      throw err;
    });
  }
};

if (fs.existsSync(inputPath)) {
  const entrypoints = generateEntryPoints(inputPath);
  main(entrypoints);
}
