goog.provide('M.parameter.mapbox');

goog.require('M.utils');
goog.require('M.exception');

(function () {
  'use strict';

  /**
   * Parses the specified user layer Mapbox parameters to a object
   *
   * @param {string|Mx.parameters.Layer} userParameters parameters
   * provided by the user
   * @returns {Mx.parameters.KML|Array<Mx.parameters.KML>}
   * @public
   * @function
   * @api stable
   */
  M.parameter.mapbox = function (userParameters) {
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
      layerObj.type = M.layer.type.Mapbox;

      // gets the name
      layerObj.url = getURL(userParam);

      // gets the name
      layerObj.name = getName(userParam);

      // gets the transparent
      layerObj.transparent = getTransparent(userParam);

      // gets the accessToken
      layerObj.accessToken = getAccessToken(userParam);

      // gets the legend
      layerObj.legend = getLegend(userParam);

      return layerObj;
    });

    if (!M.utils.isArray(userParameters)) {
      layers = layers[0];
    }

    return layers;
  };

  /**
   * Parses the parameter in order to get the layer name
   * @private
   * @function
   */
  var getURL = function (parameter) {
    var url;
    if (M.utils.isString(parameter)) {
      url = null; // URL by string type no supported
    }
    else if (M.utils.isObject(parameter) && !M.utils.isNullOrEmpty(parameter.url)) {
      url = parameter.url.trim();
    }
    else if (!M.utils.isObject(parameter)) {
      M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }
    return url;
  };

  /**
   * Parses the parameter in order to get the layer name
   * @private
   * @function
   */
  var getAccessToken = function (parameter) {
    var accessToken;
    if (M.utils.isString(parameter)) {
      accessToken = null; // accessToken by string type no supported
    }
    else if (M.utils.isObject(parameter) && !M.utils.isNullOrEmpty(parameter.accessToken)) {
      accessToken = parameter.accessToken.trim();
    }
    else if (!M.utils.isObject(parameter)) {
      M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }
    return accessToken;
  };

  /**
   * Parses the parameter in order to get the layer name
   * @private
   * @function
   */
  var getName = function (parameter) {
    var name, params;
    if (M.utils.isString(parameter)) {
      if (/^MAPBOX\*.+/i.test(parameter)) {
        // <MAPBOX>*<NAME>(*<TRANSPARENT>)?(*<TITLE>)?
        if (/^MAPBOX\*[^\*]+(\*[^\*]+){0,2}/i.test(parameter)) {
          params = parameter.split(/\*/);
          name = params[1].trim();
        }
      }
      // <NAME>(*<TRANSPARENT>)?(*<TITLE>)?
      else if (/^[^\*]+(\*[^\*]+){0,2}/.test(parameter)) {
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
   * Parses the parameter in order to get the layer name
   * @private
   * @function
   */
  var getTransparent = function (parameter) {
    var transparent, params;
    if (M.utils.isString(parameter)) {
      if (/^MAPBOX\*.+/i.test(parameter)) {
        // <MAPBOX>*<NAME>*<TRANSPARENT>(*<TITLE>)?
        if (/^MAPBOX\*[^\*]+\*[^\*]+(\*[^\*]+)?/i.test(parameter)) {
          params = parameter.split(/\*/);
          transparent = params[2].trim();
        }
      }
      // <NAME>*<TRANSPARENT>(*<TITLE>)?
      else if (/^[^\*]+\*[^\*]+(\*[^\*]+)?/.test(parameter)) {
        params = parameter.split(/\*/);
        transparent = params[1].trim();
      }
    }
    else if (M.utils.isObject(parameter) && !M.utils.isNullOrEmpty(parameter.transparent)) {
      transparent = M.utils.normalize(parameter.transparent);
    }
    else if (!M.utils.isObject(parameter)) {
      M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }
    if (!M.utils.isNullOrEmpty(transparent)) {
      transparent = /^1|(true)$/i.test(transparent);
    }
    return transparent;
  };

  /**
   * Parses the parameter in order to get the layer legend
   * @private
   * @function
   */
  var getLegend = function (parameter) {
    var legend, params;
    if (M.utils.isString(parameter)) {
      if (/^MAPBOX\*.+/i.test(parameter)) {
        // <MAPBOX>*<NAME>*<TRANSPARENT>*<TITLE>
        if (/^MAPBOX\*[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
          params = parameter.split(/\*/);
          legend = params[3].trim();
        }
      }
      // <NAME>*<TRANSPARENT>*<TITLE>
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
})();
