import chroma from 'chroma-js';
import WKT from '../geom/WKT';
import { INCHES_PER_UNIT, DOTS_PER_INCH } from '../Mapea';

// import StylePoint from '../style/Point';
// import StyleLine from '../style/Line';
// import StylePolygon from '../style/Polygon';

import './polyfills';


/**
 * @namespace Utils
 */
export default class Utils {
  /**
   * This function checks if the obj is null or empty
   *
   * @function
   * @param {string|Object|Array<*>} obj
   * @returns {boolean}
   * @api stable
   */
  static isNullOrEmpty(obj) {
    let nullOrEmpty = false;

    if (Utils.isNull(obj)) {
      nullOrEmpty = true;
    }
    else if (Utils.isArray(obj)) {
      nullOrEmpty = true;
      if (obj.length > 0) {
        nullOrEmpty = !obj.some(objElem => !Utils.isNullOrEmpty(objElem));
      }
    }
    else if (typeof obj === 'string' && obj.trim().length === 0) {
      nullOrEmpty = true;
    }

    return nullOrEmpty;
  }

  /**
   *
   * @function
   * @api stable
   */
  static isNull(obj) {
    let isNull = false;

    if (!Utils.isBoolean(obj) && typeof obj !== 'number') {
      if (Utils.isUndefined(obj)) {
        isNull = true;
      }
      else if (!obj) {
        isNull = true;
      }
      else if (obj === null) {
        isNull = true;
      }
    }

    return isNull;
  }

  /**
   *
   * @function
   * @api stable
   */
  static isArray(obj) {
    let isArray = false;
    if (!Utils.isNull(obj)) {
      isArray = (Object.prototype.toString.call(obj) === Object.prototype.toString
        .call([]));
    }
    return isArray;
  }

  /**
   *
   * @function
   * @api stable
   */
  static isFunction(obj) {
    let isFunction = false;
    if (!Utils.isNull(obj)) {
      isFunction = (typeof obj === 'function' && !Utils.isUndefined(obj.call));
    }
    return isFunction;
  }

  /**
   *
   * @function
   * @api stable
   */
  static isObject(obj) {
    let isObject = false;
    if (!Utils.isNull(obj)) {
      isObject = (typeof obj === 'object' && !Utils.isUndefined(obj.toString));
    }
    return isObject;
  }

  /**
   *
   * @function
   * @api stable
   */
  static isString(obj) {
    let isString = false;
    if (!Utils.isNull(obj)) {
      isString = (typeof obj === 'string');
    }
    return isString;
  }

  /**
   *
   * @function
   * @api stable
   */
  static isBoolean(obj) {
    let isBoolean = false;
    if (obj !== null && !Utils.isUndefined(obj)) {
      isBoolean = (typeof obj === 'boolean');
    }
    return isBoolean;
  }

  /**
   *
   * @function
   * @api stable
   */
  static isUrl(obj) {
    let isUrl = false;
    if (!Utils.isNull(obj) && Utils.isString(obj)) {
      isUrl = /(https?:\/\/[^*]+)/.test(obj);
    }
    return isUrl;
  }

  /**
   *
   * @function
   * @api stable
   */
  static isUndefined(obj) {
    return (typeof obj === 'undefined');
  }

  /**
   *
   * @function
   * @api stable
   */
  static normalize(stringToNormalize, upperCase) {
    let normalizedString = stringToNormalize;
    if (!Utils.isNullOrEmpty(normalizedString) && Utils.isString(normalizedString)) {
      normalizedString = normalizedString.trim();
      normalizedString = upperCase ?
        normalizedString.toUpperCase() : normalizedString.toLowerCase();
    }
    return normalizedString;
  }

  /**
   *
   * @function
   * @api stable
   */
  static getParameterValue(paramName, url) {
    let parameterValue = null;

    const paramNameVar = paramName.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');

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
  }

  /**
   *
   * @function
   * @api stable
   */
  static addParameters(url, params) {
    let requestUrl = url;
    if (requestUrl.indexOf('?') === -1) {
      requestUrl += '?';
    }
    else if (requestUrl.charAt(requestUrl.length - 1) !== '?') {
      requestUrl += '&';
    }

    let requestParams = '';
    if (Utils.isObject(params)) {
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
    }
    else if (Utils.isString(params)) {
      requestParams = params;
    }
    requestUrl += requestParams;

    return requestUrl;
  }

