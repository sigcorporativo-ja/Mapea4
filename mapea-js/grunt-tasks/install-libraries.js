var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;

var externs = require('./utilities/build-externs');

var ROOT = path.join(__dirname, '..');

module.exports = function(grunt) {

   grunt.registerMultiTask('install-libraries', 'get externs modules for libraries', function() {
      var done = this.async();

      var outputDir = this.data.outputDir;
      var impls = this.data.impls;

      var nExternsDownloaded = 0;
      for (var i = 0, il = impls.length; i < il; i++) {
         var impl = impls[i];
         var implRootDir = path.join(ROOT, impl.dir);

         // npm install
         exec('npm install', {
            cwd: implRootDir
         }, function(err, stdout, stderr) {
            console.log(stdout);
            // bower install
            exec('bower install', {
               cwd: implRootDir
            }, function(err, stdout, stderr) {
               console.log(stdout);

               // creates the external folder
               var externFolder = createExternFolder(outputDir, impl);
               var packagejson = getPackageJSON(implRootDir);

               externs(packagejson, externFolder, implRootDir, function(err) {
                  nExternsDownloaded++;
                  if (err != null) {
                     grunt.log.error(err);
                     grunt.log.error('externs creation error');
                  }
                  else {
                     grunt.log.writeln('Externs created successfully for ' + impl.id);

                     // check if all implementations were compiled
                     if (nExternsDownloaded === il) {
                        grunt.log.ok('All externs created successfully');
                        done();
                        return;
                     }
                  }
               });
            });
         });
      }
   });

   function createExternFolder(outputDir, impl) {
      var implPath = path.join(ROOT, outputDir, impl.id);
      fs.ensureDirSync(implPath);
      return implPath;
   }

   function getPackageJSON(implRootDir) {
      var packagejson = path.join(implRootDir, 'package.json');
      return fs.realpathSync(packagejson);
   }
};