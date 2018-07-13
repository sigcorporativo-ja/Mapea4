import Utils from '../util/Utils';
import Exception from '../exception/exception';
import Config from "configuration";
import LayerType from "../layer/Type";
/**
 * Parses the specified user center parameter into an object
 *
 * @param {String|Array<String>|Array<Number>|Mx.Center} centerParameter parameters
 * provided by the user
 * @returns {Mx.Center}
 * @public
 * @function
 * @api stable
 */
export const center = centerParameter => {
  let center = {};
  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(centerParameter)) {
    Exception('No ha especificado ningún parámetro center');
  }
  // string
  if (Utils.isString(centerParameter)) {
    centerParameter = Utils.normalize(centerParameter);
    if (/^\-?\d+(\.\d+)?[\,\;]\-?\d+(\.\d+)?([\*](true|false))?$/i.test(centerParameter)) {
      let centerArray = centerParameter.split(/\*/);
      let coord = centerArray[0];
      let draw = centerArray[1];
      let coordArray = coord.split(/[\,\;]+/);
      if (coordArray.length === 2) {
        center.x = Number.parseFloat(coordArray[0]);
        center.y = Number.parseFloat(coordArray[1]);
      }
      else {
        Exception('El formato del parámetro center no es correcto');
      }
      center.draw = /^1|(true)$/i.test(draw);
    }
    else {
      Exception('El formato del parámetro center no es correcto');
    }
  }
  // array
  else if (Utils.isArray(centerParameter)) {
    if ((centerParameter.length === 2) || (centerParameter.length === 3)) {
      if (Utils.isString(centerParameter[0])) {
        centerParameter[0] = Number.parseFloat(centerParameter[0]);
      }
      if (Utils.isString(centerParameter[1])) {
        centerParameter[1] = Number.parseFloat(centerParameter[1]);
      }
      center.x = centerParameter[0];
      center.y = centerParameter[1];
    }
    else {
      Exception('El formato del parámetro center no es correcto');
    }
  }
  // object
  else if (Utils.isObject(centerParameter)) {
    // x
    if (!Utils.isNull(centerParameter.x)) {
      if (Utils.isString(centerParameter.x)) {
        centerParameter.x = Number.parseFloat(centerParameter.x);
      }
      center.x = centerParameter.x;
    }
    else {
      Exception('El formato del parámetro center no es correcto');
    }
    // y
    if (!Utils.isNull(centerParameter.y)) {
      if (Utils.isString(centerParameter.y)) {
        centerParameter.y = Number.parseFloat(centerParameter.y);
      }
      center.y = centerParameter.y;
    }
    else {
      Exception('El formato del parámetro center no es correcto');
    }
    // draw
    if (!Utils.isNull(centerParameter.draw)) {
      center.draw = /^true$/.test(centerParameter.draw);
    }
    else {
      center.draw = false;
    }
  }
  // unknown
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof maxExtentParameter));
  }

  if (Number.isNaN(center.x) || Number.isNaN(center.y)) {
    Exception('El formato del parámetro center no es correcto');
  }

  return center;
};

/**
 * Parses the specified user layer parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @param {string} forced type of the layer (optional)
 * @returns {Mx.parameters.Layer|Array<Mx.parameters.Layer>}
 * @public
 * @function
 * @api stable
 */
