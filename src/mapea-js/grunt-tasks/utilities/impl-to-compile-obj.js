var path = require('path');

var Utils = require('./task-utilities');
var mapeaCompiler = require('./mapea-compiler');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..', '..');

/**
 * Constructor for PluginTask class
 * @param folderName the name of the plugin folder
 */
var ImplToCompile = function (id, compilerOptions) {
   this.id = id;
   this.dir = [];
   this.lib = [];
   this.externFile = null;
   this.jsdoc = null;
   this.infoFile = null;
   this.compilerOptions = Utils.clone(compilerOptions);
   if (this.compilerOptions.compile.externs == null) {
      this.compilerOptions.compile.externs = [];
   }
};

/**
 * TODO
 */
ImplToCompile.prototype.setJSDoc = function (jsdoc) {
   if (jsdoc != null) {
      this.jsdoc = Utils.clone(jsdoc);
   }
};

/**
 * TODO
 */
ImplToCompile.prototype.addDir = function (dir) {
   if (dir != null) {
      if (Utils.isArray(dir)) {
         this.dir = this.dir.concat(dir);
      }
      else {
         this.dir.push(dir);
      }
   }
};

/**
 * TODO
 */
ImplToCompile.prototype.addLib = function (lib) {
   if (lib != null) {
      if (Utils.isArray(lib)) {
         this.lib = this.lib.concat(lib);
      }
      else {
         this.lib.push(lib);
      }
   }
};

/**
 * TODO
 */
ImplToCompile.prototype.addExterns = function (externs) {
   if (externs != null) {
      if (Utils.isArray(externs)) {
         this.compilerOptions.compile.externs = this.compilerOptions.compile.externs.concat(externs);
      }
      else {
         this.compilerOptions.compile.externs.push(externs);
      }
   }
};

/**
 * TODO
 */
ImplToCompile.prototype.addCompilerOptions = function (compilerOptions) {
   if (compilerOptions != null) {
      var newCompilerOptions = Utils.clone(compilerOptions);
      Utils.extend(newCompilerOptions, this.compilerOptions);
      this.compilerOptions = newCompilerOptions;
   }
};

/**
 * TODO
 */
ImplToCompile.prototype.setOutputWrapper = function (outputWrapper) {
   if (outputWrapper != null) {
      this.compilerOptions.compile.output_wrapper = outputWrapper;
   }
};

/**
 * TODO
 */
ImplToCompile.prototype.setExternFile = function (externFile) {
   if (externFile != null) {
      this.externFile = externFile;
   }
};

/**
 * TODO
 */
ImplToCompile.prototype.setInfoFile = function (infoFile) {
   if (infoFile != null) {
      this.infoFile = infoFile;
   }
};

/**
 * TODO
 */
ImplToCompile.prototype.compile = function (outputFile) {
   return mapeaCompiler(this.infoFile, this.jsdoc, this.dir, this.lib, this.externFile, this.compilerOptions, outputFile);
};

/**
 * Export main function.
 */
module.exports = ImplToCompile;