/**
 * @module M/utils
 */

import chroma from 'chroma-js';
import reproj from 'impl/util/reprojection';
import getImplWMTSCapabilities from 'impl/util/GetCapabilities.js';
import { INCHES_PER_UNIT, DOTS_PER_INCH } from '../units.js';
import * as WKT from '../geom/WKT.js';
/**
 *
 * @function
 * @api
 */
export const isUndefined = (obj) => {
  return (typeof obj === 'undefined');
};

/**
 *
 * @function
 * @api
 */
export const isBoolean = (obj) => {
  let isBooleanParam = false;
  if (obj !== null && !isUndefined(obj)) {
    isBooleanParam = (typeof obj === 'boolean');
  }
  return isBooleanParam;
};

/**
 *
 * @function
 * @api
 */
export const isNull = (obj) => {
  let isNullParam = false;

  if (!isBoolean(obj) && typeof obj !== 'number') {
    if (isUndefined(obj)) {
      isNullParam = true;
    } else if (!obj) {
      isNullParam = true;
    } else if (obj === null) {
      isNullParam = true;
    }
  }

  return isNullParam;
};

/**
 *
 * @function
 * @api
 */
export const isArray = (obj) => {
  let isArrayParam = false;
  if (!isNull(obj)) {
    isArrayParam = (Object.prototype.toString.call(obj) === Object.prototype.toString.call([]));
  }
  return isArrayParam;
};

/**
 * This function checks if the obj is null or empty
 *
 * @function
 * @param {string|Object|Array<*>} obj
 * @returns {boolean}
 * @api
 */
export const isNullOrEmpty = (obj) => {
  let nullOrEmpty = false;

  if (isNull(obj)) {
    nullOrEmpty = true;
  } else if (isArray(obj)) {
    nullOrEmpty = true;
    if (obj.length > 0) {
      nullOrEmpty = !obj.some(objElem => !isNullOrEmpty(objElem));
    }
  } else if (typeof obj === 'string' && obj.trim()
    .length === 0) {
    nullOrEmpty = true;
  }

  return nullOrEmpty;
};

/**
 *
 * @function
 * @api
 */
export const isFunction = (obj) => {
  let isFunctionParam = false;
  if (!isNull(obj)) {
    isFunctionParam = (typeof obj === 'function' && !isUndefined(obj.call));
  }
  return isFunctionParam;
};

/**
 *
 * @function
 * @api
 */
export const isObject = (obj) => {
  let isObjectParam = false;
  if (!isNull(obj)) {
    isObjectParam = (typeof obj === 'object' && !isUndefined(obj.toString));
  }
  return isObjectParam;
};

/**
 *
 * @function
 * @api
 */
export const isString = (obj) => {
  let isStringParam = false;
  if (!isNull(obj)) {
    isStringParam = (typeof obj === 'string');
  }
  return isStringParam;
};

/**
 *
 * @function
 * @api
 */
export const isUrl = (obj) => {
  let isUrlParam = false;
  if (!isNull(obj) && isString(obj)) {
    isUrlParam = /(https?:\/\/[^*]+)/.test(obj);
  }
  return isUrlParam;
};


/**
 *
 * @function
 * @api
 */
export const normalize = (stringToNormalize, upperCase) => {
  let normalizedString = stringToNormalize;
  if (!isNullOrEmpty(normalizedString) && isString(normalizedString)) {
    normalizedString = normalizedString.trim();
    normalizedString = upperCase ?
      normalizedString.toUpperCase() :
      normalizedString.toLowerCase();
  }
  return normalizedString;
};

/**
 *
 * @function
 * @api
 */
export const getParameterValue = (paramName, url) => {
  let parameterValue = null;

  const paramNameVar = paramName
    .replace(/[[]/, '\\[')
    .replace(/[\]]/, '\\]');

  let parameters = url;
  const idxQuery = parameters.indexOf('?');
  if (idxQuery !== -1) {
    parameters = parameters.substring(idxQuery);
    const regex = new RegExp(`[\\?&]${paramNameVar}=([^&#]*)`);
    parameterValue = regex.exec(parameters);
    if (parameterValue !== null) {
      parameterValue = decodeURIComponent(parameterValue[1].replace(/\+/g, ' '));
    }
  }

  return parameterValue;
};

/**
 *
 * @function
 * @api
 */