export const layer = (userParameters, forcedType) => {
  let layers = [];

  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!Utils.isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map(userParam => {
    let layerObj = null;
    if (Utils.isObject(userParam) && (userParam instanceof Layer)) {
      layerObj = userParam;
    }
    else {
      // gets the layer type
      let type = getType(userParam, forcedType);
      type = Utils.normalize(type);

      if (Utils.isFunction(Parameter[type])) {
        layerObj = Parameter[type](userParam);
      }
      else {
        layerObj = userParam;
      }
    }

    return layerObj;
  });

  if (!Utils.isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
}

/**
 * Parses the parameter in order to get the type
 * @private
 * @function
 */
const getType = (parameter, forcedType) => {
  let type;
  if (Utils.isString(parameter)) {
    if (/^\s*osm\s*$/i.test(parameter)) {
      type = LayerType.OSM;
    }
    else if (/^\s*mapbox\*.+$/i.test(parameter)) {
      type = LayerType.Mapbox;
    }
    else {
      let typeMatches = parameter.match(/^(\w+)\*.+$/);
      if (typeMatches && (typeMatches.length > 1)) {
        type = LayerType.parse(typeMatches[1]);
        if (Utils.isUndefined(type)) {
          Exception('No se reconoce el tipo de capa ' + typeMatches[1]);
        }
      }
      if (Utils.isUndefined(type) && !Utils.isNullOrEmpty(forcedType)) {
        type = forcedType;
      }
      else if (Utils.isUndefined(type)) {
        Exception('No se reconoce el tipo de capa ' + type);
      }
    }
  }
  else if (Utils.isObject(parameter)) {
    if (!Utils.isNullOrEmpty(parameter.type)) {
      type = LayerType.parse(parameter.type);
      if (Utils.isUndefined(type)) {
        Exception('No se reconoce el tipo de capa ' + type);
      }
    }
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (!Utils.isNullOrEmpty(type) && !Utils.isNullOrEmpty(forcedType) && (type !== forcedType)) {
    Exception('El tipo de la capa ('.concat(type)
      .concat(') no era el esperado (').concat(forcedType).concat(')'));
  }

  if (Utils.isNullOrEmpty(type) && !Utils.isNullOrEmpty(forcedType)) {
    type = forcedType;
  }
  return type;
}


/**
 * Parses the specified user maxExtent parameter into an object
 *
 * @param {String|Array<String>|Array<Number>|Mx.Extent} maxExtentParameter parameters
 * provided by the user
 * @returns {Mx.Extent}
 * @public
 * @function
 * @api stable
 */
export const maxExtent = maxExtentParameter => {
  let maxExtent = {
    x: {},
    y: {}
  };

  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(maxExtentParameter)) {
    Exception('No ha especificado ningún parámetro maxExtent');
  }

  // string
  if (Utils.isString(maxExtentParameter)) {
    if (/^\s*-?\d+(\.\d+)?\s*[\,\;]\s*-?\d+(\.\d+)?\s*[\,\;]\s*-?\d+(\.\d+)?\s*[\,\;]\s*-?\d+(\.\d+)?$/.test(maxExtentParameter)) {
      let extentArray = maxExtentParameter.split(/[\,\;]+/);
      if (extentArray.length === 4) {
        maxExtent.x.min = Number.parseFloat(extentArray[0]);
        maxExtent.y.min = Number.parseFloat(extentArray[1]);
        maxExtent.x.max = Number.parseFloat(extentArray[2]);
        maxExtent.y.max = Number.parseFloat(extentArray[3]);
      }
      else {
        Exception('El formato del parámetro maxExtent no es correcto');
      }
    }
    else {
      Exception('El formato del parámetro maxExtent no es correcto');
    }
  }
  // array
  else if (Utils.isArray(maxExtentParameter)) {
    if (maxExtentParameter.length === 4) {
      if (Utils.isString(maxExtentParameter[0])) {
        maxExtentParameter[0] = Number.parseFloat(maxExtentParameter[0]);
      }
      if (Utils.isString(maxExtentParameter[1])) {
        maxExtentParameter[1] = Number.parseFloat(maxExtentParameter[1]);
      }
      if (Utils.isString(maxExtentParameter[2])) {
        maxExtentParameter[2] = Number.parseFloat(maxExtentParameter[2]);
      }
      if (Utils.isString(maxExtentParameter[3])) {
        maxExtentParameter[3] = Number.parseFloat(maxExtentParameter[3]);
      }
      maxExtent.x.min = maxExtentParameter[0];
      maxExtent.y.min = maxExtentParameter[1];
      maxExtent.x.max = maxExtentParameter[2];
      maxExtent.y.max = maxExtentParameter[3];
    }
    else {
      Exception('El formato del parámetro maxExtent no es correcto');
    }
  }
  // object
  else if (Utils.isObject(maxExtentParameter)) {
    // x min
    if (!Utils.isNull(maxExtentParameter.left)) {
      if (Utils.isString(maxExtentParameter.left)) {
        maxExtentParameter.left = Number.parseFloat(maxExtentParameter.left);
      }
      maxExtent.x.min = maxExtentParameter.left;
    }
    else if (!Utils.isNull(maxExtentParameter.x.min)) {
      if (Utils.isString(maxExtentParameter.x.min)) {
        maxExtentParameter.x.min = Number.parseFloat(maxExtentParameter.x.min);
      }
      maxExtent.x.min = maxExtentParameter.x.min;
    }
    else {
      Exception('El formato del parámetro maxExtent no es correcto');
    }
    // y min
    if (!Utils.isNull(maxExtentParameter.bottom)) {
      if (Utils.isString(maxExtentParameter.bottom)) {
        maxExtentParameter.bottom = Number.parseFloat(maxExtentParameter.bottom);
      }
      maxExtent.y.min = maxExtentParameter.bottom;
    }
    else if (!Utils.isNull(maxExtentParameter.y.min)) {
      if (Utils.isString(maxExtentParameter.y.min)) {
        maxExtentParameter.y.min = Number.parseFloat(maxExtentParameter.y.min);
      }
      maxExtent.y.min = maxExtentParameter.y.min;
    }
    else {
      Exception('El formato del parámetro maxExtent no es correcto');
    }
    // x max
    if (!Utils.isNull(maxExtentParameter.right)) {
      if (Utils.isString(maxExtentParameter.right)) {
        maxExtentParameter.right = Number.parseFloat(maxExtentParameter.right);
      }
      maxExtent.x.max = maxExtentParameter.right;
    }
    else if (!Utils.isNull(maxExtentParameter.x.max)) {
      if (Utils.isString(maxExtentParameter.x.max)) {
        maxExtentParameter.x.max = Number.parseFloat(maxExtentParameter.x.max);
      }
      maxExtent.x.max = maxExtentParameter.x.max;
    }
    else {
      Exception('El formato del parámetro maxExtent no es correcto');
    }
    // y max
    if (!Utils.isNull(maxExtentParameter.top)) {
      if (Utils.isString(maxExtentParameter.top)) {
        maxExtentParameter.top = Number.parseFloat(maxExtentParameter.top);
      }
      maxExtent.y.max = maxExtentParameter.top;
    }
    else if (!Utils.isNull(maxExtentParameter.y.max)) {
      if (Utils.isString(maxExtentParameter.y.max)) {
        maxExtentParameter.y.max = Number.parseFloat(maxExtentParameter.y.max);
      }
      maxExtent.y.max = maxExtentParameter.y.max;
    }
    else {
      Exception('El formato del parámetro maxExtent no es correcto');
    }
  }
  // unknown
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof maxExtentParameter));
  }

  if (Number.isNaN(maxExtent.x.min) || Number.isNaN(maxExtent.y.min) || Number.isNaN(maxExtent.x.max) || Number.isNaN(maxExtent.y.max)) {
    Exception('El formato del parámetro maxExtent no es correcto');
  }

  return maxExtent;
}


/**
 * Parses the specified user projection parameter into an object
 *
 * @param {String|Mx.Projection} projectionParameter parameters
 * provided by the user
 * @returns {Mx.Projection}
 * @public
 * @function
 * @api stable
 */
