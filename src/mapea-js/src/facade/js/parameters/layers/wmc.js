import Utils from '../utils/utils';
import Exception from '../exception/exception';
import Map from '../map/map';

export default class WMC {

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

    layers = userParametersArray.map((userParam) => {
      let layerObj = {};

      // gets the layer type
      layerObj.type = Layer.type.WMC;

      // gets the name
      layerObj.name = WMC.getName(userParam);

      // gets the URL
      layerObj.url = WMC.getURL(userParam);

      // gets the options
      layerObj.options = WMC.getOptions(userParam);

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
  static getName(parameter, type) {
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
