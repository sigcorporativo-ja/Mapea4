goog.provide('M.parameter.wmts');

goog.require('M.utils');
goog.require('M.exception');

(function () {
   'use strict';

   /**
    * Parses the specified user layer WMTS parameters to a object
    *
    * @param {string|Mx.parameters.Layer} userParameters parameters
    * provided by the user
    * @returns {Mx.parameters.WMTS|Array<Mx.parameters.WMTS>}
    * @public
    * @function
    * @api stable
    */
   M.parameter.wmts = function (userParameters) {
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
         layerObj.type = M.layer.type.WMTS;

         // gets the name
         layerObj.name = getName(userParam);

         // gets the URL
         layerObj.url = getURL(userParam);

         // gets the matrix set
         layerObj.matrixSet = getMatrixSet(userParam);

         // gets the legend
         layerObj.legend = getLegend(userParam);

         // gets the options
         layerObj.options = getOptions(userParam);

         // gets transparent
         layerObj.transparent = getTransparent(userParam);

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
         var urlMatches = parameter.match(/^([^\*]*\*)*(https?\:\/\/[^\*]+)([^\*]*\*?)*$/i);
         if (urlMatches && (urlMatches.length > 2)) {
            url = urlMatches[2];
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
         if (/^WMTS\*.+/i.test(parameter)) {
            // <WMTS>*<URL>*<NAME>(*<MATRIXSET>*<TITLE>)?
            if (/^WMTS\*[^\*]+\*[^\*]+/i.test(parameter)) {
               params = parameter.split(/\*/);
               name = params[2].trim();
            }
         }
         // <URL>*<NAME>
         else if (/^[^\*]*\*[^\*]+/.test(parameter)) {
            params = parameter.split(/\*/);
            name = params[1].trim();
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
    * Parses the parameter in order to get the layer legend
    * @private
    * @function
    */
   var getMatrixSet = function (parameter) {
      var matrixSet, params;
      if (M.utils.isString(parameter)) {
         // <WMTS>*<URL>*<NAME>*<MATRIXSET>
         if (/^WMTS\*[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
            params = parameter.split(/\*/);
            matrixSet = params[3].trim();
         }
         // <URL>*<NAME>*<MATRIXSET>
         else if (/^[^\*]+\*[^\*]+\*[^\*]+/.test(parameter)) {
            params = parameter.split(/\*/);
            matrixSet = params[2].trim();
         }
      }
      else if (M.utils.isObject(parameter) && !M.utils.isNullOrEmpty(parameter.matrixSet)) {
         matrixSet = parameter.matrixSet.trim();
      }
      else if (!M.utils.isObject(parameter)) {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }

      if (M.utils.isUrl(matrixSet) || /^(true|false)$/i.test(matrixSet)) {
         matrixSet = null;
      }
      return matrixSet;
   };

   /**
    * Parses the parameter in order to get the layer legend
    * @private
    * @function
    */
   var getLegend = function (parameter) {
      var legend, params;
      if (M.utils.isString(parameter)) {
         if (/^WMTS\*.+/i.test(parameter)) {
            // <WMTS>*<URL>*<NAME>*<MATRIXSET>?*<TITLE>
            if (/^WMTS\*[^\*]+\*[^\*]+\*[^\*]*\*[^\*]+/i.test(parameter)) {
               params = parameter.split(/\*/);
               legend = params[4].trim();
            }
         }
         // <URL>*<NAME>(*<MATRIXSET>)?*<TITLE>
         else if (/^[^\*]+\*[^\*]+\*[^\*]*\*[^\*]+/.test(parameter)) {
            params = parameter.split(/\*/);
            legend = params[3].trim();
         }
      }
      else if (M.utils.isObject(parameter) && !M.utils.isNullOrEmpty(parameter.legend)) {
         legend = parameter.legend.trim();
      }
      else if (!M.utils.isObject(parameter)) {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }

      if (M.utils.isUrl(legend) || /^(true|false)$/i.test(legend)) {
         legend = null;
      }
      return legend;
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

   /**
    * Parses the parameter in order to get the transparence
    * @private
    * @function
    */
   var getTransparent = function(parameter) {
      var transparent, params;
      if (M.utils.isString(parameter)) {
         // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>
         if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
            params = parameter.split(/\*/);
            transparent = params[4].trim();
         }
         // <WMS_FULL>*<URL>(*<TILED>)?
         else if (/^WMS_FULL\*[^\*]+(\*(true|false))?/i.test(parameter)) {
            params = parameter.split(/\*/);
            transparent = true;
         }
         // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>
         else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
            params = parameter.split(/\*/);
            transparent = params[3].trim();
         }
         // <URL>*<NAME>*<TRANSPARENCE>
         else if (/^[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
            params = parameter.split(/\*/);
            transparent = params[2].trim();
         }
      }
      else if (M.utils.isObject(parameter)) {
         transparent = M.utils.normalize(parameter.transparent);
      }
      else {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }
      if (!M.utils.isNullOrEmpty(transparent)) {
         transparent = /^1|(true)$/i.test(transparent);
      }
      return transparent;
   };
})();
