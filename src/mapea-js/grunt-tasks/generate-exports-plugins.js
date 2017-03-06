var fs = require('fs-extra');
var path = require('path');

var generateExport = require('./utilities/generate-exports');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..');

module.exports = function (grunt) {
   grunt.registerMultiTask('generate-exports-plugins', 'use jsdoc to generate exports file for plugins', function () {
      var done = this.async();

      var dir = this.data.dir;
      var outputDir = this.data.outputDir;

      // get the plugin to compile
      var pluginSymbolFiles = [];
      var nameOption = grunt.option('name');
      var pluginsToCompile = [];
      if ((nameOption != null) && (nameOption !== '*')) {
         pluginsToCompile = nameOption.split(',');
      }
      pluginSymbolFiles = getPluginSymbolFiles(dir, pluginsToCompile);

      var generateExportsPlugin = function (index, callback) {
         // base case
         if (pluginSymbolFiles.length === index) {
            callback(null);
         }
         // recursvie case
         else {
            var pluginSymbolFile = pluginSymbolFiles[index];

            // OUTPUT FILE
            var exportsFileName = path.basename(pluginSymbolFile, '.json').concat('.js');
            var outputFile = path.join(outputDir, exportsFileName);

            generateExport(pluginSymbolFile, outputFile, function (err) {
               if (err != null) {
                  grunt.log.error(err);
               }
               // next
               generateExportsPlugin(index + 1, callback);
            });
         }
      };
      generateExportsPlugin(0, function (err) {
         if (err != null) {
            grunt.log.error(err);
            grunt.log.error('Generation exports failed');
         }
         else {
            grunt.log.ok('Generation exports succeed');
         }
         done();
         return;
      });
   });

   function getPluginSymbolFiles(dir, pluginNames) {
      var pluginSymbolFiles = [];
      var files = fs.readdirSync(dir);
      for (var i = 0, ilen = files.length; i < ilen; i++) {
         var fileName = path.basename(files[i]);
         var hasPlugin = (pluginNames.length === 0);
         for (var e = 0, elen = pluginNames.length;
            (e < elen) && !hasPlugin; e++) {
            var pluginName = pluginNames[e];
            if (fileName.indexOf(pluginName) !== -1) {
               hasPlugin = true;
            }
         }
         if (hasPlugin === true) {
            var pluginSymbolFile = path.join(dir, fileName);
            pluginSymbolFiles.push(pluginSymbolFile);
         }
      }
      return pluginSymbolFiles;
   }
};