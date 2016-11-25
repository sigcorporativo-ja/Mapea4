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
      layerObj.type = M.layer.type.MAPBOX;

      // gets the name
      layerObj.name = getName(userParam);

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
  var getName = function (parameter) {
    var name, params;
    if (M.utils.isString(parameter)) {
      if (/^MAPBOX\*.+/i.test(parameter)) {
        // <MAPBOX>*<NAME>(*<TITLE>)?
        if (/^MAPBOX\*[^\*]+(\*[^\*]+)?/i.test(parameter)) {
          params = parameter.split(/\*/);
          name = params[1].trim();
        }
      }
      // <NAME>(*<TITLE>)?
      else if (/^[^\*]+(\*[^\*]+)?/.test(parameter)) {
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
      if (/^MAPBOX\*.+/i.test(parameter)) {
        // <MAPBOX>*<NAME>*<TITLE>
        if (/^MAPBOX\*[^\*]+\*[^\*]+/i.test(parameter)) {
          params = parameter.split(/\*/);
          legend = params[2].trim();
        }
      }
      // <NAME>*<TITLE>
      else if (/^[^\*]+\*[^\*]+/.test(parameter)) {
        params = parameter.split(/\*/);
        legend = params[1].trim();
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
