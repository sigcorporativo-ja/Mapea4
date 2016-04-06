var fs = require('fs-extra');
var path = require('path');

var Utils = require('./utilities/task-utilities');
var generateSymbols = require('./utilities/generate-symbols');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..');

module.exports = function (grunt) {
   grunt.registerMultiTask('generate-symbols-plugins', 'use jsdoc to generate symbols file for plugins', function () {
      var done = this.async();

      var dir = this.data.dir;
      var jsdoc = this.data.jsdoc;
      var outputDir = this.data.outputDir;

      // get the plugin to compile
      var pluginFolders = [];
      var pluginToCompile = grunt.option('name');
      if ((pluginToCompile == null) || (pluginToCompile === '*')) {
         pluginFolders = getPluginsFolder(dir);
      }
      else {
         pluginFolders = pluginFolders.concat(pluginToCompile.split(','));
      }

      var generateSymbolPluginImpl = function (index, pluginImpls, pluginFolder, callback) {
         // base case
         if (pluginImpls.length === index) {
            callback(null);
         }
         // recursvie case
         else {
            var pluginImpl = pluginImpls[index];

            // JS FILES DIRECTORY
            var jsDir = [
               path.join(dir, pluginFolder, 'facade', 'js'),
               path.join(dir, pluginFolder, 'impl', pluginImpl, 'js')
            ];

            // OUTPUT FILE
            var symbolsFileName = 'mapea-'.concat(pluginFolder).concat('-').concat(pluginImpl).concat('.json');
            var outputFile = path.join(outputDir, symbolsFileName);

            Utils.getJSFiles(jsDir, function (err, jsfiles) {
               if (err != null) {
                  grunt.log.error(err);
               }
               else {
                  generateSymbols(outputFile, jsdoc, jsfiles, function (err) {
                     if (err != null) {
                        grunt.log.error(err);
                     }
                     // next
                     generateSymbolPluginImpl(index + 1, pluginImpls, pluginFolder, callback);
                  });
               }
            });
         }
      };
      var generateSymbolPluginFacade = function (pluginFolder, callback) {
         // JS FILES DIRECTORY
         var jsDir = [path.join(dir, pluginFolder, 'facade', 'js')];

         // OUTPUT FILE
         var symbolsFileName = 'mapea-'.concat(pluginFolder).concat('.json');
         var outputFile = path.join(outputDir, symbolsFileName);

         Utils.getJSFiles(jsDir, function (err, jsfiles) {
            generateSymbols(outputFile, jsdoc, jsfiles, callback);
         });
      };

      var generateSymbolPlugin = function (index, callback) {
         // base case
         if (pluginFolders.length === index) {
            callback(null);
         }
         // recursvie case
         else {
            var pluginFolder = pluginFolders[index];
            var pluginImpls = getPluginImpls(pluginFolder, dir);

            if (pluginImpls.length === 0) {
               // if it has no implementations then generates just the facade symbols
               generateSymbolPluginFacade(pluginFolder, function (err) {
                  if (err != null) {
                     grunt.log.error(err);
                  }
                  // next
                  generateSymbolPlugin(index + 1, callback);
               });
            }
            else {
               // otherwise it compiles all implementations
               generateSymbolPluginImpl(0, pluginImpls, pluginFolder, function (err) {
                  if (err != null) {
                     grunt.log.error(err);
                  }
                  // next
                  generateSymbolPlugin(index + 1, callback);
               });
            }
         }
      };
      generateSymbolPlugin(0, function (err) {
         if (err != null) {
            grunt.log.error(err);
            grunt.log.error('Generation symbol failed');
         }
         else {
            grunt.log.ok('Generation symbol succeed');
         }
         done();
         return;
      });
   });

   function getPluginsFolder(dir) {
      return Utils.getFolders(path.join(ROOT, dir), 'archetypePlugin');
   }

   function getPluginImpls(pluginFolder, dir) {
      return Utils.getFolders(path.join(ROOT, dir, pluginFolder, 'impl'));
   }
};