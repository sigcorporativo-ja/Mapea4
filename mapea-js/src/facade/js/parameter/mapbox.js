/**
 * @module M/parameter/mapbox
 */
import {
  isNullOrEmpty, isString, normalize, isArray, isObject,
} from '../util/Utils.js';
import Exception from '../exception/exception.js';
import * as LayerType from '../layer/Type.js';
import { getValue } from '../i18n/language.js';

const MAPBOX_REGEX = /MAPBOX\*.*/;

/**
 * @function
 * @private
 */
const getParameter = ({
  parameter,
  attr,
  type,
  separator,
  normalized = false,
}) => (regexp, position) => {
  let value;
  const parserType = {
    boolean: (param) => /^1|(true)$/i.test(param),
    string: (param) => param,
    int: (param) => Number.parseInt(param, 10),
    float: (param) => Number.parseFloat(param, 10),
    array_number: (param) => param.split(separator || '')
      .map((elem) => elem.trim())
      .map((n) => Number.parseFloat(n)),
  };

  if (isString(parameter) && regexp.test(parameter)) {
    const params = parameter.split('*');
    const param = params[position];
    if (!isNullOrEmpty(param)) {
      value = parserType[type](param);
    }
  } else if (isObject(parameter)) {
    value = parameter[attr];
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isString(value)) {
    value = value.trim();
  }
  if (normalized === true) {
    value = normalize(value);
  }
  return value;
};

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getAccessTokenMapbox = (parameter) => {
  let accessToken;
  if (isString(parameter)) {
    accessToken = null; // accessToken by string type no supported
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.accessToken)) {
    accessToken = parameter.accessToken.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return accessToken;
};

/**
 * Parses the specified user layer Mapbox parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.KML|Array<Mx.parameters.KML>}
 * @public
 * @function
 * @api
 */
const mapbox = (userParameters) => {
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
    const name = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'name',
    })(MAPBOX_REGEX, 1);

    const legend = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'legend',
    })(MAPBOX_REGEX, 3);

    const transparent = getParameter({
      parameter: userParam,
      type: 'boolean',
      attr: 'transparent',
    })(MAPBOX_REGEX, 2);

    const accessToken = getAccessTokenMapbox(userParam);

    return {
      type: LayerType.Mapbox,
      name,
      legend,
      transparent,
      accessToken,
    };
  });

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};

export default mapbox;