export const addParameters = (url, params) => {
  let requestUrl = url;
  if (requestUrl.indexOf('?') === -1) {
    requestUrl += '?';
  } else if (requestUrl.charAt(requestUrl.length - 1) !== '?') {
    requestUrl += '&';
  }

  let requestParams = '';
  if (isObject(params)) {
    const keys = Object.keys(params);
    keys.forEach((key) => {
      const value = params[key];
      requestParams += key;
      requestParams += '=';
      requestParams += encodeURIComponent(value);
      requestParams += '&';
    });
    // removes the last '&'
    requestParams = requestParams.substring(0, requestParams.length - 1);
  } else if (isString(params)) {
    requestParams = params;
  }
  requestUrl += requestParams;

  return requestUrl;
};

/**
 *
 * @function
 * @api
 */
export const generateRandom = (prefix, sufix) => {
  let random = '';

  // adds prefix
  if (!isNullOrEmpty(prefix)) {
    random = prefix;
  }

  // generates random
  random = random
    .concat(Math.random())
    .replace(/0\./, '');

  // adds sufix
  if (!isNullOrEmpty(sufix)) {
    random = random.concat(sufix);
  }

  return random;
};

/**
 *
 * @function
 * @api
 */
export const getWMSGetCapabilitiesUrl = (serverUrl, version, ticket) => {
  let wmsGetCapabilitiesUrl = serverUrl;

  // request
  wmsGetCapabilitiesUrl = addParameters(wmsGetCapabilitiesUrl, 'request=GetCapabilities');
  // service
  wmsGetCapabilitiesUrl = addParameters(wmsGetCapabilitiesUrl, 'service=WMS');
  // capabilities
  if (isString(version)) {
    wmsGetCapabilitiesUrl = addParameters(wmsGetCapabilitiesUrl, {
      version,
    });
  }
  // ticket
  if (isString(ticket)) {
    wmsGetCapabilitiesUrl = addParameters(wmsGetCapabilitiesUrl, { ticket });
  }

  return wmsGetCapabilitiesUrl;
};

/**
 *
 * @function
 * @api
 */
export const getWMTSGetCapabilitiesUrl = (serverUrl, version) => {
  let wmtsGetCapabilitiesUrl = serverUrl;

  // request
  wmtsGetCapabilitiesUrl = addParameters(wmtsGetCapabilitiesUrl, 'request=GetCapabilities');
  // service
  wmtsGetCapabilitiesUrl = addParameters(wmtsGetCapabilitiesUrl, 'service=WMTS');
  // version
  if (!isNullOrEmpty(version)) {
    wmtsGetCapabilitiesUrl = addParameters(wmtsGetCapabilitiesUrl, {
      version,
    });
  }

  return wmtsGetCapabilitiesUrl;
};

/**
 * This function generates the resolution array
 * from min max resolutions
 *
 * @function
 * @param {Number} minResolution
 * @param {Number} maxResolution
 * @param {Number} numZoomLevels
 * @returns {Array<Number>} the resolutions
 * @api
 */
export const fillResolutions = (minResolutionParam, maxResolutionParam, numZoomLevels) => {
  let minResolution = minResolutionParam;
  let maxResolution = maxResolutionParam;
  const resolutions = new Array(numZoomLevels);

  minResolution = Number.parseFloat(minResolution);
  maxResolution = Number.parseFloat(maxResolution);

  // if maxResolution and minResolution are set, we calculate
  // the base for exponential scaling that starts at
  // maxResolution and ends at minResolution in numZoomLevels
  // steps.
  let base = 2;
  if (!Number.isNaN(minResolution)) {
    base = ((maxResolution / minResolution) ** (1 / (numZoomLevels - 1)));
  }
  for (let i = 0; i < numZoomLevels; i += 1) {
    resolutions[i] = maxResolution / (base ** i);
  }
  // sort resolutions array descendingly
  resolutions.sort((a, b) => {
    return (b - a);
  });
  return resolutions;
};

/**
 * This function calculates the resolution
 * for a provided scale
 *
 * @function
 * @param {Number} scale
 * @param {String} units
 * @returns {Number} the resolution for the specified scale
 * @api
 */
