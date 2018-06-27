import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import Map from('../map/map.js');

export class WMS {
  'use strict';

  /**
   * Parses the specified user layer WMS parameters to a object
   *
   * @param {string|Mx.parameters.Layer} userParameters parameters
   * provided by the user
   * @returns {Mx.parameters.WMS|Array<Mx.parameters.WMS>}
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
      layerObj.type = Layer.type.WMS;

      // gets the name
      layerObj.name = name(userParam);

      // gets the URL
      layerObj.url = URL(userParam);

      // gets the legend
      layerObj.legend = legend(userParam);

      // gets the transparence
      layerObj.transparent = transparent(userParam);

      // gets the tiled
      layerObj.tiled = tiled(userParam);

      // gets the CQL filter
      layerObj.cql = CQL(userParam);

      // gets the version
      layerObj.version = version(userParam);

      // gets the options
      layerObj.options = options(userParam);

      return layerObj;
    });

    if (!Utils.isArray(userParameters)) {
      layers = layers[0];
    }

    return layers;
  };

  /**
   * Parses the parameter in order to get the service URL
   * @private
   * @function
   */
  static get URL(parameter) {
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
  static get name(parameter) {
    let name, params;
    if (Utils.isString(parameter)) {
      if (/^WMS\*.+/i.test(parameter)) {
        // <WMS>*<TITLE>*<URL>*<NAME>
        if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
          params = parameter.split(/\*/);
          name = params[3].trim();
        }
      }
      // <URL>*<NAME>
      else if (/^[^\*]*\*[^\*]+/.test(parameter)) {
        params = parameter.split(/\*/);
        name = params[1].trim();
      }
      // <NAME>
      else if (/^[^\*]*/.test(parameter)) {
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
   * Parses the parameter in order to get the layer legend
   * @private
   * @function
   */
  static get legend(parameter) {
    let legend, params;
    if (Utils.isString(parameter)) {
      // <WMS>*<TITLE>
      if (/^WMS\*[^\*]/i.test(parameter)) {
        params = parameter.split(/\*/);
        legend = params[1].trim();
      }
      // <URL>*<NAME>*<TITLE>
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

  /**
   * Parses the parameter in order to get the transparence
   * @private
   * @function
   */
  static get transparent(parameter) {
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

  /**
   * Parses the parameter in order to get the layer tile
   * @private
   * @function
   */
  static get tiled(parameter) {
    let tiled, params;
    if (Utils.isString(parameter)) {
      // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>*<TILED>
      if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*(true|false)$/i.test(parameter)) {
        params = parameter.split(/\*/);
        tiled = params[5].trim();
      } else if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
        tiled = true;
      }
      // <WMS_FULL>*<URL>*<TILED>
      else if (/^WMS_FULL\*[^\*]+\*(true|false)/i.test(parameter)) {
        params = parameter.split(/\*/);
        tiled = params[2].trim();
      }
      // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>*<TILED>
      else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*(true|false)/i.test(parameter)) {
        params = parameter.split(/\*/);
      }
      // <URL>*<NAME>*<TRANSPARENCE>*<TILED>
      else if (/^[^\*]+\*[^\*]+\*(true|false)\*(true|false)/i.test(parameter)) {
        params = parameter.split(/\*/);
      }
    } else if (Utils.isObject(parameter)) {
      tiled = Utils.normalize(parameter.tiled);
    } else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }
    if (!Utils.isNullOrEmpty(tiled)) {
      tiled = /^1|(true)$/i.test(tiled);
    }
    return tiled;
  }

  /**
   * Parses the parameter in order to get the CQL filter
   * @private
   * @function
   */
  static get CQL(parameter) {
    let cql, params;
    if (Utils.isString(parameter)) {
      // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>*<TILED>
      if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*(true|false)$/i.test(parameter)) {
        params = parameter.split(/\*/);
        cql = params[5].trim();
      } else if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
        cql = true;
      }
      // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>*<TILED>*<CQL>
      else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*(true|false)\*[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        cql = params[5].trim();
      }
      // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>*<CQL>
      else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        cql = params[4].trim();
      }
      // <URL>*<NAME>*<TITLE>*<CQL>
      else if (/^[^\*]+\*[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        cql = params[3].trim();
      }
      // <URL>*<NAME>*<TRANSPARENCE>*<TILED>*<CQL>
      else if (/^[^\*]+\*[^\*]+\*(true|false)\*(true|false)\*[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        cql = params[4].trim();
      }
    } else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.cql)) {
      cql = parameter.cql.trim();
    } else if (!Utils.isObject(parameter)) {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }

    if (/^(true|false)$/i.test(cql) || /^\d\.\d\.\d$/.test(cql)) {
      cql = undefined;
    }
    return cql;
  }

  /**
   * Parses the parameter in order to get the version
   * @private
   * @function
   */
  static get version(parameter) {
    let version;
    if (Utils.isString(parameter)) {
      if (/(\d\.\d\.\d)$/.test(parameter)) {
        version = parameter.match(/\d\.\d\.\d$/)[0];
      }
    } else if (Utils.isObject(parameter)) {
      version = parameter.version;
    } else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }
    return version;
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
