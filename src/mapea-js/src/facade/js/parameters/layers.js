import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import WMC from('./layers/wmc.js');
import WMS from('./layers/wms.js');
import WMTS from('./layers/wmts.js');
import WFS from('./layers/wfs.js');
import KML from('./layers/kml.js');
import OSM from('./layers/osm.js');
import Mapbox from('./layers/mapbox.js');
import Map from('../map/map.js');

export class Layer {
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
  layer(userParameters, forcedType) {
    let layers = [];

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    // checks if the parameter is an array
    let userParametersArray = userParameters;
    if (!Utils.isArray(userParametersArray)) {
      userParametersArray = [userParametersArray];
    }

    layers = userParametersArray.Map((userParam) => {
      let layerObj = null;
      if (Utils.isObject(userParam) && (userParam instanceof Layer)) {
        layerObj = userParam;
      } else {
        // gets the layer type
        let type = getType(userParam, forcedType);
        type = Utils.normalize(type);

        if (Utils.isFunction(Parameter[type])) {
          layerObj = Parameter[type](userParam);
        } else {
          layerObj = userParam;
        }
      }

      return layerObj;
    });

    if (!Utils.isArray(userParameters)) {
      layers = layers[0];
    }

    return layers;
  }

  /**
   * Parses the parameter in order to get the type
   * @private
   * @function
   */
  let getType = (parameter, forcedType) => {
    let type;
    if (Utils.isString(parameter)) {
      if (/^\s*osm\s*$/i.test(parameter)) {
        type = Layer.type.OSM;
      } else if (/^\s*mapbox\*.+$/i.test(parameter)) {
        type = Layer.type.Mapbox;
      } else {
        let typeMatches = parameter.match(/^(\w+)\*.+$/);
        if (typeMatches && (typeMatches.length > 1)) {
          type = Layer.type.parse(typeMatches[1]);
          if (Utils.isUndefined(type)) {
            Exception('No se reconoce el tipo de capa ' + typeMatches[1]);
          }
        }
        if (Utils.isUndefined(type) && !Utils.isNullOrEmpty(forcedType)) {
          type = forcedType;
        } else if (Utils.isUndefined(type)) {
          Exception('No se reconoce el tipo de capa ' + type);
        }
      }
    } else if (Utils.isObject(parameter)) {
      if (!Utils.isNullOrEmpty(parameter.type)) {
        type = Layer.type.parse(parameter.type);
        if (Utils.isUndefined(type)) {
          Exception('No se reconoce el tipo de capa ' + type);
        }
      }
    } else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }

    if (!Utils.isNullOrEmpty(type) && !Utils.isNullOrEmpty(forcedType) && (type !== forcedType)) {
      Exception('El tipo de la capa ('.concat(type)
        .concat(') no era el esperado (').concat(forcedType).concat(')'));
    }

    if (Utils.isNullOrEmpty(type) && !Utils.isNullOrEmpty(forcedType)) {
      type = forcedType;
    }
    return type;
  }
}