export const projection = projectionParameter => {
  let projection = {
    code: null,
    units: null
  }

  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(projectionParameter)) {
    Exception('No ha especificado ningún parámetro projection');
  }

  // string
  if (Utils.isString(projectionParameter)) {
    if (/^(EPSG\:)?\d+\*((d(egrees)?)|(m(eters)?))$/i.test(projectionParameter)) {
      let projectionArray = projectionParameter.split(/\*/);
      projection.code = projectionArray[0];
      projection.units = Utils.normalize(projectionArray[1].substring(0, 1));
    }
    else {
      Exception('El formato del parámetro projection no es correcto. </br>Se usará la proyección por defecto: ' + Config.DEFAULT_PROJ);
    }
  }
  // object
  else if (Utils.isObject(projectionParameter)) {
    // y max
    if (!Utils.isNull(projectionParameter.code) &&
      !Utils.isNull(projectionParameter.units)) {
      projection.code = projectionParameter.code;
      projection.units = Utils.normalize(projectionParameter.units.substring(0, 1));
    }
    else {
      Exception('El formato del parámetro projection no es correcto. </br>Se usará la proyección por defecto: ' + Config.DEFAULT_PROJ);
    }
  }
  // unknown
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof projectionParameter));
  }

  if ((projection.units !== 'm') && (projection.units !== 'd')) {
    Exception('La unidad "' + projectionParameter.units + '" del parámetro projection no es válida. Las disponibles son: "m" o "d"');
  }

  return projection;
}

/**
 * Parses the specified user resolutions parameter into an array
 *
 * @param {String|Array<String>|Array<Number>} resolutionsParameter parameters
 * provided by the user
 * @returns {Array<Number>}
 * @public
 * @function
 * @api stable
 */
export const resolutions = resolutionsParameter => {
  let resolutions = [];

  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(resolutionsParameter)) {
    Exception('No ha especificado ningún parámetro resolutions');
  }

  // string
  if (Utils.isString(resolutionsParameter)) {
    if (/^\d+(\.\d+)?([\,\;]\d+(\.\d+)?)*$/.test(resolutionsParameter)) {
      resolutionsParameter = resolutionsParameter.split(/[\,\;]+/);
    }
    else {
      Exception('El formato del parámetro resolutions no es correcto');
    }
  }
  // array
  if (Utils.isArray(resolutionsParameter)) {
    resolutions = resolutionsParameter.map((resolution) => {
      if (Utils.isString(resolution)) {
        return Number.parseFloat(resolution);
      }
      else {
        return resolution;
      }
    });
  }
  // unknown
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof resolutionsParameter));
  }

  let valid = true;
  for (let i = 0, len = resolutions.length; i < len && valid; i++) {
    valid = !Number.isNaN(resolutions[i]);
  }

  if (!valid) {
    Exception('El formato del parámetro resolutions no es correcto');
  }
  return resolutions;
}

/**
 * Parses the specified user zoom parameter into a number
 *
 * @param {String|Number} zoomParameter parameters
 * provided by the user
 * @returns {Number}
 * @public
 * @function
 * @api stable
 */
export const zoom = zoomParameter => {
  let zoom;

  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(zoomParameter)) {
    Exception('No ha especificado ningún parámetro zoom');
  }

  // string
  if (Utils.isString(zoomParameter)) {
    zoom = Number.parseInt(zoomParameter);
  }
  // number
  else if (typeof zoomParameter === 'number') {
    zoom = zoomParameter;
  }
  // unknown
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof zoomParameter));
  }

  if (Number.isNaN(zoom)) {
    Exception('El formato del parámetro zoom no es correcto');
  }
  return zoom;
}

/**
 * Parses the specified user layer KML parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.KML|Array<Mx.parameters.KML>}
 * @public
 * @function
 * @api stable
 */
export const kml = userParameters => {
  let layers = [];

  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!Utils.isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    let layerObj = {};

    // gets the layer type
    layerObj.type = LayerType.KML;

    // gets the name
    layerObj.name = getNameKML(userParam);

    // gets the URL
    layerObj.url = getURLKML(userParam);

    // gets the extract
    layerObj.extract = getExtractKML(userParam);

    // gets the options
    layerObj.options = getOptionsKML(userParam);

    return layerObj;
  });

  if (!Utils.isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
}

/**
 * Parses the parameter in order to get the service URL
 * @private
 * @function
 */
