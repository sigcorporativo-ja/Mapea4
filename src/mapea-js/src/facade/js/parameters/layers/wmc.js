import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import Map from('../map/map.js');

export class WMC {
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
  constructor(userParameters) {
    let layers = [];

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    // checks if the parameter is an array
    var userParametersArray = userParameters;
    if (!Utils.isArray(userParametersArray)) {
      userParametersArray = [userParametersArray];
    }

    layers = userParametersArray.Map((userParam) => {
      let layerObj = {};

      // gets the layer type
      layerObj.type = Layer.type.WMC;

      // gets the name
      layerObj.name = name(userParam);

      // gets the URL
      layerObj.url = URL(userParam);

      // gets the options
      layerObj.options = options(userParam);

      return layerObj;
    });

    if (!Utils.isArray(userParameters)) {
      layers = layers[0];
    }

    return layers;
  }

  /**
   * Parses the parameter in order to get the service URL
   * @private
   * @function
   */
  static get URL(parameter) {
    let url;
    if (Utils.isString(parameter)) {
      var urlMatches = parameter.match(/^([^\*]*\*)*(https?\:\/\/[^\*]+)([^\*]*\*?)*$/i);
      if (urlMatches && (urlMatches.length > 2)) {
        url = urlMatches[2];
      }
    } else if (Utils.isObject(parameter)) {
      url = parameter.url;
    } else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }
    return url;
  }

  /**
   * Parses the parameter in order to get the layer name
   * @private
   * @function
   */
  static get name(parameter, type) {
    let name, params;
    if (Utils.isString(parameter)) {
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
      else if (/^[^\*]+$/.test(parameter) && !Utils.isUrl(parameter)) {
        name = parameter;
      }
    } else if (Utils.isObject(parameter)) {
      name = Utils.normalize(parameter.name);
    } else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }

    if (Utils.isUrl(name)) {
      name = null;
    }
    return name;
  }

  /**
   * Parses the parameter in order to get the options
   * @private
   * @function
   */
  static get options(parameter) {
    let options;
    if (Utils.isString(parameter)) {
      // TODO ver como se pone el parámetro
    } else if (Utils.isObject(parameter)) {
      options = parameter.options;
    } else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }
    return options;
  }
}
