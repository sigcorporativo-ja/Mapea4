/**
 * @module M/parameter/wmc
 */
import { isNullOrEmpty, isString, normalize, isArray, isObject, isUrl } from '../util/Utils';
import Exception from '../exception/exception';
import * as LayerType from '../layer/Type';
import { getValue } from '../i18n/language';

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameWMC = (parameter, type) => {
  let name;
  let params;
  if (isString(parameter)) {
    // <WMC>*<URL>*<NAME>
    if (/^\w{3,7}\*[^*]+\*[^*]+$/.test(parameter)) {
      params = parameter.split(/\*/);
      name = params[2].trim();
    } else if (/^\w{3,7}\*[^*]$/.test(parameter)) {
      // <WMC>*(<PREDEFINED_NAME> OR <URL>)
      params = parameter.split(/\*/);
      name = params[1].trim();
    } else if (/^[^*]+\*[^*]+$/.test(parameter)) {
      // (<URL>*<NAME>)
      params = parameter.split(/\*/);
      name = params[1].trim();
    } else if (/^[^*]+$/.test(parameter) && !isUrl(parameter)) {
      // (<PREDEFINED_NAME> OR <URL>)
      name = parameter;
    }
  } else if (isObject(parameter)) {
    name = normalize(parameter.name);
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  if (isUrl(name)) {
    name = null;
  }
  return name;
};
/**
 * Parses the parameter in order to get the service URL
 * @private
 * @function
 */
const getURLWMC = (parameter) => {
  let url;
  if (isString(parameter)) {
    const urlMatches = parameter.match(/^([^*]*\*)*(https?:\/\/[^*]+)([^*]*\*?)*$/i);
    if (urlMatches && (urlMatches.length > 2)) {
      url = urlMatches[2];
    }
  } else if (isObject(parameter)) {
    url = parameter.url;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return url;
};
/**
 * Parses the parameter in order to get the options
 * @private
 * @function
 */
const getOptionsWMC = (parameter) => {
  let options;
  if (isString(parameter)) {
    // TODO ver como se pone el parámetro
  } else if (isObject(parameter)) {
    options = parameter.options;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return options;
};
/**
 * @public
 * @function
 * @api
 */
export const wmc = (userParameters) => {
  let layers = [];
  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    Exception(getValue('exception').no_param);
  }
  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }
  layers = userParametersArray.map((userParam) => {
    const layerObj = {};
    // gets the layer type
    layerObj.type = LayerType.WMC;
    // gets the name
    layerObj.name = getNameWMC(userParam);
    // gets the URL
    layerObj.url = getURLWMC(userParam);
    // gets the options
    layerObj.options = getOptionsWMC(userParam);
    return layerObj;
  });
  if (!isArray(userParameters)) {
    layers = layers[0];
  }
  return layers;
};

export default wmc;
