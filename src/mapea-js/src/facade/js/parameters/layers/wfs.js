import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import Map from('../map/map.js');

export class WFS {
  'use strict';

  /**
   * Parses the specified user layer WFS parameters to a object
   *
   * @param {string|Mx.parameters.Layer} userParameters parameters
   * provided by the user
   * @returns {Mx.parameters.WFS|Array<Mx.parameters.WFS>}
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
      layerObj.type = Layer.type.WFS;

      // gets the name
      layerObj.name = name(userParam);

      // gets the URL
      layerObj.url = URL(userParam);

      // gets the name
      layerObj.namespace = namespace(userParam);

      // gets the legend
      layerObj.legend = legend(userParam);

      // gets the CQL filter
      layerObj.cql = CQL(userParam);

      // gets the geometry
      layerObj.geometry = geometry(userParam);

      // gets the ids
      layerObj.ids = Ids(userParam);

      // gets the version
      layerObj.version = version(userParam);

      // gets the options
      layerObj.options = options(userParam);

      // format specified by the user when create object WFS
      layerObj.outputFormat = userParameters.outputFormat;

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
  static name(parameter) {
    let name, params, namespaceName;
    if (Utils.isString(parameter)) {
      if (/^WFS(T)?\*.+/i.test(parameter)) {
        // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>
        if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+/i.test(parameter) || /^[^\*]*\*[^\*]+\:[^\*]+/.test(parameter)) {
          params = parameter.split(/\*/);
          namespaceName = params[3].trim();
          name = namespaceName.split('\:')[1];
        } else if (/^WFS(T)?\*[^\*]*\*[^\*]+[^\*]+/i.test(parameter)) {
          // <WFS(T)?>*(<TITLE>)?*<URL>*<NAME>
          params = parameter.split(/\*/);
          name = params[3].trim();
        }
      }
      // <URL>*<NAMESPACE>:<NAME>
      else if (/^[^\*]*\*[^\*]+\:[^\*]+/.test(parameter)) {
        params = parameter.split(/\*/);
        namespaceName = params[1].trim();
        name = namespaceName.split('\:')[1];
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
   * Parses the parameter in order to get the layer namespace
   * @private
   * @function
   */
  static get namespace(parameter) {
    let namespace, params, namespaceName;
    if (Utils.isString(parameter)) {
      if (/^WFS(T)?\*.+/i.test(parameter)) {
        // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>
        if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+/i.test(parameter)) {
          params = parameter.split(/\*/);
          namespaceName = params[3].trim();
          namespace = namespaceName.split('\:')[0];
        }
      }
      // <URL>*<NAMESPACE>:<NAME>
      else if (/^[^\*]*\*[^\*]+\:[^\*]+/.test(parameter)) {
        params = parameter.split(/\*/);
        namespaceName = params[1].trim();
        namespace = namespaceName.split('\:')[0];
      }
    } else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.namespace)) {
      namespace = parameter.namespace.trim();
    } else if (!Utils.isObject(parameter)) {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }

    if (Utils.isUrl(namespace) || /^(true|false)$/i.test(namespace)) {
      namespace = null;
    }
    return namespace;
  }

  /**
   * Parses the parameter in order to get the layer legend
   * @private
   * @function
   */
  static get legend = function (parameter) {
    let legend, params;
    if (Utils.isString(parameter)) {
      // <WFS(T)?>*<TITLE>*<URL>...
      if (/^WFS(T)?\*[^\*]/i.test(parameter)) {
        params = parameter.split(/\*/);
        legend = params[1].trim();
      }
      // <URL>*<NAMESPACE>:<NAME>*<TITLE>
      else if (/^[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+/.test(parameter)) {
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
   * Parses the parameter in order to get the CQL filter
   * @private
   * @function
   */
  static get CQL(parameter) {
    let cql, params;
    if (Utils.isString(parameter)) {
      // URL*NAMESPACE:NAME*TITLE*CQL
      if (/^[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        cql = params[3].trim();
      }
      // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>*<ID>*<CQL>
      if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+\*[^\*]*\*[^\*]*/i.test(parameter)) {
        params = parameter.split(/\*/);
        cql = params[6].trim();
      }
    } else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.cql) || !Utils.isNullOrEmpty(parameter.ecql)) {
      cql = parameter.cql ? parameter.cql.trim() : parameter.ecql.trim();
    } else if (!Utils.isObject(parameter)) {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }

    if (/^(true|false)$/i.test(cql) || /^\d\.\d\.\d$/.test(cql)) {
      cql = undefined;
    }
    return cql;
  }

  /**
   * Parses the parameter in order to get the layer geometry
   * @private
   * @function
   */
  static get geometry(parameter) {
    let geometry, params;
    if (Utils.isString(parameter)) {
      if (/^WFS(T)?\*.+/i.test(parameter)) {
        // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>
        if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+/i.test(parameter)) {
          params = parameter.split(/\*/);
          geometry = params[4].trim();
        } else if (/^WFS(T)?\*[^\*]*\*[^\*][^\*]+\*[^\*]+/i.test(parameter)) {
          // <WFS(T)?>*(<TITLE>)?*<URL>*<NAME>*<GEOM>
          params = parameter.split(/\*/);
          geometry = params[4].trim();
        }
      }
    } else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.geometry)) {
      geometry = parameter.geometry.trim();
    } else if (!Utils.isObject(parameter)) {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }

    if (Utils.isUrl(geometry) || /^(true|false)$/i.test(geometry)) {
      geometry = null;
    }
    return geometry;
  }

  /**
   * Parses the parameter in order to get the layer namespace
   * @private
   * @function
   */
  static get Ids(parameter) {
    let ids, params;
    if (Utils.isString(parameter)) {
      if (/^WFS(T)?\*.+/i.test(parameter)) {
        // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>*<FEATURE_ID1>-<FEATURE_ID2>...
        if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+\*(.\-?)+$/i.test(parameter)) {
          params = parameter.split(/\*/);
          ids = params[5].trim().split('\-');
        } else if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\*[^\*]+\*(.\-?)+$/i.test(parameter)) {
          // <WFS(T)?>*(<TITLE>)?*<URL>*<NAME>*<GEOM>*<FEATURE_ID1>-<FEATURE_ID2>...
          params = parameter.split(/\*/);
          ids = params[5].trim().split('\-');
        }
      }
    } else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.ids)) {
      ids = parameter.ids;
    } else if (!Utils.isObject(parameter)) {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }

    if (Utils.isUrl(ids)) {
      ids = null;
    }

    if (!Utils.isNullOrEmpty(ids) && !Utils.isArray(ids)) {
      ids = [ids];
    }
    return ids;
  }


  /**
   * Parses the parameter in order to get the version
   * @private
   * @function
   */
  get version(parameter) {
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