export const getResolutionFromScale = (scale, unitsParam) => {
  let units = unitsParam;
  let resolution;
  if (!isNullOrEmpty(scale)) {
    if (isNull(units)) {
      units = 'degrees';
    }
    // normalize scale
    const normScale = (scale > 1.0) ?
      (1.0 / scale) :
      scale;
    resolution = 1 / (normScale * INCHES_PER_UNIT[units] * DOTS_PER_INCH);
  }
  return resolution;
};

/**
 * This function generates the resolution array
 * from min max scales
 *
 * @function
 * @param {Number} maxScale
 * @param {Number} minScale
 * @param {Number} zoomLevels
 * @param {String} units
 * @returns {Array<Number>} the resolutions
 * @api
 */
export const generateResolutionsFromScales = (maxScale, minScale, zoomLevels, units) => {
  const minResolution = getResolutionFromScale(maxScale, units);
  const maxResolution = getResolutionFromScale(minScale, units);

  return fillResolutions(minResolution, maxResolution, zoomLevels);
};

/**
 * This function generates the resolution array
 * from min max scales
 *
 * @function
 * @param {Number} maxScale
 * @param {Number} minScale
 * @param {Number} zoomLevels
 * @param {String} units
 * @returns {Array<Number>} the resolutions
 * @api
 */
export const generateResolutionsFromExtent = (extentParam, size, zoomLevels, units) => {
  let extent = extentParam;
  let [wExtent, hExtent] = [null, null];
  if (isArray(extent)) {
    wExtent = (extent[2] - extent[0]);
    hExtent = (extent[3] - extent[1]);
  } else if (isObject(extent)) {
    wExtent = (extent.x.max - extent.x.min);
    hExtent = (extent.y.max - extent.y.min);
  } else if (isString(extent)) {
    extent = extent.split(',');
    wExtent = (extent[2] - extent[0]);
    hExtent = (extent[3] - extent[1]);
  }
  const wResolution = wExtent / size[0];
  const hResolution = hExtent / size[1];

  const maxResolution = Math.max(wResolution, hResolution);

  const resolutions = fillResolutions(null, maxResolution, zoomLevels);

  return resolutions;
};

/**
 * This function calculates the scale
 * for a provided resolution
 *
 * @function
 * @param {Number} resolution
 * @param {String} units
 * @returns {Number} the scale for the specified resolution
 * @api
 */
export const getScaleFromResolution = (resolution, unitsParam) => {
  let units = unitsParam;
  if (isNullOrEmpty(units)) {
    units = 'degrees';
  }

  const scale = resolution * INCHES_PER_UNIT[units] * DOTS_PER_INCH;

  return scale;
};

/**
 *
 * @function
 * @api
 */
export const stringToHtml = (htmlTxt) => {
  let html;

  if (!isNullOrEmpty(htmlTxt)) {
    const div = document.createElement('div');
    div.innerHTML = htmlTxt;
    html = div.children[0];
  }

  return html;
};

/**
 *
 * @function
 * @api
 */
export const htmlToString = (html) => {
  let text;

  if (!isNullOrEmpty(html)) {
    const div = document.createElement('div');
    div.appendChild(html);
    text = div.innerHTML;
  }

  return text;
};

/**
 * formated String
 *
 * @function
 * @param {String} String text to format string
 * @returns {String} beautifyString formated String
 * @api
 */
export const beautifyString = (text) => {
  let beautifyStringParam;

  // 1 to lower case
  beautifyStringParam = text.toLowerCase();

  // 2 trim
  beautifyStringParam = beautifyStringParam.trim(beautifyStringParam);

  // 3 first char to upper case
  beautifyStringParam = beautifyStringParam
    .charAt(0)
    .toUpperCase() + beautifyStringParam.slice(1);

  // 4 replaces '_' by spaces
  beautifyStringParam = beautifyStringParam.replace(/_/g, ' ');

  // 5 simplifies spaces
  beautifyStringParam = beautifyStringParam.replace(/\s+/, ' ');

  // 6 to camel case
  beautifyStringParam = beautifyStringParam.replace(/(\s\w)+/g, (match) => {
    return match.toUpperCase();
  });

  // 7 common words to lower case
  beautifyStringParam = beautifyStringParam.replace(/\s+(de|del|las?|el|los?|un|unas?|unos?|y|a|al|en)\s+/ig, (match) => {
    return match.toLowerCase();
  });

  return beautifyStringParam;
};

