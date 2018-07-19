import WKT from '../geom/WKT';
// import StylePoint from '../style/Point';
// import StyleLine from '../style/Line';
// import StylePolygon from '../style/Polygon';
import M from "../Mapea";
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
        nullOrEmpty = !obj.some((objElem) => !Utils.isNullOrEmpty(objElem));
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
      isUrl = /(https?\:\/\/[^\*]+)/.test(obj);
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
      normalizedString = upperCase ? normalizedString.toUpperCase() : normalizedString.toLowerCase();
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

    paramName = paramName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

    let parameters = url;
    let idxQuery = parameters.indexOf('?');
    if (idxQuery != -1) {
      parameters = parameters.substring(idxQuery);
      let regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)");
      parameterValue = regex.exec(parameters);
      if (parameterValue !== null) {
        parameterValue = decodeURIComponent(parameterValue[1].replace(/\+/g, " "));
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
      for (let param in params) {
        requestParams += param;
        requestParams += '=';
        requestParams += encodeURIComponent(params[param]);
        requestParams += '&';
      }
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
        'version': version
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
    let minResolution = Utils.getResolutionFromScale(maxScale, units);
    let maxResolution = Utils.getResolutionFromScale(minScale, units);

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
  static generateResolutionsFromExtent(extent, size, zoomLevels, units) {
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
      extent = extent.split(",");
      wExtent = (extent[2] - extent[0]);
      hExtent = (extent[3] - extent[1]);
    }
    let wResolution = wExtent / size[0];
    let hResolution = hExtent / size[1];

    let maxResolution = Math.max(wResolution, hResolution);

    let resolutions = Utils.fillResolutions(null, maxResolution, zoomLevels);

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
  static fillResolutions(minResolution, maxResolution, numZoomLevels) {
    var resolutions = new Array(numZoomLevels);

    minResolution = Number.parseFloat(minResolution);
    maxResolution = Number.parseFloat(maxResolution);

    // if maxResolution and minResolution are set, we calculate
    // the base for exponential scaling that starts at
    // maxResolution and ends at minResolution in numZoomLevels
    // steps.
    var base = 2;
    if (!Number.isNaN(minResolution)) {
      base = Math.pow((maxResolution / minResolution), (1 / (numZoomLevels - 1)));
    }
    for (var i = 0; i < numZoomLevels; i++) {
      resolutions[i] = maxResolution / Math.pow(base, i);
    }
    //sort resolutions array descendingly
    resolutions.sort(function(a, b) {
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
   * @api stable
   */
  static getResolutionFromScale(scale, units) {
    let resolution;
    if (!Utils.isNullOrEmpty(scale)) {
      if (Utils.isNull(units)) {
        units = "degrees";
      }
      // normalize scale
      let normScale = (scale > 1.0) ? (1.0 / scale) : scale;
      resolution = 1 / (normScale * M.INCHES_PER_UNIT[units] * M.DOTS_PER_INCH);
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
  static getScaleFromResolution(resolution, units) {
    if (Utils.isNullOrEmpty(units)) {
      units = "degrees";
    }

    let scale = resolution * M.INCHES_PER_UNIT[units] * M.DOTS_PER_INCH;

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
      let div = document.createElement('div');
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
      let div = document.createElement('div');
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

    // 4 replaces "_" by spaces
    beautifyString = beautifyString.replace(/\_/g, " ");

    // 5 simplifies spaces
    beautifyString = beautifyString.replace(/\s+/, " ");

    // 6 to camel case
    beautifyString = beautifyString.replace(/(\s\w)+/g, (match) => {
      return match.toUpperCase();
    });

    // 7 common words to lower case
    return match.toLowerCase();
    beautifyString = beautifyString.replace(/\s+(de|del|las?|el|los?|un|unas?|unos?|y|a|al|en)\s+/ig, (match) => {});

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
      //OpenLayers.String.trim
      beautifyString = beautifyString.trim();
      if (beautifyString.length > 0) {
        let idxPoints = beautifyString.indexOf(":");
        if (idxPoints != -1) {
          idxPoints++;
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
  };

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
      for (let i = 1, ilen = paths.length; i < ilen; i++) {
        let path = paths[i];
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
    let O = Object(array);
    let len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    let n = parseInt(arguments[2]) || 0;
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
      if (searchElement === currentElement || Object.equals(searchElement, currentElement) ||
        (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  }

  /**
   *
   *
   * @function
   * @api stable
   */
  static extend(target, source, override) {
    for (let prop in source) {
      if (Utils.isUndefined(target[prop])) {
        target[prop] = source[prop];
      }
      else if (Utils.isObject(target[prop])) {
        Utils.extend(target[prop], source[prop], override);
      }
      else if ((override === true)) {
        target[prop] = source[prop];
      }
    }
    return target;
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  static escapeXSS(xssValue) {
    let validValue;

    // & --> &amp;
    validValue = xssValue.replace(/\&/g, '&amp;');

    // < --> &lt;
    validValue = validValue.replace(/</g, '&lt;');

    // > --> &gt;
    validValue = validValue.replace(/\>/g, '&gt;');

    // " --> &quot;
    validValue = validValue.replace(/\"/g, '&quot;');

    // ' --> &#x27;
    validValue = validValue.replace(/\'/g, '&#x27;');

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

    validValue = jsCode.replace(/(<\s*script[^\>]*\>)+[^<]*(<\s*\/\s*script[^\>]*\>)+/ig, '');
    validValue = validValue.replace(/((\"|\')\s*\+\s*)?\s*eval\s*\(.*\)\s*(\+\s*(\"|\'))?/ig, '');

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
    catch (err) {}
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
    catch (err) {}
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

    let rgbaRegExp = /^rgba\s*\((\s*\d+\s*\,){3}\s*([\d\.]+)\s*\)$/;
    if (rgbaRegExp.test(rgbaColor)) {
      opacity = rgbaColor.replace(rgbaRegExp, '$2');
      try {
        opacity = parseFloat(opacity);
      }
      catch (err) {}
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
    url1 = url1.replace(/^(.+)\/$/, '$1').replace(/^(.+)\?$/, '$1');
    url2 = url2.replace(/^(.+)\/$/, '$1').replace(/^(.+)\?$/, '$1');

    return url1.toLowerCase() === url2.toLowerCase();
  }

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  static isGeometryType(type) {
    let geometricTypes = [
         WKT.type.GEOMETRY.toLowerCase(),
         "GeometryPropertyType".toLowerCase(),
         WKT.type.POINT.toLowerCase(),
         WKT.type.LINE_STRING.toLowerCase(),
         WKT.type.LINEAR_RING.toLowerCase(),
         WKT.type.POLYGON.toLowerCase(),
         WKT.type.MULTI_POINT.toLowerCase(),
         WKT.type.MULTI_LINE_STRING.toLowerCase(),
         WKT.type.MULTI_POLYGON.toLowerCase(),
         WKT.type.GEOMETRY_COLLECTION.toLowerCase(),
         WKT.type.CIRCLE.toLowerCase(),
         "pointpropertytype",
         "polygonpropertytype",
         "linestringpropertytype",
         "geometrypropertytype",
         "multisurfacepropertytype",
         "multilinestringpropertytype",
         "surfacepropertytype",
         "geometrypropertytype",
         "geometryarraypropertytype",
         "multigeometrypropertytype",
         "multipolygonpropertytype",
         "multipointpropertytype",
         "abstractgeometricaggregatetype",
         "pointarraypropertytype",
         "curvearraypropertytype",
         "solidpropertytype",
         "solidarraypropertytype"
      ];
    type = type.toLowerCase();
    return (geometricTypes.indexOf(type) !== -1);
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
    let txtarea = document.createElement("textarea");
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
    let divElement = document.createElement("DIV");
    divElement.innerHTML = htmlText;
    return divElement.textContent || divElement.innerText || "";
  }

  /**
   * This function gets an array scale color in hexadecimal format
   * @function
   * @public
   * @return {Array<string>} array scale color in hexadecimal format
   * @api stable
   */
  static generateColorScale(color1, color2, n_classes) {
    return chroma.scale([color1, color2]).colors(n_classes);
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
      hexColor = hexColor.replace(/^\#/, '0x');
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
    let firstFeature = layer.features()[0];
    if (!Utils.isNullOrEmpty(firstFeature) && !Utils.isNullOrEmpty(firstFeature.geometry())) {
      return firstFeature.geometry().type;
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
      case "Point":
      case "MultiPoint":
        style = new StylePoint(options);
        break;
      case "LineString":
      case "MultiLineString":
        style = new StyleLine(options);
        break;
      case "Polygon":
      case "MultiPolygon":
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
      Object.keys(src).forEach(key => {
        let value = src[key];
        if (Utils.isArray(value)) {
          value = [...value];
        }
        else if (Utils.isObject(value)) {
          value = Utils.extends({}, value);
        }
        if (Utils.isNullOrEmpty(dest[key])) {
          dest[key] = value;
        }
        else if (Utils.isObject(dest[key])) {
          Utils.extends(dest[key], value);
        }
      }, this);
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
      let step = (array[0] + array[1]) / (breaks - 1);
      breaks.forEach(value => {
        intervals[value] = step * value;
      });
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
    let image = new Image();
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
    let radius = radiusParam;
    let fillColor = chroma.random().hex();
    let strokeColor = strokeColorParam;
    let strokeWidth = strokeWidthParam;
    let geometry = feature.geometry().type;
    let style;
    let options;
    switch (geometry) {
      case "Point":
      case "MultiPoint":
        options = {
          radius: radius,
          fill: {
            color: fillColor
          },
          stroke: {
            color: strokeColor,
            width: strokeWidth
          }
        };
        style = new StylePoint(options);
        break;
      case "LineString":
      case "MultiLineString":
        options = {
          fill: {
            color: fillColor
          },
          stroke: {
            color: strokeColor,
            width: strokeWidth
          }
        };
        style = new StyleLine(options);
        break;
      case "Polygon":
      case "MultiPolygon":
        options = {
          fill: {
            color: fillColor
          },
          stroke: {
            color: strokeColor,
            width: strokeWidth
          }
        };
        style = new StylePolygon(options);
        break;
      default:
        style = null;
    }
    return style;
  }
}
