var path = require('path');
var fs = require('fs-extra');
var Promise = require('promise');

var Utils = require('./task-utilities');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..', '..');

var PLUGIN_ROOT = null;

/**
 * Constructor for PluginTask class
 * @param folderName the name of the plugin folder
 */
var PluginTask = function (params) {
   PLUGIN_ROOT = fs.realpathSync(params.dir);

   this.name = params.name;
   this.realDir = path.join(PLUGIN_ROOT, this.name);
   this.relativeDir = path.join(params.dir, this.name);
   this.targetFolder = null;
};

/**
 * TODO
 */
PluginTask.prototype.createTargetFolder = function (outputDir) {
   this.targetFolder = path.join(ROOT, outputDir, this.name);
   fs.ensureDirSync(this.targetFolder);
};

/**
 * TODO
 */
PluginTask.prototype.getTargetFolder = function () {
   return this.targetFolder;
};

/**
 * TODO
 */
PluginTask.prototype.getImpls = function (impls) {
   var pluginImpls = [];

   var implFolder = path.join(this.realDir, 'impl');
   var pluginImplFolders = Utils.getFolders(implFolder);
   for (var i = 0, ilen = pluginImplFolders.length; i < ilen; i++) {
      var pluginImplFolder = pluginImplFolders[i];
      for (var j = 0, jlen = impls.length; j < jlen; j++) {
         var impl = impls[j];
         if (pluginImplFolder === impl.id) {
            pluginImpls.push(impl);
            break;
         }
      }
   }

   return pluginImpls;
};

/**
 * TODO
 */
PluginTask.prototype.getFacadeDir = function () {
   var facadeDir = path.join(this.relativeDir, 'facade', 'js');
   return facadeDir;
};

/**
 * TODO
 */
PluginTask.prototype.getImplDir = function (implAlias) {
   var implDir = path.join(this.relativeDir, 'impl', implAlias, 'js');
   return implDir;
};

/**
 * TODO
 */
PluginTask.prototype.getFacadeLib = function () {
   var facadeLib = path.join(this.getFacadeDir(), '**', '*.js');
   return facadeLib;
};

/**
 * TODO
 */
PluginTask.prototype.getImplLib = function (implAlias) {
   var implLib = path.join(this.getImplDir(implAlias), '**', '*.js');
   return implLib;
};

/**
 * TODO
 */
PluginTask.prototype.getExterns = function () {
   return [];
};

/**
 * Export main function.
 */
module.exports = PluginTask;