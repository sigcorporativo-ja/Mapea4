goog.provide('M.parameter.wms');

goog.require('M.utils');
goog.require('M.exception');

(function () {
   'use strict';

   /**
    * Parses the specified user layer WMS parameters to a object
    *
    * @param {string|Mx.parameters.Layer} userParameters parameters
    * provided by the user
    * @returns {Mx.parameters.WMS|Array<Mx.parameters.WMS>}
    * @public
    * @function
    * @api stable
    */
   M.parameter.wms = function (userParameters) {
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
         layerObj.type = M.layer.type.WMS;

         // gets the name
         layerObj.name = getName(userParam);

         // gets the URL
         layerObj.url = getURL(userParam);

         // gets the legend
         layerObj.legend = getLegend(userParam);

         // gets the transparence
         layerObj.transparent = getTransparent(userParam);

         // gets the tiled
         layerObj.tiled = getTiled(userParam);

         // gets the CQL filter
         layerObj.cql = getCQL(userParam);

         // gets the version
         layerObj.version = getVersion(userParam);

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
         if (/^WMS\*.+/i.test(parameter)) {
            // <WMS>*<TITLE>*<URL>*<NAME>
            if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
               params = parameter.split(/\*/);
               name = params[3].trim();
            }
         }
         // <URL>*<NAME>
         else if (/^[^\*]*\*[^\*]+/.test(parameter)) {
            params = parameter.split(/\*/);
            name = params[1].trim();
         }
         // <NAME>
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
    * Parses the parameter in order to get the layer legend
    * @private
    * @function
    */
   var getLegend = function (parameter) {
      var legend, params;
      if (M.utils.isString(parameter)) {
         // <WMS>*<TITLE>
         if (/^WMS\*[^\*]/i.test(parameter)) {
            params = parameter.split(/\*/);
            legend = params[1].trim();
         }
         // <URL>*<NAME>*<TITLE>
         else if (/^[^\*]+\*[^\*]+\*[^\*]+/.test(parameter)) {
            params = parameter.split(/\*/);
            legend = params[2].trim();
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
    * Parses the parameter in order to get the transparence
    * @private
    * @function
    */
   var getTransparent = function (parameter) {
      var transparent, params;
      if (M.utils.isString(parameter)) {
         // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>
         if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
            params = parameter.split(/\*/);
            transparent = params[4].trim();
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
         transparent = /^true$/i.test(transparent);
      }
      return transparent;
   };

   /**
    * Parses the parameter in order to get the layer tile
    * @private
    * @function
    */
   var getTiled = function (parameter) {
      var tiled, params;
      if (M.utils.isString(parameter)) {
         // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>*<TILED>
         if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*(true|false)$/i.test(parameter)) {
            params = parameter.split(/\*/);
            tiled = params[5].trim();
         }
         else if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
            tiled = true;
         }
         // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>*<TILED>
         else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*(true|false)/i.test(parameter)) {
            params = parameter.split(/\*/);
         }
         // <URL>*<NAME>*<TRANSPARENCE>*<TILED>
         else if (/^[^\*]+\*[^\*]+\*(true|false)\*(true|false)/i.test(parameter)) {
            params = parameter.split(/\*/);
         }
      }
      else if (M.utils.isObject(parameter)) {
         tiled = M.utils.normalize(parameter.tiled);
      }
      else {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }
      if (!M.utils.isNullOrEmpty(tiled)) {
         tiled = /^true$/i.test(tiled);
      }
      return tiled;
   };

   /**
    * Parses the parameter in order to get the CQL filter
    * @private
    * @function
    */
   var getCQL = function (parameter) {
      var cql, params;
      if (M.utils.isString(parameter)) {
         // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>*<TILED>
         if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*(true|false)$/i.test(parameter)) {
            params = parameter.split(/\*/);
            cql = params[5].trim();
         }
         else if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
            cql = true;
         }
         // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>*<TILED>*<CQL>
         else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*(true|false)\*[^\*]+/i.test(parameter)) {
            params = parameter.split(/\*/);
            cql = params[5].trim();
         }
         // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>*<CQL>
         else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*[^\*]+/i.test(parameter)) {
            params = parameter.split(/\*/);
            cql = params[4].trim();
         }
         // <URL>*<NAME>*<TITLE>*<CQL>
         else if (/^[^\*]+\*[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
            params = parameter.split(/\*/);
            cql = params[3].trim();
         }
         // <URL>*<NAME>*<TRANSPARENCE>*<TILED>*<CQL>
         else if (/^[^\*]+\*[^\*]+\*(true|false)\*(true|false)\*[^\*]+/i.test(parameter)) {
            params = parameter.split(/\*/);
            cql = params[4].trim();
         }
      }
      else if (M.utils.isObject(parameter) && !M.utils.isNullOrEmpty(parameter.cql)) {
         cql = parameter.cql.trim();
      }
      else if (!M.utils.isObject(parameter)) {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }

      if (/^(true|false)$/i.test(cql) || /^\d\.\d\.\d$/.test(cql)) {
         cql = undefined;
      }
      return cql;
   };

   /**
    * Parses the parameter in order to get the version
    * @private
    * @function
    */
   var getVersion = function (parameter) {
      var version;
      if (M.utils.isString(parameter)) {
         if (/(\d\.\d\.\d)$/.test(parameter)) {
            version = parameter.match(/\d\.\d\.\d$/)[0];
         }
      }
      else if (M.utils.isObject(parameter)) {
         version = parameter.version;
      }
      else {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }
      return version;
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