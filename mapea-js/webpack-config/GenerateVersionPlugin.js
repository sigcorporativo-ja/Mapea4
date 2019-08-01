const pathmodule = require('path');
const fs = require('fs');
/**
 * Webpack plugin that allows overwrite functions definitions after import.
 * This plugin is directly related to the class src/impl/ol/js/patches.js, which is used to
 * overwrite functions of openlayers that we can not access by inheritance of classes.
 * @class AllowMutateEsmExports
 */
class GenerateVersionPlugin {
  constructor(opt) {
    this.version = opt.version;
    this.regex = opt.regex;
    this.fileName = opt.fileName;
    this.aliasRoot = opt.aliasRoot;
    this.override = opt.override;
  }
  /**
   * This function apply the logic plugin.
   * @function
   */
  apply(compiler) {
    compiler.hooks.done.tap('GenerateVersionPlugin', (stats) => {
      const { path } = stats.compilation.options.output;
      stats.compilation.chunks.forEach((chunk, index) => {
        chunk.files.forEach((file) => {
          const basename = pathmodule.basename(file);
          const version = this.version || this.geExecuteCB(index, stats);
          let replacePath;
          if (this.regex instanceof RegExp) {
            replacePath = basename.replace(this.regex, `$1-${version}$2`);
          }
          const realPath = pathmodule.resolve(path, file);
          const newPath = pathmodule.join(pathmodule.dirname(realPath), replacePath);
          if (this.override === true) {
            fs.renameSync(realPath, newPath);
          } else {
            fs.copyFileSync(realPath, newPath);
          }
        });
      });
    });
  }

  /**
   * @function
   */
  geExecuteCB(index, stats) {
    console.log(1, index);
    const entry = Object.keys(stats.compilation.options.entry)[index];
    const name = entry.split('/').slice(-1)[0];
    const context = stats.compilation.options.resolve.alias[this.aliasRoot];
    const absolutePath = pathmodule.resolve(context, name, this.fileName);
    console.log(2, absolutePath);
    const version = JSON.parse(fs.readFileSync(absolutePath)).version;
    console.log(3, version);
    return version;
  }
}

module.exports = GenerateVersionPlugin;
