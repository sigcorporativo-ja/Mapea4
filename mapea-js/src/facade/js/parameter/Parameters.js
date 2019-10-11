/**
 * @module M/Parameters
 */
import { isString, isNullOrEmpty, getParameterValue, isObject, isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import { getValue } from '../i18n/language';

/**
 * This function parses a container parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} userParameters parameters
 * especified by the user
 * @returns {Object} container of the map
 */

const parseContainer = (userParameters) => {
  let container;
  if (isString(userParameters)) {
    container = document.getElementById(userParameters);
  } else if (isObject(userParameters)) {
    if (!isNullOrEmpty(userParameters.id)) {
      container = document.getElementById(userParameters.id);
    } else if (!isNullOrEmpty(userParameters.container)) {
      container = parseContainer(userParameters.container);
    } else {
      Exception(getValue('exception').no_container);
    }
  } else {
    Exception(`El tipo del parámetro container no es válido: ${typeof userParameters}`);
  }
  if (isNullOrEmpty(container)) {
    Exception(getValue('exception').no_id_container);
  }
  return container;
};

/**
 * This function parses a layer parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {string|Object|Array<string|Object>} layers specified by the user
 */

const parseLayers = (parameter) => {
  let layers;

  if (isString(parameter)) {
    layers = getParameterValue('layers', parameter);
  } else if (isObject(parameter)) {
    layers = parameter.layers;
  } else {
    Exception(`El tipo del parámetro container no es válido: ${typeof parameter}`);
  }

  return layers;
};

/**
 * This function parses a wmc parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {string|Object|Array<string|Object>} WMC layers
 */
const parseWMC = (parameter) => {
  let wmc;

  if (isString(parameter)) {
    wmc = getParameterValue('wmc', parameter);
    if (isNullOrEmpty(wmc)) {
      wmc = getParameterValue('wmcfile', parameter);
    }
    if (isNullOrEmpty(wmc)) {
      wmc = getParameterValue('wmcfiles', parameter);
    }
  } else if (isObject(parameter)) {
    wmc = parameter.wmc;
    if (isNullOrEmpty(wmc)) {
      wmc = parameter.wmcfile;
    }
    if (isNullOrEmpty(wmc)) {
      wmc = parameter.wmcfiles;
    }
  } else {
    Exception(`El tipo del parámetro container no es válido: ${typeof parameter}`);
  }
  return wmc;
};

/**
 * This function parses a wms parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {string|Object|Array<string|Object>} WMS layers
 */
const parseWMS = (parameter) => {
  let wms;

  if (isString(parameter)) {
    wms = getParameterValue('wms', parameter);
  } else if (isObject(parameter)) {
    wms = parameter.wms;
  } else {
    Exception(`El tipo del parámetro container no es válido: ${typeof parameter}`);
  }
  return wms;
};
/**
 * This function parses a wmts parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {string|Object|Array<string|Object>} WMTS layers
 */
const parseWMTS = (parameter) => {
  let wmts;

  if (isString(parameter)) {
    wmts = getParameterValue('wmts', parameter);
  } else if (isObject(parameter)) {
    wmts = parameter.wmts;
  } else {
    Exception(`El tipo del parámetro container no es válido: ${typeof parameter}`);
  }

  return wmts;
};

/**
 * This function parses a kml parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {string|Object|Array<string|Object>} KML layers
 */
const parseKML = (parameter) => {
  let kml;

  if (isString(parameter)) {
    kml = getParameterValue('kml', parameter);
  } else if (isObject(parameter)) {
    kml = parameter.kml;
  } else {
    Exception(`El tipo del parámetro container no es válido: ${typeof parameter}`);
  }

  return kml;
};

/**
 * This function parses a controls parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {string|Object|Array<string|Object>} WMS layers
 */
const parseControls = (parameter) => {
  let controls;

  if (isString(parameter)) {
    controls = getParameterValue('controls', parameter);
  } else if (isObject(parameter)) {
    controls = parameter.controls;
  } else {
    Exception(`El tipo del parámetro controls no es válido: ${typeof parameter}`);
  }

  return controls;
};

/**
 * This function parses a controls parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {string|Object|Array<string|Object>} WMS layers
 */
const parseGetFeatureInfo = (parameter) => {
  let getFeatureInfo;

  if (isString(parameter)) {
    getFeatureInfo = getParameterValue('getfeatureinfo', parameter);
  } else if (isObject(parameter)) {
    getFeatureInfo = parameter.getfeatureinfo;
    if (!isUndefined(getFeatureInfo) && isNullOrEmpty(getFeatureInfo)) {
      getFeatureInfo = 'plain';
    }
  } else {
    Exception(`El tipo del parámetro controls no es válido: ${typeof parameter}`);
  }

  return getFeatureInfo;
};

/**
 * This function parses a maxExtent parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {String|Array<String>|Array<Number>|Mx.Extent} maximum extent
 * established by the user
 */
const parseMaxExtent = (parameter) => {
  let maxExtent;

  if (isString(parameter)) {
    maxExtent = getParameterValue('maxExtent', parameter);
    if (isNullOrEmpty(maxExtent)) {
      maxExtent = getParameterValue('maxextent', parameter);
    }
  } else if (isObject(parameter)) {
    maxExtent = parameter.maxExtent;
    if (isNullOrEmpty(maxExtent)) {
      maxExtent = parameter.maxextent;
    }
  } else {
    Exception(`El tipo del parámetro container no es válido: ${typeof parameter}`);
  }
  return maxExtent;
};

/**
 * This function parses a bbox parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {String|Array<String>|Array<Number>|Mx.Extent} bbox
 * established by the user
 */
const parseBbox = (parameter) => {
  let bbox;

  if (isString(parameter)) {
    bbox = getParameterValue('bbox', parameter);
  } else if (isObject(parameter)) {
    bbox = parameter.bbox;
  } else {
    Exception(`El tipo del parámetro container no es válido: ${typeof parameter}`);
  }

  return bbox;
};

/**
 * This function parses a zoom parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {String|Array<String>|Array<Number>|Mx.Extent} bbox
 * established by the user
 */
const parseZoom = (parameter) => {
  let zoom;

  if (isString(parameter)) {
    zoom = getParameterValue('zoom', parameter);
  } else if (isObject(parameter)) {
    zoom = parameter.zoom;
  } else {
    Exception(`El tipo del parámetro zoom no es válido: ${typeof parameter}`);
  }

  return zoom;
};

/**
 * This function parses a center parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {String|Array<String>|Array<Number>|Mx.Extent} bbox
 * established by the user
 */
const parseCenter = (parameter) => {
  let center;

  if (isString(parameter)) {
    center = getParameterValue('center', parameter);
  } else if (isObject(parameter)) {
    center = parameter.center;
  } else {
    Exception(`El tipo del parámetro center no es válido: ${typeof parameter}`);
  }

  return center;
};

/**
 * This function parses a ticket parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {String} ticket
 * established by the user
 */
const parseTicket = (parameter) => {
  let ticket;

  if (isString(parameter)) {
    ticket = getParameterValue('ticket', parameter);
  } else if (isObject(parameter)) {
    ticket = parameter.ticket;
  } else {
    Exception(`El tipo del parámetro ticket no es válido: ${typeof parameter}`);
  }

  return ticket;
};

/**
 * This functions gets the rotation parameter setted by the user.
 *
 * @private
 * @function
 */
const parseRotation = (parameter) => {
  let rotation = parameter;

  if (isString(parameter)) {
    rotation = getParameterValue('rotation', parameter);
  } else if (isObject(parameter)) {
    rotation = parameter.rotation;
  }
  return rotation;
};

/**
 * This function parses a resolutions parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {String|Array<String>|Array<Number>} resolutions
 * established by the user
 */
const parseResolutions = (parameter) => {
  let resolutions;

  if (isString(parameter)) {
    resolutions = getParameterValue('resolutions', parameter);
  } else if (isObject(parameter)) {
    resolutions = parameter.resolutions;
  } else {
    Exception(`El tipo del parámetro container no es válido: ${typeof parameter}`);
  }

  return resolutions;
};

/**
 * This function parses a projection parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {String|Array<String>|Array<Number>|Mx.Extent} bbox
 * established by the user
 */
const parseProjection = (parameter) => {
  let projection;
  if (isString(parameter)) {
    projection = getParameterValue('projection', parameter);
  } else if (isObject(parameter)) {
    projection = parameter.projection;
  } else {
    Exception(`El tipo del parámetro container no es válido: ${typeof parameter}`);
  }

  return projection;
};

/**
 * This function parses a projection parameter in a legible
 * parameter to Mapea and checks posible errors
 *
 * @private
 * @function
 * @param {string|Mx.parameters.Map} parameter parameters
 * especified by the user
 * @returns {String|Array<String>|Array<Number>|Mx.Extent} bbox
 * established by the user
 */
const parseLabel = (parameter) => {
  let label;

  if (isString(parameter)) {
    label = getParameterValue('label', parameter);
  } else if (isObject(parameter)) {
    label = parameter.label;
  } else {
    Exception(`El tipo del parámetro container no es válido: ${typeof parameter}`);
  }

  return label;
};

/**
 * @classdesc
 * Main constructor of the class. Creates the parsed parameters
 * with parameters specified by the user
 * @api
 */
class Parameters {
  /**
   * @constructor
   * @param {string|Mx.parameters.Map} userParameters parameters
   * provided by the user
   * @api
   */
  constructor(userParameters) {
    if (isNullOrEmpty(userParameters)) {
      Exception(getValue('exception').no_param);
    }

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.container = parseContainer(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.layers = parseLayers(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.wmc = parseWMC(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.wms = parseWMS(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.wmts = parseWMTS(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.kml = parseKML(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.controls = parseControls(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.getfeatureinfo = parseGetFeatureInfo(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.maxExtent = parseMaxExtent(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.bbox = parseBbox(userParameters);

    /**
     * @public
     * @type {Number}
     * @api
     */
    this.zoom = parseZoom(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.center = parseCenter(userParameters);

    /**
     * @public
     * @type {String|Array<String>|Array<Number>}
     * @api
     */
    this.resolutions = parseResolutions(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.projection = parseProjection(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.label = parseLabel(userParameters);

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.ticket = parseTicket(userParameters);

    /**
     * @public
     * @type {number}
     * @api
     */
    this.rotation = parseRotation(userParameters);
  }
}

export default Parameters;