/**
 * formated String
 *
 * @function
 * @param {attributeName} String
 * @returns {Number} formated String
 * @api
 */
export const beautifyAttribute = (attributeName) => {
  let beautifyStringParam = attributeName;

  if (beautifyStringParam) {
    // OpenLayers.String.trim
    beautifyStringParam = beautifyStringParam.trim();
    if (beautifyStringParam.length > 0) {
      let idxPoints = beautifyStringParam.indexOf(':');
      if (idxPoints !== -1) {
        idxPoints += 1;
        beautifyStringParam = beautifyStringParam.substring(idxPoints, beautifyStringParam.length);
      }
    }
  }
  return beautifyStringParam;
};

/**
 * formated String
 *
 * @function
 * @param {attributeName} String
 * @returns {Number} formated String
 * @api
 */
export const beautifyAttributeName = (rawAttributeName) => {
  let attributeName = normalize(rawAttributeName);
  attributeName = attributeName.replace(/_(\w)/g, (match, group) => {
    return ' '.concat(group.toUpperCase());
  });
  attributeName = attributeName.replace(/^\w/, (match) => {
    return match.toUpperCase();
  });
  return attributeName;
};

/**
 * formated String
 *
 * @function
 * @param {attributeName} String
 * @returns {Number} formated String
 * @api
 */
export const concatUrlPaths = (paths) => {
  let finalUrl = null;
  if (!isNullOrEmpty(paths)) {
    finalUrl = paths[0];
    finalUrl = finalUrl.replace(/\/+\s*$/, '');
    for (let i = 1, ilen = paths.length; i < ilen; i += 1) {
      const path = paths[i];
      if (path.indexOf('/') !== 0) {
        finalUrl = finalUrl.concat('/');
      }
      finalUrl = finalUrl.concat(path);
    }
  }
  return finalUrl;
};

/**
 *
 *
 * @function
 * @api
 */
export const includes = (array, searchElement, fromIndex) => {
  const O = Object(array);
  const len = parseInt(O.length, 10) || 0;
  if (len === 0) {
    return false;
  }
  const n = parseInt(fromIndex, 10) || 0;
  let k;
  if (n >= 0) {
    k = n;
  } else {
    k = len + n;
    if (k < 0) {
      k = 0;
    }
  }
  let currentElement;
  while (k < len) {
    currentElement = O[k];
    if (searchElement === currentElement || Object.equals(searchElement, currentElement)) {
      return true;
    }
    k += 1;
  }
  return false;
};

/**
 *
 *
 * @function
 * @api
 */
export const extend = (targetParam, source, override) => {
  const target = targetParam;
  Object.keys(source).forEach((key) => {
    if (isUndefined(target[key])) {
      target[key] = source[key];
    } else if (Object.getPrototypeOf(target[key]) === Object.prototype) {
      extend(target[key], source[key], override);
    } else if ((override === true)) {
      target[key] = source[key];
    }
  });

  return target;
};

/**
 * TODO
 *
 * @function
 * @api
 */
