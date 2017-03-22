goog.provide('M.parameter.wfs');

goog.require('M.utils');
goog.require('M.exception');

(function() {
   'use strict';

   /**
    * Parses the specified user layer WFS parameters to a object
    *
    * @param {string|Mx.parameters.Layer} userParameters parameters
    * provided by the user
    * @returns {Mx.parameters.WFS|Array<Mx.parameters.WFS>}
    * @public
    * @function
    * @api stable
    */
   M.parameter.wfs = function(userParameters) {
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

      layers = userParametersArray.map(function(userParam) {
         var layerObj = {};

         // gets the layer type
         layerObj.type = M.layer.type.WFS;

         // gets the name
         layerObj.name = getName(userParam);

         // gets the URL
         layerObj.url = getURL(userParam);

         // gets the name
         layerObj.namespace = getNamespace(userParam);

         // gets the legend
         layerObj.legend = getLegend(userParam);

         // gets the CQL filter
         layerObj.cql = getCQL(userParam);

         // gets the geometry
         layerObj.geometry = getGeometry(userParam);

         // gets the ids
         layerObj.ids = getIds(userParam);

         // gets the version
         layerObj.version = getVersion(userParam);

         // gets the options
         layerObj.options = getOptions(userParam);

         // format specified by the user when create object WFS
         layerObj.outputFormat = userParameters.outputFormat;

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
   var getURL = function(parameter) {
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
   var getName = function(parameter) {
      var name, params, namespaceName;
      if (M.utils.isString(parameter)) {
         if (/^WFS(T)?\*.+/i.test(parameter)) {
            // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>
            if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+/i.test(parameter) || /^[^\*]*\*[^\*]+\:[^\*]+/.test(parameter)) {
               params = parameter.split(/\*/);
               namespaceName = params[3].trim();
               name = namespaceName.split('\:')[1];
            }
            else if (/^WFS(T)?\*[^\*]*\*[^\*]+[^\*]+/i.test(parameter)) {
               // <WFS(T)?>*(<TITLE>)?*<URL>*<NAME>
               params = parameter.split(/\*/);
               name = params[3].trim();
            }
         }
         // <URL>*<NAMESPACE>:<NAME>
         else if (/^[^\*]*\*[^\*]+\:[^\*]+/.test(parameter)) {
            params = parameter.split(/\*/);
            namespaceName = params[1].trim();
            name = namespaceName.split('\:')[1];
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
    * Parses the parameter in order to get the layer namespace
    * @private
    * @function
    */
   var getNamespace = function(parameter) {
      var namespace, params, namespaceName;
      if (M.utils.isString(parameter)) {
         if (/^WFS(T)?\*.+/i.test(parameter)) {
            // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>
            if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+/i.test(parameter)) {
               params = parameter.split(/\*/);
               namespaceName = params[3].trim();
               namespace = namespaceName.split('\:')[0];
            }
         }
         // <URL>*<NAMESPACE>:<NAME>
         else if (/^[^\*]*\*[^\*]+\:[^\*]+/.test(parameter)) {
            params = parameter.split(/\*/);
            namespaceName = params[1].trim();
            namespace = namespaceName.split('\:')[0];
         }
      }
      else if (M.utils.isObject(parameter) && !M.utils.isNullOrEmpty(parameter.namespace)) {
         namespace = parameter.namespace.trim();
      }
      else if (!M.utils.isObject(parameter)) {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }

      if (M.utils.isUrl(namespace) || /^(true|false)$/i.test(namespace)) {
         namespace = null;
      }
      return namespace;
   };

   /**
    * Parses the parameter in order to get the layer legend
    * @private
    * @function
    */
   var getLegend = function(parameter) {
      var legend, params;
      if (M.utils.isString(parameter)) {
         // <WFS(T)?>*<TITLE>*<URL>...
         if (/^WFS(T)?\*[^\*]/i.test(parameter)) {
            params = parameter.split(/\*/);
            legend = params[1].trim();
         }
         // <URL>*<NAMESPACE>:<NAME>*<TITLE>
         else if (/^[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+/.test(parameter)) {
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
    * Parses the parameter in order to get the CQL filter
    * @private
    * @function
    */
   var getCQL = function(parameter) {
      var cql, params;
      if (M.utils.isString(parameter)) {
         // URL*NAMESPACE:NAME*TITLE*CQL
         if (/^[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
            params = parameter.split(/\*/);
            cql = params[3].trim();
         }
         // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>*<ID>*<CQL>
         if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+\*[^\*]*\*[^\*]*/i.test(parameter)) {
            params = parameter.split(/\*/);
            cql = params[6].trim();
         }
      }
      else if (M.utils.isObject(parameter) && !M.utils.isNullOrEmpty(parameter.cql) || !M.utils.isNullOrEmpty(parameter.ecql)) {
         cql = parameter.cql ? parameter.cql.trim() : parameter.ecql.trim();
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
    * Parses the parameter in order to get the layer geometry
    * @private
    * @function
    */
   var getGeometry = function(parameter) {
      var geometry, params;
      if (M.utils.isString(parameter)) {
         if (/^WFS(T)?\*.+/i.test(parameter)) {
            // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>
            if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+/i.test(parameter)) {
               params = parameter.split(/\*/);
               geometry = params[4].trim();
            }
            else if (/^WFS(T)?\*[^\*]*\*[^\*][^\*]+\*[^\*]+/i.test(parameter)) {
               // <WFS(T)?>*(<TITLE>)?*<URL>*<NAME>*<GEOM>
               params = parameter.split(/\*/);
               geometry = params[4].trim();
            }
         }
      }
      else if (M.utils.isObject(parameter) && !M.utils.isNullOrEmpty(parameter.geometry)) {
         geometry = parameter.geometry.trim();
      }
      else if (!M.utils.isObject(parameter)) {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }

      if (M.utils.isUrl(geometry) || /^(true|false)$/i.test(geometry)) {
         geometry = null;
      }
      return geometry;
   };

   /**
    * Parses the parameter in order to get the layer namespace
    * @private
    * @function
    */
   var getIds = function(parameter) {
      var ids, params;
      if (M.utils.isString(parameter)) {
         if (/^WFS(T)?\*.+/i.test(parameter)) {
            // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>*<FEATURE_ID1>-<FEATURE_ID2>...
            if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+\*(.\-?)+$/i.test(parameter)) {
               params = parameter.split(/\*/);
               ids = params[5].trim().split('\-');
            }
            else if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\*[^\*]+\*(.\-?)+$/i.test(parameter)) {
               // <WFS(T)?>*(<TITLE>)?*<URL>*<NAME>*<GEOM>*<FEATURE_ID1>-<FEATURE_ID2>...
               params = parameter.split(/\*/);
               ids = params[5].trim().split('\-');
            }
         }
      }
      else if (M.utils.isObject(parameter) && !M.utils.isNullOrEmpty(parameter.ids)) {
         ids = parameter.ids;
      }
      else if (!M.utils.isObject(parameter)) {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }

      if (M.utils.isUrl(ids)) {
         ids = null;
      }

      if (!M.utils.isNullOrEmpty(ids) && !M.utils.isArray(ids)) {
         ids = [ids];
      }
      return ids;
   };


   /**
    * Parses the parameter in order to get the version
    * @private
    * @function
    */
   var getVersion = function(parameter) {
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
   var getOptions = function(parameter) {
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