var fs = require('fs-extra');
var path = require('path');
var readline = require('readline');

var Utils = require('./utilities/task-utilities');
var compile = require('./utilities/mapea-compiler');

var DEFAULT_PLUGIN_VERSION = "1.0.0";

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..');

module.exports = function (grunt) {
  grunt.registerMultiTask('compile-plugins', 'use closure to build the project', function () {
    var done = this.async();

    var dir = this.data.dir;
    var exportsDir = this.data.exportsDir;
    var outputDir = this.data.outputDir;
    var closureComplileOpts = this.data.closureComplileOpts;

    // get the plugin to compile
    var pluginFolders = [];
    var pluginToCompile = grunt.option('name');
    if ((pluginToCompile == null) || (pluginToCompile === '*')) {
      pluginFolders = getPluginsFolder(dir);
    }
    else {
      pluginFolders = pluginFolders.concat(pluginToCompile.split(','));
    }

    var compilePluginFacade = function (pluginFolder, version, callback) {
      // CLOSURE DEPS
      var facadeLib = path.join(dir, pluginFolder, 'facade',
        'js', '**', '*.js');
      var closureDepsOpts = {
        lib: [facadeLib],
        cwd: ROOT
      };

      // it adds the export file generated previously
      var exportFileName = 'mapea-'.concat(pluginFolder).concat('.js');
      var exportFile = path.join(exportsDir, exportFileName);
      closureComplileOpts.compile.js = [exportFile];

      // OUTPUT
      var output = path.join(ROOT, outputDir, pluginFolder, pluginFolder.concat('-').concat(version).concat('.').concat('.min.js'));

      compile(closureDepsOpts, closureComplileOpts, output, callback);
    };
    var compilePluginImpl = function (index, pluginImpls, pluginFolder, version, callback) {
      // base case
      if (pluginImpls.length === index) {
        callback(null);
      }
      // recursvie case
      else {
        var pluginImpl = pluginImpls[index];

        // CLOSURE DEPS
        //            var facadeLib = path.join(dir, pluginFolder, 'facade',
        //               'js', '**', '*.js');
        //            var implLib = path.join(dir, pluginFolder, 'impl',
        //               pluginImpl, 'js', '**', '*.js');
        //            var closureDepsOpts = {
        //               lib: [facadeLib, implLib],
        //               cwd: ROOT
        //            };
        var closureDepsOpts = {
          lib: [path.join(dir, '**', 'js', '*.js')],
          cwd: ROOT
        };

        // it adds the export file generated previously
        var exportFileName = 'mapea-'.concat(pluginFolder).concat('-').concat(pluginImpl).concat('.js');
        var exportFile = path.join(exportsDir, exportFileName);
        closureComplileOpts.compile.js = [exportFile];

        // OUTPUT
        var output = path.join(ROOT, outputDir, pluginFolder, pluginFolder.concat('-').concat(version).concat('.').concat(pluginImpl).concat('.min.js'));

        compile(closureDepsOpts, closureComplileOpts, output, function (err) {
          if (err != null) {
            grunt.log.error(err);
          }
          // next
          compilePluginImpl(index + 1, pluginImpls, pluginFolder, version, callback);
        });
      }
    };
    var compilePlugin = function (index, callback) {
      // base case
      if (pluginFolders.length === index) {
        callback(null);
      }
      // recursvie case
      else {
        var pluginFolder = pluginFolders[index];
        var pluginImpls = getPluginImpls(pluginFolder, dir);
        var pluginMetadata = {
          version: DEFAULT_PLUGIN_VERSION
        };
        var mPluginFilePath = path.join(dir, pluginFolder, '.mplugin');
        if (mPluginFilePath != null && grunt.file.exists(mPluginFilePath)) {
          var jsonApiFile = grunt.file.readJSON(mPluginFilePath);
          if (jsonApiFile && Object.keys(jsonApiFile).length > 0) {
            Object.keys(jsonApiFile).forEach(function (metadata, key) {
              metadata[key] = jsonApiFile[key];
            }.bind(this, pluginMetadata));
          }
        }

        var compilationCallback = function (version, err) {
          // move css minified
          moveCssMin(pluginFolder, outputDir, version,
            moveApiJSON.bind(this, pluginFolder, outputDir, version, function (err) {
              if (err != null) {
                grunt.log.error(err);
              }
              // next
              compilePlugin(index + 1, callback);
            }));
        }.bind(this, pluginMetadata.version);
        grunt.log.writeln('Compiling plugin ' + pluginFolder + '...');

        if (pluginImpls.length === 0) {
          // if it has no implementations then compiles just the facade
          compilePluginFacade(pluginFolder, pluginMetadata.version, compilationCallback);
        }
        else {
          // otherwise it compiles all implementations
          compilePluginImpl(0, pluginImpls, pluginFolder, pluginMetadata.version, compilationCallback);
        }
      }
    };
    compilePlugin(0, function (err) {
      if (err != null) {
        grunt.log.error(err);
        grunt.log.error('Compilation failed');
      }
      else {
        grunt.log.ok('Compilation succeed');
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

  function moveCssMin(pluginFolder, outputDir, version, callback) {
    var srcFile = pluginFolder.concat('.min.css');
    var distFile = pluginFolder.concat('-').concat(version).concat('.min.css');
    var src = path.join(ROOT, outputDir, srcFile);
    var dest = path.join(ROOT, outputDir, pluginFolder, distFile);
    // we also move the api json file
    moveFile(src, dest, callback);
  }

  function moveApiJSON(pluginFolder, outputDir, version, callback) {
    var fileName = 'api.json';
    var src = path.join(ROOT, outputDir, pluginFolder, fileName);
    var dest = path.join(ROOT, outputDir, pluginFolder, fileName);
    moveFile(src, dest, callback);
  }

  function moveFile(src, dest, callback) {
    fs.move(src, dest, function (err) {
      // hides errors
      callback(null);
    });
  }
};
