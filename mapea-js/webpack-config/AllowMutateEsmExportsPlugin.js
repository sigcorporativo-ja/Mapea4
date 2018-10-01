/**
 * Webpack plugin that allows overwrite functions definitions after import.
 * This plugin is directly related to the class src/impl/ol/js/patches.js, which is used to
 * overwrite functions of openlayers that we can not access by inheritance of classes.
 * @class AllowMutateEsmExports
 */
class AllowMutateEsmExports {
  /**
   * This function apply the logic plugin.
   * @function
   */
  apply(compiler) {
    compiler.hooks.compilation.tap('AllowMutateEsmExports', (compilation) => {
      compilation.mainTemplate.hooks.requireExtensions.tap('AllowMutateEsmExports', (source) => {
        source = source.replace('get: getter', 'get: getter, writable: true');
      });
    });
  }
}

module.exports = AllowMutateEsmExports;
