goog.provide('M.parameter.kml');

goog.require('M.utils');
goog.require('M.exception');

(function () {
   'use strict';

   /**
    * Parses the specified user layer KML parameters to a object
    *
    * @param {string|Mx.parameters.Layer} userParameters parameters
    * provided by the user
    * @returns {Mx.parameters.KML|Array<Mx.parameters.KML>}
    * @public
    * @function
    * @api stable
    */
   M.parameter.kml = function (userParameters) {
      var layers = [];

      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(userParameters)) {
         M.exception('No ha especificado ningún parámetro');
      }

      // checks if the parameter is an array
      var userParametersArray = userParameters;
      if (!M.utils.isArray(userParametersArray)) {
         userParametersArray = [userParametersArray];
      }

      layers = userParametersArray.map(function (userParam) {
         var layerObj = {};

         // gets the layer type
         layerObj.type = M.layer.type.KML;

         // gets the name
         layerObj.name = getName(userParam);

         // gets the URL
         layerObj.url = getURL(userParam);

         // gets the extract
         layerObj.extract = getExtract(userParam);

         // gets the options
         layerObj.options = getOptions(userParam);

         return layerObj;
      });

      if (!M.utils.isArray(userParameters)) {
         layers = layers[0];
      }

      return layers;
   };

   /**
    * Parses the parameter in order to get the service URL
    * @private
    * @function
    */
   var getURL = function (parameter) {
      var url;
      if (M.utils.isString(parameter)) {
         // v3 <KML>*<NAME>*<DIR>*<FILENAME>*<EXTRACT>
         if (/^KML\*[^\*]+\*[^\*]+\*[^\*]+\.kml\*(true|false)$/i.test(parameter)) {
            var params = parameter.split(/\*/);
            url = params[2].concat(params[3]);
         }
         else {
            var urlMatches = parameter.match(/^([^\*]*\*)*(https?\:\/\/[^\*]+)(\*(true|false))?$/i);
            if (urlMatches && (urlMatches.length > 2)) {
               url = urlMatches[2];
            }
         }
      }
      else if (M.utils.isObject(parameter)) {
         url = parameter.url;
      }
      else {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }
      return url;
   };

   /**
    * Parses the parameter in order to get the layer name
    * @private
    * @function
    */
   var getName = function (parameter) {
      var name, params;
      if (M.utils.isString(parameter)) {
         if (/^KML\*.+/i.test(parameter)) {
            // <KML>*<NAME>*<URL>(*<FILENAME>)?*<EXTRACT>
            if (/^KML\*[^\*]+\*[^\*]+(\*[^\*]+)?(\*(true|false))?$/i.test(parameter)) {
               params = parameter.split(/\*/);
               name = params[1].trim();
            }
         }
         // <NAME>*<URL>(*<FILENAME>)?(*<EXTRACT>)?
         else if (/^[^\*]*\*[^\*]+/.test(parameter)) {
            params = parameter.split(/\*/);
            name = params[0].trim();
         }
         // <NAME>(*<URL>(*<FILENAME>)?(*<EXTRACT>)?)? filtering
         else if (/^[^\*]*/.test(parameter)) {
            params = parameter.split(/\*/);
            name = params[0].trim();
         }
      }
      else if (M.utils.isObject(parameter) && !M.utils.isNullOrEmpty(parameter.name)) {
         name = parameter.name.trim();
      }
      else if (!M.utils.isObject(parameter)) {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }

      if (M.utils.isUrl(name) || /^(true|false)$/i.test(name)) {
         name = null;
      }
      return name;
   };

   /**
    * Parses the parameter in order to get the transparence
    * @private
    * @function
    */
   var getExtract = function (parameter) {
      var extract, params;
      if (M.utils.isString(parameter)) {
         // <KML>*<NAME>*<URL>(*<FILENAME>)?*<EXTRACT>
         if (/^KML\*[^\*]+\*[^\*]+(\*[^\*]+)?(\*(true|false))?$/i.test(parameter)) {
            params = parameter.split(/\*/);
            extract = params[params.length - 1].trim();
         }
         // <NAME>*<URL>*<EXTRACT>
         else if (/^[^\*]+\*[^\*]+\*(true|false)$/i.test(parameter)) {
            params = parameter.split(/\*/);
            extract = params[2].trim();
         }
         // <URL>*<EXTRACT>
         else if (/^[^\*]+\*(true|false)$/i.test(parameter)) {
            params = parameter.split(/\*/);
            extract = params[1].trim();
         }
      }
      else if (M.utils.isObject(parameter)) {
         extract = M.utils.normalize(parameter.extract);
      }
      else {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }

      if (!M.utils.isNullOrEmpty(extract)) {
         extract = /^1|(true)$/i.test(extract);
      }
      else {
         extract = undefined;
      }
      return extract;
   };

   /**
    * Parses the parameter in order to get the options
    * @private
    * @function
    */
   var getOptions = function (parameter) {
      var options;
      if (M.utils.isString(parameter)) {
         // TODO ver como se pone el parámetro
      }
      else if (M.utils.isObject(parameter)) {
         options = parameter.options;
      }
      else {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }
      return options;
   };
})();