import Utils from '../utils/utils';
import Exception from '../exception/exception';
import Map from '../map/map';

export default class WMTS {


  /**
   * Parses the specified user layer WMTS parameters to a object
   *
   * @param {string|Mx.parameters.Layer} userParameters parameters
   * provided by the user
   * @returns {Mx.parameters.WMTS|Array<Mx.parameters.WMTS>}
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

    layers = userParametersArray.map((userParam) => {
      let layerObj = {};

      // gets the layer type
      layerObj.type = Layer.type.WMTS;

      // gets the name
      layerObj.name = WMTS.getName(userParam);

      // gets the URL
      layerObj.url = WMTS.getURL(userParam);

      // gets the matrix set
      layerObj.matrixSet = WMTS.getMatrixSet(userParam);

      // gets the legend
      layerObj.legend = WMTS.getLegend(userParam);

      // gets the options
      layerObj.options = WMTS.getOptions(userParam);

      // gets transparent
      layerObj.transparent = WMTS.getTransparent(userParam);

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
  static getURL(parameter) {
    let url;
    if (Utils.isString(parameter)) {
      let urlMatches = parameter.match(/^([^\*]*\*)*(https?\:\/\/[^\*]+)([^\*]*\*?)*$/i);
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
  static getName(parameter) {
    let name, params;
    if (Utils.isString(parameter)) {
      if (/^WMTS\*.+/i.test(parameter)) {
        // <WMTS>*<URL>*<NAME>(*<MATRIXSET>*<TITLE>)?
        if (/^WMTS\*[^\*]+\*[^\*]+/i.test(parameter)) {
          params = parameter.split(/\*/);
          name = params[2].trim();
        }
      }
      // <URL>*<NAME>
      else if (/^[^\*]*\*[^\*]+/.test(parameter)) {
        params = parameter.split(/\*/);
        name = params[1].trim();
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
   * Parses the parameter in order to get the layer legend
   * @private
   * @function
   */
  static getMatrixSet(parameter) {
    let matrixSet, params;
    if (Utils.isString(parameter)) {
      // <WMTS>*<URL>*<NAME>*<MATRIXSET>
      if (/^WMTS\*[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        matrixSet = params[3].trim();
      }
      // <URL>*<NAME>*<MATRIXSET>
      else if (/^[^\*]+\*[^\*]+\*[^\*]+/.test(parameter)) {
        params = parameter.split(/\*/);
        matrixSet = params[2].trim();
      }
    } else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.matrixSet)) {
      matrixSet = parameter.matrixSet.trim();
    } else if (!Utils.isObject(parameter)) {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }

    if (Utils.isUrl(matrixSet) || /^(true|false)$/i.test(matrixSet)) {
      matrixSet = null;
    }
    return matrixSet;
  }

  /**
   * Parses the parameter in order to get the layer legend
   * @private
   * @function
   */
  static getLegend(parameter) {
    let legend, params;
    if (Utils.isString(parameter)) {
      if (/^WMTS\*.+/i.test(parameter)) {
        // <WMTS>*<URL>*<NAME>*<MATRIXSET>?*<TITLE>
        if (/^WMTS\*[^\*]+\*[^\*]+\*[^\*]*\*[^\*]+/i.test(parameter)) {
          params = parameter.split(/\*/);
          legend = params[4].trim();
        }
      }
      // <URL>*<NAME>(*<MATRIXSET>)?*<TITLE>
      else if (/^[^\*]+\*[^\*]+\*[^\*]*\*[^\*]+/.test(parameter)) {
        params = parameter.split(/\*/);
        legend = params[3].trim();
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

  /**
   * Parses the parameter in order to get the options
   * @private
   * @function
   */
  static getOptions(parameter) {
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

  /**
   * Parses the parameter in order to get the transparence
   * @private
   * @function
   */
  static getTransparent(parameter) {
    let transparent, params;
    if (Utils.isString(parameter)) {
      // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>
      if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
        params = parameter.split(/\*/);
        transparent = params[4].trim();
      }
      // <WMS_FULL>*<URL>(*<TILED>)?
      else if (/^WMS_FULL\*[^\*]+(\*(true|false))?/i.test(parameter)) {
        params = parameter.split(/\*/);
        transparent = true;
      }
      // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>
      else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
        params = parameter.split(/\*/);
        transparent = params[3].trim();
      }
      // <URL>*<NAME>*<TRANSPARENCE>
      else if (/^[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
        params = parameter.split(/\*/);
        transparent = params[2].trim();
      }
    } else if (Utils.isObject(parameter)) {
      transparent = Utils.normalize(parameter.transparent);
    } else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }
    if (!Utils.isNullOrEmpty(transparent)) {
      transparent = /^1|(true)$/i.test(transparent);
    }
    return transparent;
  }
}