const getURLKML = parameter => {
  let url;
  if (Utils.isString(parameter)) {
    // v3 <KML>*<NAME>*<DIR>*<FILENAME>*<EXTRACT>
    if (/^KML\*[^\*]+\*[^\*]+\*[^\*]+\.kml\*(true|false)$/i.test(parameter)) {
      let params = parameter.split(/\*/);
      url = params[2].concat(params[3]);
    }
    else {
      let urlMatches = parameter.match(/^([^\*]*\*)*(https?\:\/\/[^\*]+)(\*(true|false))?$/i);
      if (urlMatches && (urlMatches.length > 2)) {
        url = urlMatches[2];
      }
    }
  }
  else if (Utils.isObject(parameter)) {
    url = parameter.url;
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return url;
}

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameKML = parameter => {
  let name, params;
  if (Utils.isString(parameter)) {
    if (/^KML\*.+/i.test(parameter)) {
      // <KML>*<NAME>*<URL>(*<FILENAME>)?*<EXTRACT>
      if (/^KML\*[^\*]+\*[^\*]+(\*[^\*]+)?(\*(true|false))?$/i.test(parameter)) {
        params = parameter.split(/\*/);
        name = params[1].trim();
      }
    }
    // <NAME>*<URL>(*<FILENAME>)?(*<EXTRACT>)?
    else if (/^[^\*]*\*[^\*]+/.test(parameter)) {
      params = parameter.split(/\*/);
      name = params[0].trim();
    }
    // <NAME>(*<URL>(*<FILENAME>)?(*<EXTRACT>)?)? filtering
    else if (/^[^\*]*/.test(parameter)) {
      params = parameter.split(/\*/);
      name = params[0].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.name)) {
    name = parameter.name.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(name) || /^(true|false)$/i.test(name)) {
    name = null;
  }
  return name;
}

/**
 * Parses the parameter in order to get the transparence
 * @private
 * @function
 */
const getExtractKML = parameter => {
  let extract, params;
  if (Utils.isString(parameter)) {
    // <KML>*<NAME>*<URL>(*<FILENAME>)?*<EXTRACT>
    if (/^KML\*[^\*]+\*[^\*]+(\*[^\*]+)?(\*(true|false))?$/i.test(parameter)) {
      params = parameter.split(/\*/);
      extract = params[params.length - 1].trim();
    }
    // <NAME>*<URL>*<EXTRACT>
    else if (/^[^\*]+\*[^\*]+\*(true|false)$/i.test(parameter)) {
      params = parameter.split(/\*/);
      extract = params[2].trim();
    }
    // <URL>*<EXTRACT>
    else if (/^[^\*]+\*(true|false)$/i.test(parameter)) {
      params = parameter.split(/\*/);
      extract = params[1].trim();
    }
  }
  else if (Utils.isObject(parameter)) {
    extract = Utils.normalize(parameter.extract);
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (!Utils.isNullOrEmpty(extract)) {
    extract = /^1|(true)$/i.test(extract);
  }
  else {
    extract = undefined;
  }
  return extract;
}

/**
 * Parses the parameter in order to get the options
 * @private
 * @function
 */
const getOptionsKML = parameter => {
  let options;
  if (Utils.isString(parameter)) {
    // TODO ver como se pone el parámetro
  }
  else if (Utils.isObject(parameter)) {
    options = parameter.options;
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return options;
}

/**
 * Parses the specified user layer Mapbox parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.KML|Array<Mx.parameters.KML>}
 * @public
 * @function
 * @api stable
 */
export const mapbox = userParameters => {
  let layers = [];

  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!Utils.isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.Map((userParam) => {
    let layerObj = {};

    // gets the layer type
    layerObj.type = LayerType.Mapbox;

    // gets the name
    layerObj.url = getURLMapbox(userParam);

    // gets the name
    layerObj.name = getNameMapbox(userParam);

    // gets the transparent
    layerObj.transparent = getTransparentMapbox(userParam);

    // gets the accessToken
    layerObj.accessToken = getAccessTokenMapbox(userParam);

    // gets the legend
    layerObj.legend = getLegendMapbox(userParam);

    return layerObj;
  });

  if (!Utils.isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
}

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getURLMapbox = parameter => {
  let url;
  if (Utils.isString(parameter)) {
    url = null; // URL by string type no supported
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.url)) {
    url = parameter.url.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return url;
}

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getAccessTokenMapbox = parameter => {
  let accessToken;
  if (Utils.isString(parameter)) {
    accessToken = null; // accessToken by string type no supported
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.accessToken)) {
    accessToken = parameter.accessToken.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return accessToken;
}

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameMapbox = parameter => {
  let name, params;
  if (Utils.isString(parameter)) {
    if (/^MAPBOX\*.+/i.test(parameter)) {
      // <MAPBOX>*<NAME>(*<TRANSPARENT>)?(*<TITLE>)?
      if (/^MAPBOX\*[^\*]+(\*[^\*]+){0,2}/i.test(parameter)) {
        params = parameter.split(/\*/);
        name = params[1].trim();
      }
    }
    // <NAME>(*<TRANSPARENT>)?(*<TITLE>)?
    else if (/^[^\*]+(\*[^\*]+){0,2}/.test(parameter)) {
      params = parameter.split(/\*/);
      name = params[0].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.name)) {
    name = parameter.name.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(name) || /^(true|false)$/i.test(name)) {
    name = null;
  }
  return name;
}

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getTransparentMapbox = parameter => {
  let transparent, params;
  if (Utils.isString(parameter)) {
    if (/^MAPBOX\*.+/i.test(parameter)) {
      // <MAPBOX>*<NAME>*<TRANSPARENT>(*<TITLE>)?
      if (/^MAPBOX\*[^\*]+\*[^\*]+(\*[^\*]+)?/i.test(parameter)) {
        params = parameter.split(/\*/);
        transparent = params[2].trim();
      }
    }
    // <NAME>*<TRANSPARENT>(*<TITLE>)?
    else if (/^[^\*]+\*[^\*]+(\*[^\*]+)?/.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = params[1].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.transparent)) {
    transparent = Utils.normalize(parameter.transparent);
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  if (!Utils.isNullOrEmpty(transparent)) {
    transparent = /^1|(true)$/i.test(transparent);
  }
  return transparent;
}

/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getLegendMapbox = parameter => {
  let legend, params;
  if (Utils.isString(parameter)) {
    if (/^MAPBOX\*.+/i.test(parameter)) {
      // <MAPBOX>*<NAME>*<TRANSPARENT>*<TITLE>
      if (/^MAPBOX\*[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        legend = params[3].trim();
      }
    }
    // <NAME>*<TRANSPARENT>*<TITLE>
    else if (/^[^\*]+\*[^\*]+\*[^\*]+/.test(parameter)) {
      params = parameter.split(/\*/);
      legend = params[2].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.legend)) {
    legend = parameter.legend.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(legend) || /^(true|false)$/i.test(legend)) {
    legend = null;
  }
  return legend;
}

/**
 * Parses the specified user layer KML parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.KML|Array<Mx.parameters.KML>}
 * @public
 * @function
 * @api stable
 */
export const osm = userParameters => {
  let layers = [];

  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(userParameters)) {
    userParameters = {
      'type': LayerType.OSM,
      'name': 'osm'
    };
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!Utils.isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    let layerObj = {};

    // gets the layer type
    layerObj.type = LayerType.OSM;

    // gets the name
    layerObj.name = getNameOSM(userParam);

    // gets the transparent
    layerObj.transparent = getTransparentOSM(userParam);

    // gets the legend
    layerObj.legend = getLegendOSM(userParam);

    return layerObj;
  });

  if (!Utils.isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
}

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameOSM = parameter => {
  let name;
  if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.name)) {
    name = parameter.name.trim();
  }
  if (!Utils.isNullOrEmpty(name) && (Utils.isUrl(name) || /^(true|false)$/i.test(name))) {
    name = null;
  }
  return name;
}

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getTransparentOSM = parameter => {
  let transparent, params;
  if (Utils.isString(parameter)) {
    // <OSM>*<TRANSPARENT>(*<TITLE>)?
    if (/^OSM\*[^\*]+(\*[^\*]+)?/i.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = params[1].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.transparent)) {
    transparent = Utils.normalize(parameter.transparent);
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  if (!Utils.isNullOrEmpty(transparent)) {
    transparent = /^1|(true)$/i.test(transparent);
  }
  return transparent;
}

/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getLegendOSM = parameter => {
  let legend, params;
  if (Utils.isString(parameter)) {
    // <OSM>*(<TRANSPARENT>)?*<TITLE>
    if (/^OSM\*([^\*]+)?\*[^\*]+/i.test(parameter)) {
      params = parameter.split(/\*/);
      legend = params[2].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.legend)) {
    legend = parameter.legend.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(legend) || /^(true|false)$/i.test(legend)) {
    legend = null;
  }
  return legend;
}

/**
 * Parses the specified user layer WFS parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.WFS|Array<Mx.parameters.WFS>}
 * @public
 * @function
 * @api stable
 */
export const wfs = userParameters => {
  let layers = [];

  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!Utils.isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    let layerObj = {};

    // gets the layer type
    layerObj.type = LayerType.WFS;

    // gets the name
    layerObj.name = getNameWFS(userParam);

    // gets the URL
    layerObj.url = getURLWFS(userParam);

    // gets the name
    layerObj.namespace = getNamespaceWFS(userParam);

    // gets the legend
    layerObj.legend = getLegendWFS(userParam);

    // gets the CQL filter
    layerObj.cql = getCQLWFS(userParam);

    // gets the geometry
    layerObj.geometry = getGeometryWFS(userParam);

    // gets the ids
    layerObj.ids = getIdsWFS(userParam);

    // gets the version
    layerObj.version = getVersionWFS(userParam);

    // gets the options
    layerObj.options = getOptionsWFS(userParam);

    // format specified by the user when create object WFS
    layerObj.outputFormat = userParameters.outputFormat;

    return layerObj;
  });

  if (!Utils.isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
}

/**
 * Parses the parameter in order to get the service URL
 * @private
 * @function
 */
const getURLWFS = parameter => {
  let url;
  if (Utils.isString(parameter)) {
    let urlMatches = parameter.match(/^([^\*]*\*)*(https?\:\/\/[^\*]+)([^\*]*\*?)*$/i);
    if (urlMatches && (urlMatches.length > 2)) {
      url = urlMatches[2];
    }
  }
  else if (Utils.isObject(parameter)) {
    url = parameter.url;
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return url;
}

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameWFS = parameter => {
  let name, params, namespaceName;
  if (Utils.isString(parameter)) {
    if (/^WFS(T)?\*.+/i.test(parameter)) {
      // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>
      if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+/i.test(parameter) || /^[^\*]*\*[^\*]+\:[^\*]+/.test(parameter)) {
        params = parameter.split(/\*/);
        namespaceName = params[3].trim();
        name = namespaceName.split('\:')[1];
      }
      else if (/^WFS(T)?\*[^\*]*\*[^\*]+[^\*]+/i.test(parameter)) {
        // <WFS(T)?>*(<TITLE>)?*<URL>*<NAME>
        params = parameter.split(/\*/);
        name = params[3].trim();
      }
    }
    // <URL>*<NAMESPACE>:<NAME>
    else if (/^[^\*]*\*[^\*]+\:[^\*]+/.test(parameter)) {
      params = parameter.split(/\*/);
      namespaceName = params[1].trim();
      name = namespaceName.split('\:')[1];
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.name)) {
    name = parameter.name.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(name) || /^(true|false)$/i.test(name)) {
    name = null;
  }
  return name;
}

/**
 * Parses the parameter in order to get the layer namespace
 * @private
 * @function
 */
const getNamespaceWFS = parameter => {
  let namespace, params, namespaceName;
  if (Utils.isString(parameter)) {
    if (/^WFS(T)?\*.+/i.test(parameter)) {
      // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>
      if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        namespaceName = params[3].trim();
        namespace = namespaceName.split('\:')[0];
      }
    }
    // <URL>*<NAMESPACE>:<NAME>
    else if (/^[^\*]*\*[^\*]+\:[^\*]+/.test(parameter)) {
      params = parameter.split(/\*/);
      namespaceName = params[1].trim();
      namespace = namespaceName.split('\:')[0];
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.namespace)) {
    namespace = parameter.namespace.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(namespace) || /^(true|false)$/i.test(namespace)) {
    namespace = null;
  }
  return namespace;
}

/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getLegendWFS = parameter => {
  let legend, params;
  if (Utils.isString(parameter)) {
    // <WFS(T)?>*<TITLE>*<URL>...
    if (/^WFS(T)?\*[^\*]/i.test(parameter)) {
      params = parameter.split(/\*/);
      legend = params[1].trim();
    }
    // <URL>*<NAMESPACE>:<NAME>*<TITLE>
    else if (/^[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+/.test(parameter)) {
      params = parameter.split(/\*/);
      legend = params[2].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.legend)) {
    legend = parameter.legend.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(legend) || /^(true|false)$/i.test(legend)) {
    legend = null;
  }
  return legend;
}

/**
 * Parses the parameter in order to get the CQL filter
 * @private
 * @function
 */
const getCQLWFS = parameter => {
  let cql, params;
  if (Utils.isString(parameter)) {
    // URL*NAMESPACE:NAME*TITLE*CQL
    if (/^[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
      params = parameter.split(/\*/);
      cql = params[3].trim();
    }
    // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>*<ID>*<CQL>
    if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+\*[^\*]*\*[^\*]*/i.test(parameter)) {
      params = parameter.split(/\*/);
      cql = params[6].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.cql) || !Utils.isNullOrEmpty(parameter.ecql)) {
    cql = parameter.cql ? parameter.cql.trim() : parameter.ecql.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (/^(true|false)$/i.test(cql) || /^\d\.\d\.\d$/.test(cql)) {
    cql = undefined;
  }
  return cql;
}

/**
 * Parses the parameter in order to get the layer geometry
 * @private
 * @function
 */
const getGeometryWFS = parameter => {
  let geometry, params;
  if (Utils.isString(parameter)) {
    if (/^WFS(T)?\*.+/i.test(parameter)) {
      // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>
      if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        geometry = params[4].trim();
      }
      else if (/^WFS(T)?\*[^\*]*\*[^\*][^\*]+\*[^\*]+/i.test(parameter)) {
        // <WFS(T)?>*(<TITLE>)?*<URL>*<NAME>*<GEOM>
        params = parameter.split(/\*/);
        geometry = params[4].trim();
      }
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.geometry)) {
    geometry = parameter.geometry.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(geometry) || /^(true|false)$/i.test(geometry)) {
    geometry = null;
  }
  return geometry;
}

/**
 * Parses the parameter in order to get the layer namespace
 * @private
 * @function
 */
const getIdsWFS = parameter => {
  let ids, params;
  if (Utils.isString(parameter)) {
    if (/^WFS(T)?\*.+/i.test(parameter)) {
      // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>*<FEATURE_ID1>-<FEATURE_ID2>...
      if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\:[^\*]+\*[^\*]+\*(.\-?)+$/i.test(parameter)) {
        params = parameter.split(/\*/);
        ids = params[5].trim().split('\-');
      }
      else if (/^WFS(T)?\*[^\*]*\*[^\*]+\*[^\*]+\*[^\*]+\*(.\-?)+$/i.test(parameter)) {
        // <WFS(T)?>*(<TITLE>)?*<URL>*<NAME>*<GEOM>*<FEATURE_ID1>-<FEATURE_ID2>...
        params = parameter.split(/\*/);
        ids = params[5].trim().split('\-');
      }
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.ids)) {
    ids = parameter.ids;
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(ids)) {
    ids = null;
  }

  if (!Utils.isNullOrEmpty(ids) && !Utils.isArray(ids)) {
    ids = [ids];
  }
  return ids;
}


/**
 * Parses the parameter in order to get the version
 * @private
 * @function
 */
const getVersionWFS = parameter => {
  let version;
  if (Utils.isString(parameter)) {
    if (/(\d\.\d\.\d)$/.test(parameter)) {
      version = parameter.match(/\d\.\d\.\d$/)[0];
    }
  }
  else if (Utils.isObject(parameter)) {
    version = parameter.version;
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return version;
}

/**
 * Parses the parameter in order to get the options
 * @private
 * @function
 */
const getOptionsWFS = parameter => {
  let options;
  if (Utils.isString(parameter)) {
    // TODO ver como se pone el parámetro
  }
  else if (Utils.isObject(parameter)) {
    options = parameter.options;
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return options;
}


/**
 * Parses the specified user layer WMC parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.WMC|Array<Mx.parameters.WMC>}
 * @public
 * @function
 * @api stable
 */
export const wmc = userParameters => {
  let layers = [];

  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!Utils.isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    let layerObj = {};

    // gets the layer type
    layerObj.type = LayerType.WMC;

    // gets the name
    layerObj.name = getNameWMC(userParam);

    // gets the URL
    layerObj.url = getURLWMC(userParam);

    // gets the options
    layerObj.options = getOptionsWMC(userParam);

    return layerObj;
  });

  if (!Utils.isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
}

/**
 * Parses the parameter in order to get the service URL
 * @private
 * @function
 */
const getURLWMC = parameter => {
  let url;
  if (Utils.isString(parameter)) {
    let urlMatches = parameter.match(/^([^\*]*\*)*(https?\:\/\/[^\*]+)([^\*]*\*?)*$/i);
    if (urlMatches && (urlMatches.length > 2)) {
      url = urlMatches[2];
    }
  }
  else if (Utils.isObject(parameter)) {
    url = parameter.url;
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return url;
}

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameWMC = (parameter, type) => {
  let name, params;
  if (Utils.isString(parameter)) {
    // <WMC>*<URL>*<NAME>
    if (/^\w{3,7}\*[^\*]+\*[^\*]+$/.test(parameter)) {
      params = parameter.split(/\*/);
      name = params[2].trim();
    }
    // <WMC>*(<PREDEFINED_NAME> OR <URL>)
    else if (/^\w{3,7}\*[^\*]$/.test(parameter)) {
      params = parameter.split(/\*/);
      name = params[1].trim();
    }
    // (<URL>*<NAME>)
    else if (/^[^\*]+\*[^\*]+$/.test(parameter)) {
      params = parameter.split(/\*/);
      name = params[1].trim();
    }
    // (<PREDEFINED_NAME> OR <URL>)
    else if (/^[^\*]+$/.test(parameter) && !Utils.isUrl(parameter)) {
      name = parameter;
    }
  }
  else if (Utils.isObject(parameter)) {
    name = Utils.normalize(parameter.name);
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(name)) {
    name = null;
  }
  return name;
}

/**
 * Parses the parameter in order to get the options
 * @private
 * @function
 */
const getOptionsWMC = parameter => {
  let options;
  if (Utils.isString(parameter)) {
    // TODO ver como se pone el parámetro
  }
  else if (Utils.isObject(parameter)) {
    options = parameter.options;
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return options;
}


/**
 * Parses the specified user layer WMS parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.WMS|Array<Mx.parameters.WMS>}
 * @public
 * @function
 * @api stable
 */
export const WMS = userParameters => {
  let layers = [];

  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!Utils.isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.Map((userParam) => {
    let layerObj = {};

    // gets the layer type
    layerObj.type = LayerType.WMS;

    // gets the name
    layerObj.name = getNameWMS(userParam);

    // gets the URL
    layerObj.url = getURLWMS(userParam);

    // gets the legend
    layerObj.legend = getLegendWMS(userParam);

    // gets the transparence
    layerObj.transparent = getTransparentWMS(userParam);

    // gets the tiled
    layerObj.tiled = getTiledWMS(userParam);

    // gets the CQL filter
    layerObj.cql = getCQLWMS(userParam);

    // gets the version
    layerObj.version = getVersionWMS(userParam);

    // gets the options
    layerObj.options = getOptionsWMS(userParam);

    return layerObj;
  });

  if (!Utils.isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};

/**
 * Parses the parameter in order to get the service URL
 * @private
 * @function
 */
const getURLWMS = parameter => {
  let url;
  if (Utils.isString(parameter)) {
    let urlMatches = parameter.match(/^([^\*]*\*)*(https?\:\/\/[^\*]+)([^\*]*\*?)*$/i);
    if (urlMatches && (urlMatches.length > 2)) {
      url = urlMatches[2];
    }
  }
  else if (Utils.isObject(parameter)) {
    url = parameter.url;
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return url;
}

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameWMS = parameter => {
  let name, params;
  if (Utils.isString(parameter)) {
    if (/^WMS\*.+/i.test(parameter)) {
      // <WMS>*<TITLE>*<URL>*<NAME>
      if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        name = params[3].trim();
      }
    }
    // <URL>*<NAME>
    else if (/^[^\*]*\*[^\*]+/.test(parameter)) {
      params = parameter.split(/\*/);
      name = params[1].trim();
    }
    // <NAME>
    else if (/^[^\*]*/.test(parameter)) {
      params = parameter.split(/\*/);
      name = params[0].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.name)) {
    name = parameter.name.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(name) || /^(true|false)$/i.test(name)) {
    name = null;
  }
  return name;
}

/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getLegendWMS = parameter => {
  let legend, params;
  if (Utils.isString(parameter)) {
    // <WMS>*<TITLE>
    if (/^WMS\*[^\*]/i.test(parameter)) {
      params = parameter.split(/\*/);
      legend = params[1].trim();
    }
    // <URL>*<NAME>*<TITLE>
    else if (/^[^\*]+\*[^\*]+\*[^\*]+/.test(parameter)) {
      params = parameter.split(/\*/);
      legend = params[2].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.legend)) {
    legend = parameter.legend.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(legend) || /^(true|false)$/i.test(legend)) {
    legend = null;
  }
  return legend;
}

/**
 * Parses the parameter in order to get the transparence
 * @private
 * @function
 */
const getTransparentWMS = parameter => {
  let transparent, params;
  if (Utils.isString(parameter)) {
    // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>
    if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = params[4].trim();
    }
    // <WMS_FULL>*<URL>(*<TILED>)?
    else if (/^WMS_FULL\*[^\*]+(\*(true|false))?/i.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = true;
    }
    // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>
    else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = params[3].trim();
    }
    // <URL>*<NAME>*<TRANSPARENCE>
    else if (/^[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = params[2].trim();
    }
  }
  else if (Utils.isObject(parameter)) {
    transparent = Utils.normalize(parameter.transparent);
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  if (!Utils.isNullOrEmpty(transparent)) {
    transparent = /^1|(true)$/i.test(transparent);
  }
  return transparent;
}

/**
 * Parses the parameter in order to get the layer tile
 * @private
 * @function
 */
const getTiledWMS = parameter => {
  let tiled, params;
  if (Utils.isString(parameter)) {
    // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>*<TILED>
    if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*(true|false)$/i.test(parameter)) {
      params = parameter.split(/\*/);
      tiled = params[5].trim();
    }
    else if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
      tiled = true;
    }
    // <WMS_FULL>*<URL>*<TILED>
    else if (/^WMS_FULL\*[^\*]+\*(true|false)/i.test(parameter)) {
      params = parameter.split(/\*/);
      tiled = params[2].trim();
    }
    // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>*<TILED>
    else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*(true|false)/i.test(parameter)) {
      params = parameter.split(/\*/);
    }
    // <URL>*<NAME>*<TRANSPARENCE>*<TILED>
    else if (/^[^\*]+\*[^\*]+\*(true|false)\*(true|false)/i.test(parameter)) {
      params = parameter.split(/\*/);
    }
  }
  else if (Utils.isObject(parameter)) {
    tiled = Utils.normalize(parameter.tiled);
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  if (!Utils.isNullOrEmpty(tiled)) {
    tiled = /^1|(true)$/i.test(tiled);
  }
  return tiled;
}

/**
 * Parses the parameter in order to get the CQL filter
 * @private
 * @function
 */
const getCQLWMS = parameter => {
  let cql, params;
  if (Utils.isString(parameter)) {
    // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>*<TILED>
    if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*(true|false)$/i.test(parameter)) {
      params = parameter.split(/\*/);
      cql = params[5].trim();
    }
    else if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
      cql = true;
    }
    // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>*<TILED>*<CQL>
    else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*(true|false)\*[^\*]+/i.test(parameter)) {
      params = parameter.split(/\*/);
      cql = params[5].trim();
    }
    // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>*<CQL>
    else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)\*[^\*]+/i.test(parameter)) {
      params = parameter.split(/\*/);
      cql = params[4].trim();
    }
    // <URL>*<NAME>*<TITLE>*<CQL>
    else if (/^[^\*]+\*[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
      params = parameter.split(/\*/);
      cql = params[3].trim();
    }
    // <URL>*<NAME>*<TRANSPARENCE>*<TILED>*<CQL>
    else if (/^[^\*]+\*[^\*]+\*(true|false)\*(true|false)\*[^\*]+/i.test(parameter)) {
      params = parameter.split(/\*/);
      cql = params[4].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.cql)) {
    cql = parameter.cql.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (/^(true|false)$/i.test(cql) || /^\d\.\d\.\d$/.test(cql)) {
    cql = undefined;
  }
  return cql;
}

/**
 * Parses the parameter in order to get the version
 * @private
 * @function
 */
const getVersionWMS = parameter => {
  let version;
  if (Utils.isString(parameter)) {
    if (/(\d\.\d\.\d)$/.test(parameter)) {
      version = parameter.match(/\d\.\d\.\d$/)[0];
    }
  }
  else if (Utils.isObject(parameter)) {
    version = parameter.version;
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return version;
}

/**
 * Parses the parameter in order to get the options
 * @private
 * @function
 */
const getOptionsWMS = parameter => {
  let options;
  if (Utils.isString(parameter)) {
    // TODO ver como se pone el parámetro
  }
  else if (Utils.isObject(parameter)) {
    options = parameter.options;
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return options;
}



/**
 * Parses the specified user layer WMTS parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.WMTS|Array<Mx.parameters.WMTS>}
 * @public
 * @function
 * @api stable
 */
export const WMTS = userParameters => {
  let layers = [];

  // checks if the param is null or empty
  if (Utils.isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!Utils.isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    let layerObj = {};

    // gets the layer type
    layerObj.type = LayerType.WMTS;

    // gets the name
    layerObj.name = getNameWMTS(userParam);

    // gets the URL
    layerObj.url = getURLWMTS(userParam);

    // gets the matrix set
    layerObj.matrixSet = getMatrixSetWMTS(userParam);

    // gets the legend
    layerObj.legend = getLegendWMTS(userParam);

    // gets the options
    layerObj.options = getOptionsWMTS(userParam);

    // gets transparent
    layerObj.transparent = getTransparentWMTS(userParam);

    return layerObj;
  });

  if (!Utils.isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
}

/**
 * Parses the parameter in order to get the service URL
 * @private
 * @function
 */
const getURLWMTS = parameter => {
  let url;
  if (Utils.isString(parameter)) {
    let urlMatches = parameter.match(/^([^\*]*\*)*(https?\:\/\/[^\*]+)([^\*]*\*?)*$/i);
    if (urlMatches && (urlMatches.length > 2)) {
      url = urlMatches[2];
    }
  }
  else if (Utils.isObject(parameter)) {
    url = parameter.url;
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return url;
}

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameWMTS = parameter => {
  let name, params;
  if (Utils.isString(parameter)) {
    if (/^WMTS\*.+/i.test(parameter)) {
      // <WMTS>*<URL>*<NAME>(*<MATRIXSET>*<TITLE>)?
      if (/^WMTS\*[^\*]+\*[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        name = params[2].trim();
      }
    }
    // <URL>*<NAME>
    else if (/^[^\*]*\*[^\*]+/.test(parameter)) {
      params = parameter.split(/\*/);
      name = params[1].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.name)) {
    name = parameter.name.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(name) || /^(true|false)$/i.test(name)) {
    name = null;
  }
  return name;
}

/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getMatrixSetWMTS = parameter => {
  let matrixSet, params;
  if (Utils.isString(parameter)) {
    // <WMTS>*<URL>*<NAME>*<MATRIXSET>
    if (/^WMTS\*[^\*]+\*[^\*]+\*[^\*]+/i.test(parameter)) {
      params = parameter.split(/\*/);
      matrixSet = params[3].trim();
    }
    // <URL>*<NAME>*<MATRIXSET>
    else if (/^[^\*]+\*[^\*]+\*[^\*]+/.test(parameter)) {
      params = parameter.split(/\*/);
      matrixSet = params[2].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.matrixSet)) {
    matrixSet = parameter.matrixSet.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(matrixSet) || /^(true|false)$/i.test(matrixSet)) {
    matrixSet = null;
  }
  return matrixSet;
}

/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getLegendWMTS = parameter => {
  let legend, params;
  if (Utils.isString(parameter)) {
    if (/^WMTS\*.+/i.test(parameter)) {
      // <WMTS>*<URL>*<NAME>*<MATRIXSET>?*<TITLE>
      if (/^WMTS\*[^\*]+\*[^\*]+\*[^\*]*\*[^\*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        legend = params[4].trim();
      }
    }
    // <URL>*<NAME>(*<MATRIXSET>)?*<TITLE>
    else if (/^[^\*]+\*[^\*]+\*[^\*]*\*[^\*]+/.test(parameter)) {
      params = parameter.split(/\*/);
      legend = params[3].trim();
    }
  }
  else if (Utils.isObject(parameter) && !Utils.isNullOrEmpty(parameter.legend)) {
    legend = parameter.legend.trim();
  }
  else if (!Utils.isObject(parameter)) {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }

  if (Utils.isUrl(legend) || /^(true|false)$/i.test(legend)) {
    legend = null;
  }
  return legend;
}

/**
 * Parses the parameter in order to get the options
 * @private
 * @function
 */
const getOptionsWMTS = parameter => {
  let options;
  if (Utils.isString(parameter)) {
    // TODO ver como se pone el parámetro
  }
  else if (Utils.isObject(parameter)) {
    options = parameter.options;
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  return options;
}

/**
 * Parses the parameter in order to get the transparence
 * @private
 * @function
 */
const getTransparentWMTS = parameter => {
  let transparent, params;
  if (Utils.isString(parameter)) {
    // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>
    if (/^WMS\*[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = params[4].trim();
    }
    // <WMS_FULL>*<URL>(*<TILED>)?
    else if (/^WMS_FULL\*[^\*]+(\*(true|false))?/i.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = true;
    }
    // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>
    else if (/^[^\*]+\*[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = params[3].trim();
    }
    // <URL>*<NAME>*<TRANSPARENCE>
    else if (/^[^\*]+\*[^\*]+\*(true|false)/i.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = params[2].trim();
    }
  }
  else if (Utils.isObject(parameter)) {
    transparent = Utils.normalize(parameter.transparent);
  }
  else {
    Exception('El parámetro no es de un tipo soportado: ' + (typeof parameter));
  }
  if (!Utils.isNullOrEmpty(transparent)) {
    transparent = /^1|(true)$/i.test(transparent);
  }
  return transparent;
}