  /**
   *
   * @function
   * @api stable
   */
  static generateRandom(prefix, sufix) {
    let random = '';

    // adds prefix
    if (!Utils.isNullOrEmpty(prefix)) {
      random = prefix;
    }

    // generates random
    random = random.concat(Math.random()).replace(/0\./, '');

    // adds sufix
    if (!Utils.isNullOrEmpty(sufix)) {
      random = random.concat(sufix);
    }

    return random;
  }

  /**
   *
   * @function
   * @api stable
   */
  static getWMSGetCapabilitiesUrl(serverUrl, version) {
    let wmsGetCapabilitiesUrl = serverUrl;

    // request
    wmsGetCapabilitiesUrl = Utils.addParameters(wmsGetCapabilitiesUrl, 'request=GetCapabilities');
    // service
    wmsGetCapabilitiesUrl = Utils.addParameters(wmsGetCapabilitiesUrl, 'service=WMS');

    // PATCH: En mapea 3 no se manda luego aquí tampoco. Hay servicios que dan error....
    //      // version
    //      wmsGetCapabilitiesUrl = Utils.addParameters(wmsGetCapabilitiesUrl, {
    //         'version': version
    //      });

    return wmsGetCapabilitiesUrl;
  }

  /**
   *
   * @function
   * @api stable
   */
  static getWMTSGetCapabilitiesUrl(serverUrl, version) {
    let wmtsGetCapabilitiesUrl = serverUrl;

    // request
    wmtsGetCapabilitiesUrl = Utils.addParameters(wmtsGetCapabilitiesUrl, 'request=GetCapabilities');
    // service
    wmtsGetCapabilitiesUrl = Utils.addParameters(wmtsGetCapabilitiesUrl, 'service=WMTS');
    // version
    if (!Utils.isNullOrEmpty(version)) {
      wmtsGetCapabilitiesUrl = Utils.addParameters(wmtsGetCapabilitiesUrl, {
        version,
      });
    }

    return wmtsGetCapabilitiesUrl;
  }

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
   * @api stable
   */
  static generateResolutionsFromScales(maxScale, minScale, zoomLevels, units) {
    const minResolution = Utils.getResolutionFromScale(maxScale, units);
    const maxResolution = Utils.getResolutionFromScale(minScale, units);

    return Utils.fillResolutions(minResolution, maxResolution, zoomLevels);
  }

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
   * @api stable
   */
  static generateResolutionsFromExtent(extentParam, size, zoomLevels, units) {
    let extent = extentParam;
    let [wExtent, hExtent] = [null, null];
    if (Utils.isArray(extent)) {
      wExtent = (extent[2] - extent[0]);
      hExtent = (extent[3] - extent[1]);
    }
    else if (Utils.isObject(extent)) {
      wExtent = (extent.x.max - extent.x.min);
      hExtent = (extent.y.max - extent.y.min);
    }
    else if (Utils.isString(extent)) {
      extent = extent.split(',');
      wExtent = (extent[2] - extent[0]);
      hExtent = (extent[3] - extent[1]);
    }
    const wResolution = wExtent / size[0];
    const hResolution = hExtent / size[1];

    const maxResolution = Math.max(wResolution, hResolution);

    const resolutions = Utils.fillResolutions(null, maxResolution, zoomLevels);

    return resolutions;
  }

  /**
   * This function generates the resolution array
   * from min max resolutions
   *
   * @function
   * @param {Number} minResolution
   * @param {Number} maxResolution
   * @param {Number} numZoomLevels
   * @returns {Array<Number>} the resolutions
   * @api stable
   */
  static fillResolutions(minResolutionParam, maxResolutionParam, numZoomLevels) {
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
  }
  /**
   * This function calculates the resolution
   * for a provided scale
   *
   * @function
   * @param {Number} scale
   * @param {String} units
   * @returns {Number} the resolution for the specified scale
   * @api stable
   */
  static getResolutionFromScale(scale, unitsParam) {
    let units = unitsParam;
    let resolution;
    if (!Utils.isNullOrEmpty(scale)) {
      if (Utils.isNull(units)) {
        units = 'degrees';
      }
      // normalize scale
      const normScale = (scale > 1.0) ? (1.0 / scale) : scale;
      resolution = 1 / (normScale * INCHES_PER_UNIT[units] * DOTS_PER_INCH);
    }
    return resolution;
  }

  /**
   * This function calculates the scale
   * for a provided resolution
   *
   * @function
   * @param {Number} resolution
   * @param {String} units
   * @returns {Number} the scale for the specified resolution
   * @api stable
   */
  static getScaleFromResolution(resolution, unitsParam) {
    let units = unitsParam;
    if (Utils.isNullOrEmpty(units)) {
      units = 'degrees';
    }

    const scale = resolution * INCHES_PER_UNIT[units] * DOTS_PER_INCH;

    return scale;
  }

