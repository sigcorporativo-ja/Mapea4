import Utils from '../utils/utils';
import Exception from '../exception/exception';
import Map from '../map/map';

export default class Mapbox {

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
  constructor(userParameters) {
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
      let layerObj = {};

      // gets the layer type
      layerObj.type = Layer.type.Mapbox;

      // gets the name
      layerObj.url = Mapbox.URL(userParam);

      // gets the name
      layerObj.name = Mapbox.name(userParam);

      // gets the transparent
      layerObj.transparent = Mapbox.getTransparent(userParam);

      // gets the accessToken
      layerObj.accessToken = Mapbox.getAccessToken(userParam);

      // gets the legend
      layerObj.legend = Mapbox.getLegend(userParam);

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
  static getURL(parameter) {
    let url;
    if (Utils.isString(parameter)) {
      url = null; // URL by string type no supported
    } else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.url)) {
      url = parameter.url.trim();
    } else if (!Utils.isObject(parameter)) {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }
    return url;
  }

  /**
   * Parses the parameter in order to get the layer name
   * @private
   * @function
   */
  static getAccessToken(parameter) {
    let accessToken;
    if (Utils.isString(parameter)) {
      accessToken = null; // accessToken by string type no supported
    } else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.accessToken)) {
      accessToken = parameter.accessToken.trim();
    } else if (!Utils.isObject(parameter)) {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }
    return accessToken;
  }

  /**
   * Parses the parameter in order to get the layer name
   * @private
   * @function
   */
  static getName(parameter) {
    var name, params;
    if (Utils.isString(parameter)) {
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
    } else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.name)) {
      name = parameter.name.trim();
    } else if (!Utils.isObject(parameter)) {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }

    if (Utils.isUrl(name) || /^(true|false)$/i.test(name)) {
      name = null;
    }
    return name;
  }

  /**
   * Parses the parameter in order to get the layer name
   * @private
   * @function
   */
  static getTransparent(parameter) {
    let transparent, params;
    if (Utils.isString(parameter)) {
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
  static getLegend(parameter) {
    let legend, params;
    if (Utils.isString(parameter)) {
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
