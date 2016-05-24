var path = require('path');
var walk = require('walk').walk;
var fs = require('fs-extra');
var Promise = require('promise');

/**
 * ROOT of the project
 */
var ROOT = path.join(__dirname, '..', '..');

/**
 * Constructor for PluginTask class
 * @param folderName the name of the plugin folder
 */
var Utils = {};

/**
 * TODO
 */
Utils.clone = function(obj) {
   var target;

   if (Utils.isArray(obj)) {
      target = [];
      for (var i = 0, ilen = obj.length; i < ilen; i++) {
         target[i] = Utils.clone(obj[i]);
      }
   }
   else if (Utils.isObject(obj)) {
      target = {};
      for (var i in obj) {
         if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
         }
      }
   }
   else {
      target = obj;
   }
   return target;
};

/**
 * TODO
 */
Utils.getJSFiles = function(dir, callback) {
   var paths = [];
   var finishedWalkers = 0;
   for (var i = 0, il = dir.length; i < il; i++) {
      var walker = walk(dir[i]);
      // for each file it checks if it is a js file
      walker.on('file', function(root, stats, next) {
         var sourcePath = path.join(root, stats.name);
         if (/\.js$/.test(sourcePath)) {
            // puts the file into the paths
            paths.push(sourcePath);
         }
         next();
      });
      // check if some error occurred
      walker.on('errors', function(err) {
         callback('Trouble walking ' + err);
      });
      walker.on('end', function() {
         // it calls callback when all walkers have finished
         finishedWalkers++;
         if (finishedWalkers == il) {
            callback(null, paths);
         }
      });
   }
};

/**
 * TODO
 */
Utils.writeFile = function(path, content) {
   return new Promise(function(success, fail) {
      fs.outputFile(path, content, function(err) {
         if (err != null) {
            fail(err);
         }
         else {
            success(null);
         }
      });
   });
};

/**
 * TODO
 */
Utils.getFolders = function(dir, exclude) {
   var folders = [];
   try {
      var files = fs.readdirSync(dir);
      for (var i = 0, ilen = files.length; i < ilen; i++) {
         var fileName = files[i];
         var fileRealPath = path.join(dir, fileName);
         if (fs.statSync(fileRealPath).isDirectory() && (fileName !== exclude)) {
            folders.push(fileName);
         }
      }
   }
   catch (err) {
      console.info('it does not exist ' + dir);
   }
   return folders;
};

/**
 * TODO
 */
Utils.isArray = function(obj) {
   var isArray = false;
   if (obj != null) {
      isArray = (Object.prototype.toString.call(obj) === Object.prototype.toString.call([]));
   }
   return isArray;
};

/**
 * TODO
 */
Utils.isObject = function(obj) {
   var isObject = false;
   if (obj != null) {
      isObject = ((typeof obj === 'object') && (obj.toString !== undefined));
   }
   return isObject;
};

/**
 * TODO
 */
Utils.extend = function(objOld, objNew) {
   if ((objOld != null) && (objNew != null)) {
      for (var attr in objNew) {
         if (!objOld[attr]) {
            objOld[attr] = Utils.clone(objNew[attr]);
         }
         else if (Utils.isArray(objOld[attr])) {
            objOld[attr] = objOld[attr].concat(Utils.clone(objNew[attr]));
         }
         else if (Utils.isObject(objOld[attr])) {
            Utils.extend(objOld[attr], objNew[attr]);
         }
      }
   }
};

/**
 * Export main function.
 */
module.exports = Utils;