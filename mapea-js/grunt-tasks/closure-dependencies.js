var exec = require('child_process').exec;

module.exports = function (grunt) {

   grunt.registerMultiTask('closure-dependencies', 'use closure to build the dependencies', function () {
      var done = this.async();

      var impls = this.data.impl;
      var index = 0;
      var implLength = impls.length;

      for (var i = 0; i < implLength; i++) {
         var impl = impls[i];

         // gets the config variables
         var closureFolder = impl.closurePath;
         if (isNullOrEmpty(closureFolder)) {
            throw 'No ha especificado la carpeta de closure';
         }

         var dependencies = impl.deps;
         if (isNullOrEmpty(dependencies)) {
            dependencies = [];
         }

         var outputFile = impl.outputFile;
         if (isNullOrEmpty(outputFile)) {
            throw 'No se ha especificado ningún archivo de destino';
         }

         grunt.log.writeln("Building the dependencies file '" + outputFile + "' ...");

         // add executuion permission to the script
         addExecutionPermission(closureFolder, function (error, stdout, stderr) {
            if (error != null) {
               grunt.log.error(error);
               done();
            }
            else {
               // execute closure
               executeDepswriter(closureFolder, dependencies, outputFile, function (error, stdout, stderr) {
                  if (error != null) {
                     grunt.log.error(error);
                     done();
                  }
                  else {
                     // DONE
                     index++;
                     if (index === implLength) {
                        grunt.log.ok("Build succeeded.");
                        done();
                     }
                  }
               });
            }
         });
      }
   });

   function addExecutionPermission(closureFolder, callback) {
      var depswriterScript = closureFolder.concat('closure/bin/build/depswriter.py');
      var chmod = 'chmod ugo+x '.concat(depswriterScript);
      exec(chmod, callback);
   }

   function executeDepswriter(closureFolder, dependencies, outputFile, callback) {

      // closure variables
      var depswriterScript = closureFolder.concat('closure/bin/build/depswriter.py');

      /*******************
       * SCRIPT
       ********************/
      var depswriterCmd = depswriterScript;

      /*******************
       * ROOTS WITH PREFIX
       ********************/
      // dependencies
      for (var i = 0, il = dependencies.length; i < il; i++) {
         var dep = dependencies[i];
         if (!isNullOrEmpty(dep.path) && !isNullOrEmpty(dep.prefix)) {
            // path
            depswriterCmd += ' --root_with_prefix="'.concat(dep.path);
            // prefix
            depswriterCmd += ' '.concat(dep.prefix).concat('"');
         }
      }

      /*******************
       * OUTPUT FILE
       ********************/
      depswriterCmd += '  --output_file="'.concat(outputFile).concat('"');

      grunt.log.debug(depswriterCmd);

      exec(depswriterCmd, callback);
   }

   function isNullOrEmpty(obj) {
      var nullOrEmpty = false;

      if (isNull(obj)) {
         nullOrEmpty = true;
      }
      else if (isArray(obj)) {
         nullOrEmpty = true;
         if (obj.length > 0) {
            for (var i = 0, ilen = obj.length; i < ilen; i++) {
               var objElem = obj[i];
               if (!isNullOrEmpty(objElem)) {
                  nullOrEmpty = false;
                  return false;
               }
            };
         }
      }
      else if ((typeof obj === 'string') && (obj.trim().length === 0)) {
         nullOrEmpty = true;
      }

      return nullOrEmpty;
   }

   function isNull(obj) {
      var isNull = false;

      if (typeof obj !== 'boolean') {
         if (typeof obj === 'undefined') {
            isNull = true;
         }
         else if (!obj) {
            isNull = true;
         }
         else if (obj === null) {
            isNull = true;
         }
      }

      return isNull;
   }

   function isArray(obj) {
      var isArray = false;
      if (!isNull(obj)) {
         isArray = (Object.prototype.toString.call(obj) === Object.prototype.toString
            .call([]));
      }
      return isArray;
   }
};