export const escapeXSS = (xssValue) => {
  let validValue;

  // & --> &amp;
  validValue = xssValue.replace(/&/g, '&amp;');

  // < --> &lt;
  validValue = validValue.replace(/</g, '&lt;');

  // > --> &gt;
  validValue = validValue.replace(/>/g, '&gt;');

  // ' --> &quot;
  validValue = validValue.replace(/'/g, '&quot;');

  // ' --> &#x27;
  validValue = validValue.replace(/'/g, '&#x27;');

  // / --> &#x2F;
  validValue = validValue.replace(/\//g, '&#x2F;');

  return validValue;
};

/**
 * TODO
 *
 * @function
 * @api
 */
export const escapeJSCode = (jsCode) => {
  let validValue;

  validValue = jsCode.replace(/(<\s*script[^>]*>)+[^<]*(<\s*\/\s*script[^>]*>)+/ig, '');
  validValue = validValue.replace(/(('|')\s*\+\s*)?\s*eval\s*\(.*\)\s*(\+\s*('|'))?/ig, '');

  return validValue;
};

/**
 * TODO
 *
 * @function
 * @api
 */
export const enableTouchScroll = (elem) => {
  const elemParam = elem;
  if ('ontouchstart' in document) {
    let scrollStartPos = 0;

    elemParam.addEventListener('touchstart', (evt) => {
      scrollStartPos = elemParam.scrollTop + evt.touches[0].pageY;
    });

    elemParam.addEventListener('touchmove', (evt) => {
      elemParam.scrollTop = scrollStartPos - evt.touches[0].pageY;
    });
  }
};

/**
 * TODO
 *
 * @function
 * @api
 */
export const rgbToHex = (rgbColor) => {
  let hexColor;
  try {
    hexColor = chroma(rgbColor)
      .hex();
  } catch (err) {
    throw err;
  }
  return hexColor;
};

/**
 * TODO
 *
 * @function
 * @api
 */
export const rgbaToHex = (rgbaColor) => {
  let hexColor;
  try {
    hexColor = chroma(rgbaColor)
      .hex();
  } catch (err) {
    throw err;
  }
  return hexColor;
};

/**
 * TODO
 *
 * @function
 * @api
 */
export const getOpacityFromRgba = (rgbaColor) => {
  let opacity;

  const rgbaRegExp = /^rgba\s*\((\s*\d+\s*,){3}\s*([\d.]+)\s*\)$/;
  if (rgbaRegExp.test(rgbaColor)) {
    opacity = rgbaColor.replace(rgbaRegExp, '$2');
    try {
      opacity = parseFloat(opacity);
    } catch (err) {
      throw err;
    }
  }

  return opacity;
};

/**
 * TODO
 *
 * @function
 * @api
 */
export const sameUrl = (url1, url2) => {
  const url1Var = url1
    .replace(/^(.+)\/$/, '$1')
    .replace(/^(.+)\?$/, '$1');
  const url2Var = url2
    .replace(/^(.+)\/$/, '$1')
    .replace(/^(.+)\?$/, '$1');

  return url1Var.toLowerCase() === url2Var.toLowerCase();
};

/**
 * TODO
 *
 * @function
 * @api
 */
export const isGeometryType = (type) => {
  const geometricTypes = [
    WKT.GEOMETRY.toLowerCase(),
    'GeometryPropertyType'.toLowerCase(),
    WKT.POINT.toLowerCase(),
    WKT.LINE_STRING.toLowerCase(),
    WKT.LINEAR_RING.toLowerCase(),
    WKT.POLYGON.toLowerCase(),
    WKT.MULTI_POINT.toLowerCase(),
    WKT.MULTI_LINE_STRING.toLowerCase(),
    WKT.MULTI_POLYGON.toLowerCase(),
    WKT.GEOMETRY_COLLECTION.toLowerCase(),
    WKT.CIRCLE.toLowerCase(),
    'pointpropertytype',
    'polygonpropertytype',
    'linestringpropertytype',
    'geometrypropertytype',
    'multisurfacepropertytype',
    'multilinestringpropertytype',
    'surfacepropertytype',
    'geometrypropertytype',
    'geometryarraypropertytype',
    'multigeometrypropertytype',
    'multipolygonpropertytype',
    'multipointpropertytype',
    'abstractgeometricaggregatetype',
    'pointarraypropertytype',
    'curvearraypropertytype',
    'solidpropertytype',
    'solidarraypropertytype',
  ];
  const typeVar = type.toLowerCase();
  return (geometricTypes.indexOf(typeVar) !== -1);
};

/**
 * This function decodes html entities into
 * text
 *
 * @function
 * @param {String} encodedHtml encoded text with HTML entities
 * @returns {String} text decoded
 * @api
 */
export const decodeHtml = (encodedHtml) => {
  const txtarea = document.createElement('textarea');
  txtarea.innerHTML = encodedHtml;
  return txtarea.value;
};

/**
 * This function gets text content from
 * an html string or element
 *
 * @function
 * @param {HTMLElement | String} html string or element with HTML tags
 * @returns {String} text contained by the HTML tags
 * @api
 */
export const getTextFromHtml = (html) => {
  let htmlText = html;
  if (!isString(html) && html.outerHTML) {
    htmlText = html.outerHTML;
  }
  const divElement = document.createElement('DIV');
  divElement.innerHTML = htmlText;
  return divElement.textContent || divElement.innerText || '';
};

/**
 * This function gets an array scale color in hexadecimal format
 * @function
 * @public
 * @return {Array<string>} array scale color in hexadecimal format
 * @api
 */
export const generateColorScale = (color1, color2, numberClasses) => {
  return chroma.scale([color1, color2])
    .colors(numberClasses);
};

/**
 * This function gets the inverse of a color. The inverse of a color
 * is the diff between the hexadecimal value of white (0xFFFFFF)
 * and the hexadecimal value of the color.
 * @function
 * @public
 * @param {string} color
 * @return {string} inverse color in hexadecimal format
 * @api
 */
export const inverseColor = (color) => {
  let inverseColorParam;
  if (isString(color)) {
    let hexColor = chroma(color)
      .hex();
    hexColor = hexColor.replace(/^#/, '0x');
    inverseColorParam = chroma(0xFFFFFF - hexColor)
      .hex();
  }

  return inverseColorParam;
};

/**
 * This function returns a color as string with opacity
 * @function
 * @public
 * @param {string} color
 * @param {number} opacity
 * @return {string}
 * @api
 */
export const getRgba = (color, opacity) => {
  return chroma(color)
    .alpha(opacity)
    .css();
};

/**
 * This function returns if two sets are equals
 * @function
 * @public
 * @param {array} array
 * @param {array} array2
 * @return {bool}
 * @api
 */
export const setEquals = (array, array2) => {
  let equals = false;
  if (array.length === array2.length) {
    equals = array.every(e => array2.some(e2 => e2.equals(e)));
  }
  return equals;
};

/**
 * This function set implementation of this control
 *
 * @public
 * @function
 * @param {M.Map} impl to add the plugin
 * @api
 */
export const extendsObj = (destParam = {}, src = {}) => {
  const dest = destParam;
  if (!isNullOrEmpty(src)) {
    Object.keys(src).forEach((key) => {
      let value = src[key];
      if (isArray(value)) {
        value = [...value];
      } else if (isObject(value)) {
        value = extendsObj({}, value);
      }
      if (isNullOrEmpty(dest[key])) {
        dest[key] = value;
      } else if (isObject(dest[key])) {
        extendsObj(dest[key], value);
      }
    });
  }
  return dest;
};

/**
 * This function returns an array whith breaks between head and tail of an array
 * @function
 * @public
 * @param {array} array
 * @param {number} breaks
 * @return {array}
 * @api
 */
export const generateIntervals = (array, breaks) => {
  let intervals = [...array];
  if (array.length < breaks) {
    const step = (array[0] + array[1]) / (breaks - 1);
    for (let i = 1; i < breaks - 1; i += 1) {
      intervals[i] = step * i;
    }
    intervals = [...intervals, array[1]];
  }
  return intervals;
};

/**
 * This functions returns the order style
 * @function
 * @public
 * @param {M.Style}
 * @return {number}
 * @api
 */
export const styleComparator = (style, style2) => {
  return style.ORDER - style2.ORDER;
};

/**
 * This functions returns the width and height of a image from src
 * @function
 * @public
 * @param {string} url
 * @return {Array<number>}
 * @api
 */
export const getImageSize = (url) => {
  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.src = url;
  });
};

/**
 * This functions replaces functions into string
 * @function
 * @public
 * @param {object} objParam
 * @return {obj}
 * @api
 */
export const stringifyFunctions = (objParam) => {
  let obj;
  if (isArray(objParam)) {
    obj = [...objParam];
    obj = obj.map(stringifyFunctions);
  } else if (isObject(objParam)) {
    obj = extendsObj({}, objParam);
    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      if (isFunction(val)) {
        obj[key] = `{{f}}${val.toString()}`;
      } else if (isObject(val)) {
        obj[key] = stringifyFunctions(val);
      }
    });
  } else if (isFunction(objParam)) {
    obj = `{{f}}${objParam.toString()}`;
  } else {
    obj = objParam;
  }
  return obj;
};

