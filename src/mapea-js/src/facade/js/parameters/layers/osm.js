import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import Map from('../map/map.js');

export class OSM {
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
  constructor(userParameters) {
    let layers = [];

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      userParameters = {
        'type': Layer.type.OSM,
        'name': 'osm'
      };
    }

    // checks if the parameter is an array
    let userParametersArray = userParameters;
    if (!Utils.isArray(userParametersArray)) {
      userParametersArray = [userParametersArray];
    }

    layers = userParametersArray.Map((userParam) => {
      let layerObj = {};

      // gets the layer type
      layerObj.type = Layer.type.OSM;

      // gets the name
      layerObj.name = name(userParam);

      // gets the transparent
      layerObj.transparent = transparent(userParam);

      // gets the legend
      layerObj.legend = legend(userParam);

      return layerObj;
    });

    if (!Utils.isArray(userParameters)) {
      layers = layers[0];
    }

    return layers;
  }

  /**
   * Parses the parameter in order to get the layer name
   * @private
   * @function
   */
  static get name(parameter) {
    let name;
    if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.name)) {
      name = parameter.name.trim();
    }
    if (!Utils.isNullOrEmpty(name) && (Utils.isUrl(name) || /^(true|false)$/i.test(name))) {
      name = null;
    }
    return name;
  };

  /**
   * Parses the parameter in order to get the layer name
   * @private
   * @function
   */
  static get transparent(parameter) {
    let transparent, params;
    if (Utils.isString(parameter)) {
      // <OSM>*<TRANSPARENT>(*<TITLE>)?
      if (/^OSM\*[^\*]+(\*[^\*]+)?/i.test(parameter)) {
        params = parameter.split(/\*/);
        transparent = params[1].trim();
      }
    } else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.transparent)) {
      transparent = Utils.normalize(parameter.transparent);
    } else if (!Utils.isObject(parameter)) {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }
    if (!Utils.isNullOrEmpty(transparent)) {
      transparent = /^1|(true)$/i.test(transparent);
    }
    return transparent;
  }

  /**
   * Parses the parameter in order to get the layer legend
   * @private
   * @function
   */
  static get legend(parameter) {
    let legend, params;
    if (Utils.isString(parameter)) {
      // <OSM>*(<TRANSPARENT>)?*<TITLE>
      if (/^OSM\*([^\*]+)?\*[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        legend = params[2].trim();
      }
    } else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.legend)) {
      legend = parameter.legend.trim();
    } else if (!Utils.isObject(parameter)) {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }

    if (Utils.isUrl(legend) || /^(true|false)$/i.test(legend)) {
      legend = null;
    }
    return legend;
  }
}