  /**
   *
   * @function
   * @api stable
   */
  static stringToHtml(htmlTxt) {
    let html;

    if (!Utils.isNullOrEmpty(htmlTxt)) {
      const div = document.createElement('div');
      div.innerHTML = htmlTxt;
      html = div.children[0];
    }

    return html;
  }

  /**
   *
   * @function
   * @api stable
   */
  static htmlToString(html) {
    let text;

    if (!Utils.isNullOrEmpty(html)) {
      const div = document.createElement('div');
      div.appendChild(html);
      text = div.innerHTML;
    }

    return text;
  }

  /**
   * formated String
   *
   * @function
   * @param {String} String text to format string
   * @returns {String} beautifyString formated String
   * @api stable
   */
  static beautifyString(text) {
    let beautifyString;

    // 1 to lower case
    beautifyString = text.toLowerCase();

    // 2 trim
    beautifyString = beautifyString.trim(beautifyString);

    // 3 first char to upper case
    beautifyString = beautifyString.charAt(0).toUpperCase() + beautifyString.slice(1);

    // 4 replaces '_' by spaces
    beautifyString = beautifyString.replace(/_/g, ' ');

    // 5 simplifies spaces
    beautifyString = beautifyString.replace(/\s+/, ' ');

    // 6 to camel case
    beautifyString = beautifyString.replace(/(\s\w)+/g, (match) => {
      return match.toUpperCase();
    });

    // 7 common words to lower case
    beautifyString = beautifyString.replace(/\s+(de|del|las?|el|los?|un|unas?|unos?|y|a|al|en)\s+/ig, (match) => {
      return match.toLowerCase();
    });

    return beautifyString;
  }


  /**
   * formated String
   *
   * @function
   * @param {attributeName} String
   * @returns {Number} formated String
   * @api stable
   */
  static beautifyAttribute(attributeName) {
    let beautifyString = attributeName;

    if (beautifyString) {
      // OpenLayers.String.trim
      beautifyString = beautifyString.trim();
      if (beautifyString.length > 0) {
        let idxPoints = beautifyString.indexOf(':');
        if (idxPoints !== -1) {
          idxPoints += 1;
          beautifyString = beautifyString.substring(idxPoints, beautifyString.length);
        }
      }
    }
    return beautifyString;
  }

  /**
   * formated String
   *
   * @function
   * @param {attributeName} String
   * @returns {Number} formated String
   * @api stable
   */
  static beautifyAttributeName(rawAttributeName) {
    let attributeName = Utils.normalize(rawAttributeName);
    attributeName = attributeName.replace(/_(\w)/g, (match, group) => {
      return ' '.concat(group.toUpperCase());
    });
    attributeName = attributeName.replace(/^\w/, (match) => {
      return match.toUpperCase();
    });
    return attributeName;
  }

