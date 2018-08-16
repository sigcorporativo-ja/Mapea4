/**
 * @module M/utils
 */

import chroma from 'chroma-js';
import { INCHES_PER_UNIT, DOTS_PER_INCH } from '../units';
import WKT from '../geom/WKT';

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
export const getWMSGetCapabilitiesUrl = (serverUrl, version) => {
  let wmsGetCapabilitiesUrl = serverUrl;

  // request
  wmsGetCapabilitiesUrl = addParameters(wmsGetCapabilitiesUrl, 'request=GetCapabilities');
  // service
  wmsGetCapabilitiesUrl = addParameters(wmsGetCapabilitiesUrl, 'service=WMS');

  // PATCH: En mapea 3 no se manda luego aquí tampoco. Hay servicios que dan error....
  //       version
  //      wmsGetCapabilitiesUrl = addParameters(wmsGetCapabilitiesUrl, {
  //         'version': version
  //      });

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
    } else if (isObject(target[key])) {
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
  if ('ontouchstart' in document) {
    let scrollStartPos = 0;

    elem.addEventListener('touchstart', (evt) => {
      scrollStartPos = this.scrollTop + evt
        .getBrowserEvent()
        .touches[0]
        .pageY;
    });

    elem.addEventListener('touchmove', (evt) => {
      this.scrollTop = scrollStartPos - evt
        .getBrowserEvent()
        .touches[0]
        .pageY;
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
    WKT.type.GEOMETRY.toLowerCase(),
    'GeometryPropertyType'.toLowerCase(),
    WKT.type.POINT.toLowerCase(),
    WKT.type.LINE_STRING.toLowerCase(),
    WKT.type.LINEAR_RING.toLowerCase(),
    WKT.type.POLYGON.toLowerCase(),
    WKT.type.MULTI_POINT.toLowerCase(),
    WKT.type.MULTI_LINE_STRING.toLowerCase(),
    WKT.type.MULTI_POLYGON.toLowerCase(),
    WKT.type.GEOMETRY_COLLECTION.toLowerCase(),
    WKT.type.CIRCLE.toLowerCase(),
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