/**
 * This functions replaces functions into string
 * @function
 * @public
 * @param {object} objParam
 * @return {obj}
 * @api
 */
export const defineFunctionFromString = (objParam) => {
  let obj = objParam;
  if (/^\{\{f\}\}/.test(objParam)) {
    const functionStr = objParam.replace(/^\{\{f\}\}(.+)/, '$1');
    /* eslint-disable */
    obj = new Function('f', `return ${functionStr}`)();
  } else {
    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      if (/^\{\{f\}\}/.test(val)) {
        const functionStr = val.replace(/^\{\{f\}\}(.+)/, '$1');
        /* eslint-disable */
        obj[key] = new Function('f', `return ${functionStr}`)();
        /* eslint-enable */
      } else if (isObject(val)) {
        defineFunctionFromString(val);
      }
    });
  }
  return obj;
};

/**
 * TODO
 */
export const classToggle = (htmlElement, className) => {
  const classList = htmlElement.classList;
  if (classList.contains(className)) {
    classList.remove(className);
  } else {
    classList.add(className);
  }
};

/**
 * TODO
 */
export const replaceNode = (newNode, oldNode) => {
  const parent = oldNode.parentNode;
  if (parent) {
    parent.replaceChild(newNode, oldNode);
  }
};

/**
 * This function removes de html element of control
 *
 * @private
 * @function
 */
