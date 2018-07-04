import Utils from '../utils/utils';
import Exception from '../exception/exception';
import Map from '../map/map';

export default class KML {

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
      Exception('No ha especificado ningún parámetro');
    }

    // checks if the parameter is an array
    var userParametersArray = userParameters;
    if (!Utils.isArray(userParametersArray)) {
      userParametersArray = [userParametersArray];
    }

    layers = userParametersArray.map((userParam) => {
      let layerObj = {};

      // gets the layer type
      layerObj.type = Layer.type.KML;

      // gets the name
      layerObj.name = KML.name(userParam);

      // gets the URL
      layerObj.url = KML.URL(userParam);

      // gets the extract
      layerObj.extract = KML.getExtract(userParam);

      // gets the options
      layerObj.options = KML.options(userParam);

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
      // v3 <KML>*<NAME>*<DIR>*<FILENAME>*<EXTRACT>
      if (/^KML\*[^\*]+\*[^\*]+\*[^\*]+\.kml\*(true|false)$/i.test(parameter)) {
        let params = parameter.split(/\*/);
        url = params[2].concat(params[3]);
      } else {
        let urlMatches = parameter.match(/^([^\*]*\*)*(https?\:\/\/[^\*]+)(\*(true|false))?$/i);
        if (urlMatches && (urlMatches.length > 2)) {
          url = urlMatches[2];
        }
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
      if (/^KML\*.+/i.test(parameter)) {
        // <KML>*<NAME>*<URL>(*<FILENAME>)?*<EXTRACT>
        if (/^KML\*[^\*]+\*[^\*]+(\*[^\*]+)?(\*(true|false))?$/i.test(parameter)) {
          params = parameter.split(/\*/);
          name = params[1].trim();
        }
      }
      // <NAME>*<URL>(*<FILENAME>)?(*<EXTRACT>)?
      else if (/^[^\*]*\*[^\*]+/.test(parameter)) {
        params = parameter.split(/\*/);
        name = params[0].trim();
      }
      // <NAME>(*<URL>(*<FILENAME>)?(*<EXTRACT>)?)? filtering
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
   * Parses the parameter in order to get the transparence
   * @private
   * @function
   */
  static getExtract(parameter) {
    let extract, params;
    if (Utils.isString(parameter)) {
      // <KML>*<NAME>*<URL>(*<FILENAME>)?*<EXTRACT>
      if (/^KML\*[^\*]+\*[^\*]+(\*[^\*]+)?(\*(true|false))?$/i.test(parameter)) {
        params = parameter.split(/\*/);
        extract = params[params.length - 1].trim();
      }
      // <NAME>*<URL>*<EXTRACT>
      else if (/^[^\*]+\*[^\*]+\*(true|false)$/i.test(parameter)) {
        params = parameter.split(/\*/);
        extract = params[2].trim();
      }
      // <URL>*<EXTRACT>
      else if (/^[^\*]+\*(true|false)$/i.test(parameter)) {
        params = parameter.split(/\*/);
        extract = params[1].trim();
      }
    } else if (Utils.isObject(parameter)) {
      extract = Utils.normalize(parameter.extract);
    } else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
    }

    if (!Utils.isNullOrEmpty(extract)) {
      extract = /^1|(true)$/i.test(extract);
    } else {
      extract = undefined;
    }
    return extract;
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
}
