/**
 * @module M/parameter/kml
 */
import { isNullOrEmpty, isString, normalize, isArray, isObject } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import * as LayerType from '../layer/Type.js';
import { getValue } from '../i18n/language.js';

const REGEXP_KML = /KML\*.*/;

/**
 * @function
 * @private
 */
const getParameter = ({
  parameter,
  attr,
  type,
  valueCmp = /^1|true/i,
  separator,
  normalized = false,
}) => (regexp, position) => {
  let value;
  const parserType = {
    boolean: param => valueCmp.test(param),
    boolean_eql: param => param === undefined || param === 'true',
    string: param => param,
    int: param => Number.parseInt(param, 10),
    float: param => Number.parseFloat(param, 10),
    array_number: param => param.split(separator || '')
      .map(elem => elem.trim())
      .map(n => Number.parseFloat(n)),
  };

  if (isString(parameter) && regexp.test(parameter)) {
    const params = parameter.split('*');
    let param = params[position];
    value = parserType[type](param);
    if (attr === 'extract') {
      param = params.slice(-2, -1)[0];
      value = param !== 'false';
    }

    if (attr === 'label') {
      param = params.slice(-1)[0];
      value = param !== 'false';
    }


    if (attr === 'url' && (value === 'true' || value === 'false' || value === undefined)) {
      value = '';
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
const kml = (userParamer) => {
  const userParameters = userParamer;
  let layersVar = [];

  if (isNullOrEmpty(userParameters)) {
    Exception(getValue('exception').no_param);
  }

  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layersVar = userParametersArray.map((userParam) => {
    let layerObj = {};

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

    const extract = getParameter({
      parameter: userParam,
      type: 'boolean',
      attr: 'extract',
    });

    const template = getParameter({
      parameter: userParam,
      type: 'string',
      attr: 'template',
    });

    const label = getParameter({
      parameter: userParam,
      type: 'boolean_eql',
      attr: 'label',
    });

    if (REGEXP_KML.test(userParam)) {
      layerObj = {
        type: LayerType.KML,
        name: name(REGEXP_KML, 1),
        url: url(REGEXP_KML, 2) + url(REGEXP_KML, 3),
        extract: extract(REGEXP_KML, 4),
        label: label(REGEXP_KML, 5),
        template: template(REGEXP_KML, 6),
      };
    } else {
      layerObj = {
        type: LayerType.KML,
        name: name(REGEXP_KML),
        url: url(REGEXP_KML),
        extract: extract(REGEXP_KML),
        label: label(REGEXP_KML),
        template: template(REGEXP_KML),
      };
    }

    return layerObj;
  });

  if (!isArray(userParameters)) {
    layersVar = layersVar[0];
  }

  return layersVar;
};

export default kml;
