goog.provide('M.parameter.osm');

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
  M.parameter.osm = function (userParameters) {
    var layers = [];

    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(userParameters)) {
      userParameters = {
        'type': M.layer.type.OSM,
        'name': 'osm'
      };
    }

    // checks if the parameter is an array
    var userParametersArray = userParameters;
    if (!M.utils.isArray(userParametersArray)) {
      userParametersArray = [userParametersArray];
    }

    layers = userParametersArray.map(function (userParam) {
      var layerObj = {};

      // gets the layer type
      layerObj.type = M.layer.type.OSM;

      // gets the name
      layerObj.name = getName(userParam);

      // gets the transparent
      layerObj.transparent = getTransparent(userParam);

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
    var name;
    if (M.utils.isObject(parameter) && !M.utils.isNullOrEmpty(parameter.name)) {
      name = parameter.name.trim();
    }
    if (!M.utils.isNullOrEmpty(name) && (M.utils.isUrl(name) || /^(true|false)$/i.test(name))) {
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
      // <OSM>*<TRANSPARENT>(*<TITLE>)?
      if (/^OSM\*[^\*]+(\*[^\*]+)?/i.test(parameter)) {
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
      // <OSM>*(<TRANSPARENT>)?*<TITLE>
      if (/^OSM\*([^\*]+)?\*[^\*]+/i.test(parameter)) {
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