export const removeHTML = (element) => {
  if (element) {
    const parent = element.parentElement;
    if (parent) {
      parent.removeChild(element);
    }
  }
};

/**
 * This function returns true if some object value is function or '{{*}}'
 * @function
 * @public
 * @param {object} obj
 * @return {bool}
 * @api
 */
export const isDynamic = (obj) => {
  let flag = false;
  if (!Array.isArray(obj) && typeof obj === 'object' && !isNullOrEmpty(obj)) {
    flag = Object.values(obj).some(val => isDynamic(val));
  } else if (typeof obj === 'function' || (typeof obj === 'string' && /\{\{.*\}\}/.test(obj))) {
    flag = true;
  }
  return flag;
};

/**
 * This parameter represent the base64 src image of the dynamic legend
 * @const
 * @type {string}
 */
let dynamicLegend = 'data:image/jpeg;base64,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';

/**
 * This functions sets the dynamic legend constant
 * @function
 * @public
 * @api
 */
export const setDynamicLegend = (legend) => {
  dynamicLegend = legend;
};

/**
 * This function draw in a canvas style which is dynamic
 * @function
 * @public
 * @param {object} obj
 * @return {bool}
 * @api
 */
export const drawDynamicStyle = (canvas) => {
  return dynamicLegend;
};

/**
 * This function calculates the envolved extent
 * from extents provided by the user
 * @function
 * @public
 * @param {Array<Array<Number>>} extents
 * @return {Array<Number>}
 * @api
 */
export const getEnvolvedExtent = (extents) => {
  let envolvedExtent = null;

  if (!isNullOrEmpty(extents)) {
    envolvedExtent = [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ];
    extents.forEach((extent) => {
      if (!isNullOrEmpty(extent)) {
        envolvedExtent[0] = Math.min(envolvedExtent[0], extent[0]);
        envolvedExtent[1] = Math.min(envolvedExtent[1], extent[1]);
        envolvedExtent[2] = Math.max(envolvedExtent[2], extent[2]);
        envolvedExtent[3] = Math.max(envolvedExtent[3], extent[3]);
      }
    });
  }

  return envolvedExtent;
};


/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @function
 * @public
 * @returns {String}
 * @api
 */
export const getSystem = () => {
  const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;
  let env = 'unknown';
  if (/android/i.test(userAgent)) {
    env = 'android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    env = 'ios';
  }

  return env;
};

/**
 * @function
 * @public
 * @param {String| URLLike} url
 * @returns {Promise}
 */
export const getWMTSCapabilities = (url) => {
  return getImplWMTSCapabilities(url);
};

/**
 * @private
 * @function
 * @param {ProjectionLike} sourceProj
 * @param {ProjectionLike} destProj
 * @param {coordinates} coordinates - 1-dimensional array of two coordinates
 *
 */
export const reproject = (coordinates, sourceProj, destProj) => {
  return reproj(coordinates, sourceProj, destProj);
};


/**
 * @private
 * @function
 * @param {Uint8Array} bytes
 */
export const bytesToBase64 = (bytes, format = 'image/png') => {
  const base64abc = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/',
  ];

  let result = '';
  let i;
  const l = bytes.length;
  for (i = 2; i < l; i += 3) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)];
    result += base64abc[bytes[i] & 0x3F];
  }
  if (i === l + 1) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 0x03) << 4];
    result += '==';
  }
  if (i === l) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[(bytes[i - 1] & 0x0F) << 2];
    result += '=';
  }
  return `data:${format};base64,${result}`;
};
