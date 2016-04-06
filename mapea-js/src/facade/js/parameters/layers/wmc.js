goog.provide('M.parameter.wmc');

goog.require('M.utils');
goog.require('M.exception');

(function () {
   'use strict';

   /**
    * Parses the specified user layer WMC parameters to a object
    *
    * @param {string|Mx.parameters.Layer} userParameters parameters
    * provided by the user
    * @returns {Mx.parameters.WMC|Array<Mx.parameters.WMC>}
    * @public
    * @function
    * @api stable
    */
   M.parameter.wmc = function (userParameters) {
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
         layerObj.type = M.layer.type.WMC;

         // gets the name
         layerObj.name = getName(userParam);

         // gets the URL
         layerObj.url = getURL(userParam);

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
   var getName = function (parameter, type) {
      var name, params;
      if (M.utils.isString(parameter)) {
         // <WMC>*<URL>*<NAME>
         if (/^\w{3,7}\*[^\*]+\*[^\*]+$/.test(parameter)) {
            params = parameter.split(/\*/);
            name = params[2].trim();
         }
         // <WMC>*(<PREDEFINED_NAME> OR <URL>)
         else if (/^\w{3,7}\*[^\*]$/.test(parameter)) {
            params = parameter.split(/\*/);
            name = params[1].trim();
         }
         // (<URL>*<NAME>)
         else if (/^[^\*]+\*[^\*]+$/.test(parameter)) {
            params = parameter.split(/\*/);
            name = params[1].trim();
         }
         // (<PREDEFINED_NAME> OR <URL>)
         else if (/^[^\*]+$/.test(parameter) && !M.utils.isUrl(parameter)) {
            name = parameter;
         }
      }
      else if (M.utils.isObject(parameter)) {
         name = M.utils.normalize(parameter.name);
      }
      else {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
      }

      if (M.utils.isUrl(name)) {
         name = null;
      }
      return name;
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