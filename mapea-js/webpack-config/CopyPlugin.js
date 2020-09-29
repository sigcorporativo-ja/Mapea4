const pathmodule = require('path');
const fse = require('fs-extra');
/**
 * Webpack plugin that copy static files to dist folder.
 * @class CopyPlugin
 */
class CopyAPIPlugin {
  constructor(opt) {
    this.opt = opt;
  }

  /**
   * This function apply the logic plugin.
   * @function
   */
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('Copy Plugin', (compilation) => {
      compiler.hooks.done.tap('copy-custom-webpack-plugin', (callback) => {
        this.getNames(compilation).then((names) => {
          Promise.all(this.copyAPI(names, compilation)).then(() => {
            return null;
          }).catch((err) => {
            console.error(err);
          });
        });
      });
    });
  }


  /**
   * @function
   */
  getNames(comp) {
    const pluginsPath = comp.options.resolve.alias.plugins;
    return new Promise((resolve, reject) => {
      fse.readdir(pluginsPath, (err, names) => {
        if (err) {
          reject(err);
        }
        resolve(names);
      });
    });
  }

  /**
   * @function
   */
  copyAPI(names, compilation) {
    return names.map((name) => {
      return new Promise((resolve, reject) => {
        const output = pathmodule.join(compilation.outputOptions.path, 'plugins', name, 'api.json');
        const source = pathmodule.join(compilation.options.resolve.alias.plugins, name, 'api.json');
        fse.copyFile(source, output, (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    });
  }
}
module.exports = CopyAPIPlugin;
