/**
 * @module M/parameter/geojson
 */
import { isNullOrEmpty, isString, normalize, isArray, isObject } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import * as LayerType from '../layer/Type.js';
import { getValue } from '../i18n/language.js';

const GEOJSON_REGEX = /^GeoJSON(T)?\*.*/;

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
 * @public
 * @function
 * @api
 */
const geojson = (userParameters) => {
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
    const type = LayerType.GeoJSON;

    const name = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'name',
    })(GEOJSON_REGEX, 1);

    const url = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'name',
    })(GEOJSON_REGEX, 2);

    const extract = getParameter({
      parameter: userParam,
      type: 'boolean',
      attr: 'extract',
    })(GEOJSON_REGEX, 3);

    const style = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'style',
    })(GEOJSON_REGEX, 4);

    return {
      type,
      name,
      url,
      extract,
      style,
    };
  });

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};

export default geojson;
