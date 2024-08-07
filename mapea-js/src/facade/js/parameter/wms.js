/**
 * @module M/parameter/wms
 */
import {
  isNullOrEmpty, isString, normalize, isArray, isObject,
} from '../util/Utils.js';
import Exception from '../exception/exception.js';
import * as LayerType from '../layer/Type.js';
import { getValue } from '../i18n/language.js';

const REGEXP_WMS = /WMS\*.*/;
const REGEXP_WMS_FULL = /WMS_FULL\*.*/;

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
    array_string: (param) => param.split(separator)
      .map((elem) => elem.trim())
      .map((n) => String(n)),
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
 * Parses the specified user layer WMS parameters to a object
 *
 * @function
 * @public
 * @api
 */
const wms = (userParameters) => {
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
    const type = LayerType.WMS;

    const name = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'name',
    });

    const url = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'url',
    });

    const legend = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'legend',
    });

    const transparent = getParameter({
      parameter: userParam,
      type: 'boolean',
      attr: 'transparent',
    });

    const tiled = getParameter({
      parameter: userParam,
      type: 'boolean',
      attr: 'tiled',
    });

    const maxExtentWMS = getParameter({
      parameter: userParam,
      type: 'array_number',
      attr: 'maxExtent',
      separator: '_',
    });

    const version = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'version',
    });

    const styles = getParameter({
      parameter: userParam,
      type: 'array_string',
      attr: 'styles',
      separator: '%',
    });

    let params;
    if (REGEXP_WMS.test(userParam) || isObject(userParam)) {
      params = {
        type,
        name: name(REGEXP_WMS, 3),
        tiled: tiled(REGEXP_WMS, 5),
        url: url(REGEXP_WMS, 2),
        legend: legend(REGEXP_WMS, 1),
        transparent: transparent(REGEXP_WMS, 4),
        maxExtent: maxExtentWMS(REGEXP_WMS, 6),
        version: version(REGEXP_WMS, 7),
        styles: styles(REGEXP_WMS, 8),
      };
    } else {
      params = {
        type,
        url: url(REGEXP_WMS_FULL, 1),
      };
    }

    return params;
  });

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};

export default wms;
