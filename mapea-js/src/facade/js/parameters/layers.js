goog.provide('M.parameter.layer');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.parameter.wmc');
goog.require('M.parameter.wms');
goog.require('M.parameter.wmts');
goog.require('M.parameter.wfs');
goog.require('M.parameter.kml');
goog.require('M.parameter.osm');
goog.require('M.parameter.mapbox');

(function () {
  'use strict';

  /**
   * Parses the specified user layer parameters to a object
   *
   * @param {string|Mx.parameters.Layer} userParameters parameters
   * provided by the user
   * @param {string} forced type of the layer (optional)
   * @returns {Mx.parameters.Layer|Array<Mx.parameters.Layer>}
   * @public
   * @function
   * @api stable
   */
  M.parameter.layer = function (userParameters, forcedType) {
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
      var layerObj = null;
      if (M.utils.isObject(userParam) && (userParam instanceof M.Layer)) {
        layerObj = userParam;
      }
      else {
        // gets the layer type
        var type = getType(userParam, forcedType);
        type = M.utils.normalize(type);

        layerObj = M.parameter[type](userParam);
      }

      return layerObj;
    });

    if (!M.utils.isArray(userParameters)) {
      layers = layers[0];
    }

    return layers;
  };

  /**
   * Parses the parameter in order to get the type
   * @private
   * @function
   */
  var getType = function (parameter, forcedType) {
    var type;
    if (M.utils.isString(parameter)) {
      if (/^\s*osm\s*$/i.test(parameter)) {
        type = M.layer.type.OSM;
      }
      else if (/^\s*mapbox\*.+$/i.test(parameter)) {
        type = M.layer.type.MAPBOX;
      }
      else {
        var typeMatches = parameter.match(/^(\w+)\*.+$/);
        if (typeMatches && (typeMatches.length > 1)) {
          type = M.layer.type.parse(typeMatches[1]);
          if (M.utils.isUndefined(type)) {
            M.exception('No se reconoce el tipo de capa ' + typeMatches[1]);
          }
        }
        if (M.utils.isUndefined(type) && !M.utils.isNullOrEmpty(forcedType)) {
          type = forcedType;
        }
        else if (M.utils.isUndefined(type)) {
          M.exception('No se reconoce el tipo de capa ' + type);
        }
      }
    }
    else if (M.utils.isObject(parameter)) {
      if (!M.utils.isNullOrEmpty(parameter.type)) {
        type = M.layer.type.parse(parameter.type);
        if (M.utils.isUndefined(type)) {
          M.exception('No se reconoce el tipo de capa ' + type);
        }
      }
    }
    else {
      M.exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }

    if (!M.utils.isNullOrEmpty(type) && !M.utils.isNullOrEmpty(forcedType) && (type !== forcedType)) {
      M.exception('El tipo de la capa ('.concat(type)
        .concat(') no era el esperado (').concat(forcedType).concat(')'));
    }

    if (M.utils.isNullOrEmpty(type) && !M.utils.isNullOrEmpty(forcedType)) {
      type = forcedType;
    }
    return type;
  };
})();
