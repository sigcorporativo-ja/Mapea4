/**
 * @module M/parameter/osm
 */
import { isNullOrEmpty, isString, normalize, isArray, isObject } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import * as LayerType from '../layer/Type.js';

const OSM_REGEXP = /OSM\.*/;

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
    boolean: param => /^1|(true)$/i.test(param),
    string: param => param,
    int: param => Number.parseInt(param, 10),
    float: param => Number.parseFloat(param, 10),
    array_number: param => param.split(separator || '')
      .map(elem => elem.trim())
      .map(n => Number.parseFloat(n)),
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
 * Parses the specified user layer KML parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.KML|Array<Mx.parameters.KML>}
 * @public
 * @function
 * @api
 */
const osm = (userParam) => {
  let userParameters = userParam;
  let layers = [];

  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    userParameters = {
      type: LayerType.OSM,
      name: 'osm',
    };
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((param) => {
    const type = LayerType.OSM;

    const transparent = getParameter({
      parameter: param,
      type: 'string',
      attr: 'name',
    })(OSM_REGEXP, 1);


    const legend = getParameter({
      parameter: param,
      type: 'string',
      name: 'legend',
    })(OSM_REGEXP, 2);

    return {
      type,
      transparent,
      legend,
    };
  });

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};

export default osm;
