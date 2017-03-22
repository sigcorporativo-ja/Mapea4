goog.provide('M.utils');

goog.require('M.polyfills');
goog.require('M.geom.wkt.type');
goog.require('goog.color');
goog.require('goog.color.alpha');

/**
 * @namespace M.utils
 */
(function () {
  'use strict';

  /**
   * This function checks if the obj is null or empty
   *
   * @function
   * @param {string|Object|Array<*>} obj
   * @returns {boolean}
   * @api stable
   */
  M.utils.isNullOrEmpty = function (obj) {
    var nullOrEmpty = false;

    if (M.utils.isNull(obj)) {
      nullOrEmpty = true;
    }
    else if (M.utils.isArray(obj)) {
      nullOrEmpty = true;
      if (obj.length > 0) {
        nullOrEmpty = !obj.some(function (objElem) {
          return !M.utils.isNullOrEmpty(objElem);
        });
      }
    }
    else if ((typeof obj === 'string') && (obj.trim().length === 0)) {
      nullOrEmpty = true;
    }

    return nullOrEmpty;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.isNull = function (obj) {
    var isNull = false;

    if (!M.utils.isBoolean(obj) && (typeof obj !== 'number')) {
      if (M.utils.isUndefined(obj)) {
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
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.isArray = function (obj) {
    var isArray = false;
    if (!M.utils.isNull(obj)) {
      isArray = (Object.prototype.toString.call(obj) === Object.prototype.toString
        .call([]));
    }
    return isArray;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.isFunction = function (obj) {
    var isFunction = false;
    if (!M.utils.isNull(obj)) {
      isFunction = ((typeof obj === 'function') && !M.utils.isUndefined(obj.call));
    }
    return isFunction;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.isObject = function (obj) {
    var isObject = false;
    if (!M.utils.isNull(obj)) {
      isObject = ((typeof obj === 'object') && !M.utils.isUndefined(obj.toString));
    }
    return isObject;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.isString = function (obj) {
    var isString = false;
    if (!M.utils.isNull(obj)) {
      isString = (typeof obj === 'string');
    }
    return isString;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.isBoolean = function (obj) {
    var isBoolean = false;
    if ((obj !== null) && !M.utils.isUndefined(obj)) {
      isBoolean = (typeof obj === 'boolean');
    }
    return isBoolean;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.isUrl = function (obj) {
    var isUrl = false;
    if (!M.utils.isNull(obj) && M.utils.isString(obj)) {
      isUrl = /(https?\:\/\/[^\*]+)/.test(obj);
    }
    return isUrl;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.isUndefined = function (obj) {
    return (typeof obj === 'undefined');
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.normalize = function (stringToNormalize, upperCase) {
    var normalizedString = stringToNormalize;
    if (!M.utils.isNullOrEmpty(normalizedString) && M.utils.isString(normalizedString)) {
      normalizedString = normalizedString.trim();
      normalizedString = upperCase ? normalizedString.toUpperCase() : normalizedString.toLowerCase();
    }
    return normalizedString;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.getParameterValue = function (paramName, url) {
    var parameterValue = null;

    paramName = paramName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

    var parameters = url;
    var idxQuery = parameters.indexOf('?');
    if (idxQuery != -1) {
      parameters = parameters.substring(idxQuery);
      var regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)");
      parameterValue = regex.exec(parameters);
      if (parameterValue !== null) {
        parameterValue = decodeURIComponent(parameterValue[1].replace(/\+/g, " "));
      }
    }

    return parameterValue;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.addParameters = function (url, params) {
    var requestUrl = url;
    if (requestUrl.indexOf('?') === -1) {
      requestUrl += '?';
    }
    else if (requestUrl.charAt(requestUrl.length - 1) !== '?') {
      requestUrl += '&';
    }

    var requestParams = '';
    if (M.utils.isObject(params)) {
      for (var param in params) {
        requestParams += param;
        requestParams += '=';
        requestParams += encodeURIComponent(params[param]);
        requestParams += '&';
      }
      // removes the last '&'
      requestParams = requestParams.substring(0, requestParams.length - 1);
    }
    else if (M.utils.isString(params)) {
      requestParams = params;
    }
    requestUrl += requestParams;

    return requestUrl;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.generateRandom = function (prefix, sufix) {
    var random = '';

    // adds prefix
    if (!M.utils.isNullOrEmpty(prefix)) {
      random = prefix;
    }

    // generates random
    random = random.concat(Math.random()).replace(/0\./, '');

    // adds sufix
    if (!M.utils.isNullOrEmpty(sufix)) {
      random = random.concat(sufix);
    }

    return random;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.getWMSGetCapabilitiesUrl = function (serverUrl, version) {
    var wmsGetCapabilitiesUrl = serverUrl;

    // request
    wmsGetCapabilitiesUrl = M.utils.addParameters(wmsGetCapabilitiesUrl, 'request=GetCapabilities');
    // service
    wmsGetCapabilitiesUrl = M.utils.addParameters(wmsGetCapabilitiesUrl, 'service=WMS');

    // PATCH: En mapea 3 no se manda luego aquí tampoco. Hay servicios que dan error....
    //      // version
    //      wmsGetCapabilitiesUrl = M.utils.addParameters(wmsGetCapabilitiesUrl, {
    //         'version': version
    //      });

    return wmsGetCapabilitiesUrl;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.getWMTSGetCapabilitiesUrl = function (serverUrl, version) {
    var wmtsGetCapabilitiesUrl = serverUrl;

    // request
    wmtsGetCapabilitiesUrl = M.utils.addParameters(wmtsGetCapabilitiesUrl, 'request=GetCapabilities');
    // service
    wmtsGetCapabilitiesUrl = M.utils.addParameters(wmtsGetCapabilitiesUrl, 'service=WMTS');
    // version
    if (!M.utils.isNullOrEmpty(version)) {
      wmtsGetCapabilitiesUrl = M.utils.addParameters(wmtsGetCapabilitiesUrl, {
        'version': version
      });
    }

    return wmtsGetCapabilitiesUrl;
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
   * @api stable
   */
  M.utils.generateResolutionsFromScales = function (maxScale, minScale, zoomLevels, units) {
    var minResolution = M.utils.getResolutionFromScale(maxScale, units);
    var maxResolution = M.utils.getResolutionFromScale(minScale, units);

    return M.utils.fillResolutions(minResolution, maxResolution, zoomLevels);
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
   * @api stable
   */
  M.utils.generateResolutionsFromExtent = function (extent, size, zoomLevels, units) {
    let [wExtent, hExtent] = [null, null];
    if (M.utils.isArray(extent)) {
      wExtent = (extent[2] - extent[0]);
      hExtent = (extent[3] - extent[1]);
    }
    else if (M.utils.isObject(extent)) {
      wExtent = (extent.x.max - extent.x.min);
      hExtent = (extent.y.max - extent.y.min);
    }
    else if (M.utils.isString(extent)) {
      extent = extent.split(",");
      wExtent = (extent[2] - extent[0]);
      hExtent = (extent[3] - extent[1]);
    }
    var wResolution = wExtent / size[0];
    var hResolution = hExtent / size[1];

    var maxResolution = Math.max(wResolution, hResolution);

    var resolutions = M.utils.fillResolutions(null, maxResolution, zoomLevels);

    return resolutions;
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
   * @api stable
   */
  M.utils.fillResolutions = function (minResolution, maxResolution, numZoomLevels) {
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
    resolutions.sort(function (a, b) {
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
  M.utils.getResolutionFromScale = function (scale, units) {
    var resolution;
    if (!M.utils.isNullOrEmpty(scale)) {
      if (M.utils.isNull(units)) {
        units = "degrees";
      }
      // normalize scale
      var normScale = (scale > 1.0) ? (1.0 / scale) : scale;
      resolution = 1 / (normScale * M.INCHES_PER_UNIT[units] * M.DOTS_PER_INCH);
    }
    return resolution;
  };

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
  M.utils.getScaleFromResolution = function (resolution, units) {
    if (M.utils.isNullOrEmpty(units)) {
      units = "degrees";
    }

    var scale = resolution * M.INCHES_PER_UNIT[units] * M.DOTS_PER_INCH;

    return scale;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.stringToHtml = function (htmlTxt) {
    var html;

    if (!M.utils.isNullOrEmpty(htmlTxt)) {
      var div = document.createElement('div');
      div.innerHTML = htmlTxt;
      html = div.children[0];
    }

    return html;
  };

  /**
   *
   * @function
   * @api stable
   */
  M.utils.htmlToString = function (html) {
    var text;

    if (!M.utils.isNullOrEmpty(html)) {
      var div = document.createElement('div');
      goog.dom.appendChild(div, html);
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
   * @api stable
   */
  M.utils.beautifyString = function (text) {
    var beautifyString;

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
    beautifyString = beautifyString.replace(/(\s\w)+/g, function (match) {
      return match.toUpperCase();
    });

    // 7 common words to lower case
    beautifyString = beautifyString.replace(/\s+(de|del|las?|el|los?|un|unas?|unos?|y|a|al|en)\s+/ig, function (match) {
      return match.toLowerCase();
    });

    return beautifyString;
  };


  /**
   * formated String
   *
   * @function
   * @param {attributeName} String
   * @returns {Number} formated String
   * @api stable
   */
  M.utils.beautifyAttribute = function (attributeName) {
    var beautifyString = attributeName;

    if (beautifyString) {
      //OpenLayers.String.trim
      beautifyString = beautifyString.trim();
      if (beautifyString.length > 0) {
        var idxPoints = beautifyString.indexOf(":");
        if (idxPoints != -1) {
          idxPoints++;
          beautifyString = beautifyString.substring(idxPoints, beautifyString.length);
        }
      }
    }
    return beautifyString;
  };

  /**
   * formated String
   *
   * @function
   * @param {attributeName} String
   * @returns {Number} formated String
   * @api stable
   */
  M.utils.beautifyAttributeName = function (rawAttributeName) {
    var attributeName = M.utils.normalize(rawAttributeName);
    attributeName = attributeName.replace(/_(\w)/g, function (match, group) {
      return ' '.concat(group.toUpperCase());
    });
    attributeName = attributeName.replace(/^\w/, function (match) {
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
  M.utils.concatUrlPaths = function (paths) {
    var finalUrl = null;
    if (!M.utils.isNullOrEmpty(paths)) {
      finalUrl = paths[0];
      finalUrl = finalUrl.replace(/\/+\s*$/, '');
      for (var i = 1, ilen = paths.length; i < ilen; i++) {
        var path = paths[i];
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
   * @api stable
   */
  M.utils.includes = function (array, searchElement, fromIndex) {
    var O = Object(array);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[2]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    }
    else {
      k = len + n;
      if (k < 0) {
        k = 0;
      }
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement || Object.equals(searchElement, currentElement) ||
        (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };

  /**
   *
   *
   * @function
   * @api stable
   */
  M.utils.extend = function (target, source, override) {
    for (var prop in source) {
      if (M.utils.isUndefined(target[prop])) {
        target[prop] = source[prop];
      }
      else if (M.utils.isObject(target[prop])) {
        M.utils.extend(target[prop], source[prop], override);
      }
      else if ((override === true)) {
        target[prop] = source[prop];
      }
    }
    return target;
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  M.utils.escapeXSS = function (xssValue) {
    var validValue;

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
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  M.utils.escapeJSCode = function (jsCode) {
    var validValue;

    validValue = jsCode.replace(/(<\s*script[^\>]*\>)+[^<]*(<\s*\/\s*script[^\>]*\>)+/ig, '');
    validValue = validValue.replace(/((\"|\')\s*\+\s*)?\s*eval\s*\(.*\)\s*(\+\s*(\"|\'))?/ig, '');

    return validValue;
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  M.utils.enableTouchScroll = function (elem) {
    if ('ontouchstart' in goog.global) {
      var scrollStartPos = 0;

      goog.events.listen(elem, goog.events.EventType.TOUCHSTART, function (evt) {
        scrollStartPos = this.scrollTop + evt.getBrowserEvent().touches[0].pageY;
      });

      goog.events.listen(elem, goog.events.EventType.TOUCHMOVE, function (evt) {
        this.scrollTop = scrollStartPos - evt.getBrowserEvent().touches[0].pageY;
      });
    }
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  M.utils.rgbToHex = function (rgbColor) {
    var hexColor;

    if (goog.color.isValidColor(rgbColor)) {
      hexColor = goog.color.parse(rgbColor).hex;
    }
    else {
      try {
        hexColor = goog.color.alpha.parse(rgbColor).hex;
      }
      catch (err) {}
    }
    return hexColor;
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  M.utils.getOpacityFromRgba = function (rgbaColor) {
    var opacity;

    var rgbaRegExp = /^rgba\s*\((\s*\d+\s*\,){3}\s*([\d\.]+)\s*\)$/;
    if (rgbaRegExp.test(rgbaColor)) {
      opacity = rgbaColor.replace(rgbaRegExp, '$2');
      try {
        opacity = parseFloat(opacity);
      }
      catch (err) {}
    }

    return opacity;
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  M.utils.sameUrl = function (url1, url2) {
    url1 = url1.replace(/^(.+)\/$/, '$1').replace(/^(.+)\?$/, '$1');
    url2 = url2.replace(/^(.+)\/$/, '$1').replace(/^(.+)\?$/, '$1');

    return url1.toLowerCase() === url2.toLowerCase();
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  M.utils.isGeometryType = function (type) {
    var geometricTypes = [
         M.geom.wkt.type.GEOMETRY.toLowerCase(),
         "GeometryPropertyType".toLowerCase(),
         M.geom.wkt.type.POINT.toLowerCase(),
         M.geom.wkt.type.LINE_STRING.toLowerCase(),
         M.geom.wkt.type.LINEAR_RING.toLowerCase(),
         M.geom.wkt.type.POLYGON.toLowerCase(),
         M.geom.wkt.type.MULTI_POINT.toLowerCase(),
         M.geom.wkt.type.MULTI_LINE_STRING.toLowerCase(),
         M.geom.wkt.type.MULTI_POLYGON.toLowerCase(),
         M.geom.wkt.type.GEOMETRY_COLLECTION.toLowerCase(),
         M.geom.wkt.type.CIRCLE.toLowerCase(),
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
         "multipointpropertytype",
         "abstractgeometricaggregatetype",
         "pointarraypropertytype",
         "curvearraypropertytype",
         "solidpropertytype",
         "solidarraypropertytype"
      ];
    type = type.toLowerCase();
    return (geometricTypes.indexOf(type) !== -1);
  };

  /**
   * This function decodes html entities into
   * text
   *
   * @function
   * @param {String} encodedHtml encoded text with HTML entities
   * @returns {String} text decoded
   * @api stable
   */
  M.utils.decodeHtml = function (encodedHtml) {
    let txtarea = document.createElement("textarea");
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
   * @api stable
   */
  M.utils.getTextFromHtml = function (html) {
    let htmlText = html;
    if (!M.utils.isString(html) && html.outerHTML) {
      htmlText = html.outerHTML;
    }
    let divElement = document.createElement("DIV");
    divElement.innerHTML = htmlText;
    return divElement.textContent || divElement.innerText || "";
  };
})();