  /**
   * formated String
   *
   * @function
   * @param {attributeName} String
   * @returns {Number} formated String
   * @api stable
   */
  static concatUrlPaths(paths) {
    let finalUrl = null;
    if (!Utils.isNullOrEmpty(paths)) {
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
  }

  /**
   *
   *
   * @function
   * @api stable
   */
  static includes(array, searchElement, fromIndex) {
    const O = Object(array);
    const len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false;
    }
    const n = parseInt(fromIndex, 10) || 0;
    let k;
    if (n >= 0) {
      k = n;
    }
    else {
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
  }

  /**
   *
   *
   * @function
   * @api stable
   */
  /* eslint-disable */
  static extend(target, source, override) {
    Object.keys(source).forEach((key) => {
      if (Utils.isUndefined(target[key])) {
        target[key] = source[key];
      }
      else if (Utils.isObject(target[key])) {
        Utils.extend(target[key], source[key], override);
      }
      else if ((override === true)) {
        target[key] = source[key];
      }
    });

    return target;
  }
  /* eslint-enable */
  /**
   * TODO
   *
   * @function
   * @api stable
   */
  static escapeXSS(xssValue) {
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
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  static escapeJSCode(jsCode) {
    let validValue;

    validValue = jsCode.replace(/(<\s*script[^>]*>)+[^<]*(<\s*\/\s*script[^>]*>)+/ig, '');
    validValue = validValue.replace(/(('|')\s*\+\s*)?\s*eval\s*\(.*\)\s*(\+\s*('|'))?/ig, '');

    return validValue;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  static enableTouchScroll(elem) {
    if ('ontouchstart' in document) {
      let scrollStartPos = 0;

      elem.addEventListener('touchstart', (evt) => {
        scrollStartPos = this.scrollTop + evt.getBrowserEvent().touches[0].pageY;
      });

      elem.addEventListener('touchmove', (evt) => {
        this.scrollTop = scrollStartPos - evt.getBrowserEvent().touches[0].pageY;
      });
    }
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  static rgbToHex(rgbColor) {
    let hexColor;
    try {
      hexColor = chroma(rgbColor).hex();
    }
    catch (err) {
      throw err;
    }
    return hexColor;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  static rgbaToHex(rgbaColor) {
    let hexColor;
    try {
      hexColor = chroma(rgbaColor).hex();
    }
    catch (err) {
      throw err;
    }
    return hexColor;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  static getOpacityFromRgba(rgbaColor) {
    let opacity;

    const rgbaRegExp = /^rgba\s*\((\s*\d+\s*,){3}\s*([\d.]+)\s*\)$/;
    if (rgbaRegExp.test(rgbaColor)) {
      opacity = rgbaColor.replace(rgbaRegExp, '$2');
      try {
        opacity = parseFloat(opacity);
      }
      catch (err) {
        throw err;
      }
    }

    return opacity;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  static sameUrl(url1, url2) {
    const url1Var = url1.replace(/^(.+)\/$/, '$1').replace(/^(.+)\?$/, '$1');
    const url2Var = url2.replace(/^(.+)\/$/, '$1').replace(/^(.+)\?$/, '$1');

    return url1Var.toLowerCase() === url2Var.toLowerCase();
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  static isGeometryType(type) {
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
  }

  /**
   * This function decodes html entities into
   * text
   *
   * @function
   * @param {String} encodedHtml encoded text with HTML entities
   * @returns {String} text decoded
   * @api stable
   */
  static decodeHtml(encodedHtml) {
    const txtarea = document.createElement('textarea');
    txtarea.innerHTML = encodedHtml;
    return txtarea.value;
  }

  /**
   * This function gets text content from
   * an html string or element
   *
   * @function
   * @param {HTMLElement | String} html string or element with HTML tags
   * @returns {String} text contained by the HTML tags
   * @api stable
   */
  static getTextFromHtml(html) {
    let htmlText = html;
    if (!Utils.isString(html) && html.outerHTML) {
      htmlText = html.outerHTML;
    }
    const divElement = document.createElement('DIV');
    divElement.innerHTML = htmlText;
    return divElement.textContent || divElement.innerText || '';
  }

  /**
   * This function gets an array scale color in hexadecimal format
   * @function
   * @public
   * @return {Array<string>} array scale color in hexadecimal format
   * @api stable
   */
  static generateColorScale(color1, color2, numberClasses) {
    return chroma.scale([color1, color2]).colors(numberClasses);
  }

  /**
   * This function gets the inverse of a color. The inverse of a color
   * is the diff between the hexadecimal value of white (0xFFFFFF)
   * and the hexadecimal value of the color.
   * @function
   * @public
   * @param {string} color
   * @return {string} inverse color in hexadecimal format
   * @api stable
   */
  static inverseColor(color) {
    let inverseColor;
    if (Utils.isString(color)) {
      let hexColor = chroma(color).hex();
      hexColor = hexColor.replace(/^#/, '0x');
      inverseColor = chroma(0xFFFFFF - hexColor).hex();
    }

    return inverseColor;
  }

  /**
   * This function gets the geometry type of a layer.
   * @function
   * @public
   * @param {M.layer.Vector} layer - layer vector
   * @return {string} geometry type of layer
   * @api stable
   */
  static getGeometryType(layer) {
    if (Utils.isNullOrEmpty(layer) || Utils.isNullOrEmpty(layer.getFeatures())) {
      return null;
    }
    const firstFeature = layer.getFeatures()[0];
    if (!Utils.isNullOrEmpty(firstFeature) && !Utils.isNullOrEmpty(firstFeature.getGeometry())) {
      return firstFeature.getGeometry().type;
    }
    return null;
  }

  /**
   * This function returns the appropiate style to geomtry layer
   * with parameter options.
   * @function
   * @public
   * @param {object} options - style options
   * @param {M.layer.Vector} layer -
   * @return {M.style.Simple}
   * @api stable
   */
  static generateStyleLayer(options, layer) {
    let style;
    switch (Utils.getGeometryType(layer)) {
      case 'Point':
      case 'MultiPoint':
        style = new StylePoint(options);
        break;
      case 'LineString':
      case 'MultiLineString':
        style = new StyleLine(options);
        break;
      case 'Polygon':
      case 'MultiPolygon':
        style = new StylePolygon(options);
        break;
      default:
        return null;
    }
    return style;
  }

  /**
   * This function returns a color as string with opacity
   * @function
   * @public
   * @param {string} color
   * @param {number} opacity
   * @return {string}
   * @api stable
   */
  static getRgba(color, opacity) {
    return chroma(color).alpha(opacity).css();
  }

  /**
   * This function returns if two sets are equals
   * @function
   * @public
   * @param {array} array
   * @param {array} array2
   * @return {bool}
   * @api stable
   */
  static setEquals(array, array2) {
    let equals = false;
    if (array.length === array2.length) {
      equals = array.every(e => array2.some(e2 => e2.equals(e)));
    }
    return equals;
  }

  /**
   * This function set implementation of this control
   *
   * @public
   * @function
   * @param {M.Map} impl to add the plugin
   * @api stable
   */
  static extends(dest = {}, src = {}) {
    if (!Utils.isNullOrEmpty(src)) {
      Object.keys(src).forEach((key) => {
        let value = src[key];
        if (Utils.isArray(value)) {
          value = [...value];
        }
        else if (Utils.isObject(value)) {
          value = Utils.extends({}, value);
        }
        if (Utils.isNullOrEmpty(dest[key])) {
          /* eslint-disable */
          dest[key] = value;
          /* eslint-enable */
        }
        else if (Utils.isObject(dest[key])) {
          Utils.extends(dest[key], value);
        }
      });
    }
    return dest;
  }

  /**
   * This function returns an array whith breaks between head and tail of an array
   * @function
   * @public
   * @param {array} array
   * @param {number} breaks
   * @return {array}
   * @api stable
   */
  static generateIntervals(array, breaks) {
    let intervals = [...array];
    if (array.length < breaks) {
      const step = (array[0] + array[1]) / (breaks - 1);
      for (let i = 1; i < breaks - 1; i += 1) {
        intervals[i] = step * i;
      }
      intervals = [...intervals, array[1]];
    }
    return intervals;
  }

  /**
   * This functions returns the order style
   * @function
   * @public
   * @param {M.Style}
   * @return {number}
   * @api stable
   */
  static styleComparator(style, style2) {
    return style.ORDER - style2.ORDER;
  }

  /**
   * This functions returns the width and height of a image from src
   * @function
   * @public
   * @param {string} url
   * @return {Array<number>}
   * @api stable
   */
  static getImageSize(url) {
    const image = new Image();
    return new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.src = url;
    });
  }

  /**
   * This functions returns random simple style
   * @function
   * @public
   * @param {M.Feature} feature
   * @return {M.style.Simple}
   * @api stable
   */
  static generateRandomStyle(feature, radiusParam, strokeWidthParam, strokeColorParam) {
    const radius = radiusParam;
    const fillColor = chroma.random().hex();
    const strokeColor = strokeColorParam;
    const strokeWidth = strokeWidthParam;
    const geometry = feature.getGeometry().type;
    let style;
    let options;
    switch (geometry) {
      case 'Point':
      case 'MultiPoint':
        options = {
          radius,
          fill: {
            color: fillColor,
          },
          stroke: {
            color: strokeColor,
            width: strokeWidth,
          },
        };
        style = new StylePoint(options);
        break;
      case 'LineString':
      case 'MultiLineString':
        options = {
          fill: {
            color: fillColor,
          },
          stroke: {
            color: strokeColor,
            width: strokeWidth,
          },
        };
        style = new StyleLine(options);
        break;
      case 'Polygon':
      case 'MultiPolygon':
        options = {
          fill: {
            color: fillColor,
          },
          stroke: {
            color: strokeColor,
            width: strokeWidth,
          },
        };
        style = new StylePolygon(options);
        break;
      default:
        style = null;
    }
    return style;
  }

  static classToggle(htmlElement, className) {
    const classList = htmlElement.classList;
    if (classList.contains(className)) {
      classList.remove(className);
    }
    else {
      classList.add(className);
    }
  }

  static replaceNode(newNode, oldNode) {
    const parent = oldNode.parentNode;
    if (parent) {
      parent.replaceChild(newNode, oldNode);
    }
  }
}
