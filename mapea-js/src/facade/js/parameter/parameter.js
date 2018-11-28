/**
 * @module M/parameter
 */
import { isNullOrEmpty, isString, isNull, isFunction, normalize, isArray, isObject, isUrl, isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import * as LayerType from '../layer/Type';
import Layer from '../layer/Layer';

/**
 * Parses the specified user center parameter into an object
 *
 * @param {String|Array<String>|Array<Number>|Mx.Center} centerParameter parameters
 * provided by the user
 * @returns {Mx.Center}
 * @public
 * @function
 * @api
 */
export const center = (centerParameterVar) => {
  let centerParameter = centerParameterVar;
  const centerParam = {};
  // checks if the param is null or empty
  if (isNullOrEmpty(centerParameter)) {
    Exception('No ha especificado ningún parámetro center');
  }
  // string
  if (isString(centerParameter)) {
    centerParameter = normalize(centerParameter);
    if (/^-?\d+(\.\d+)?[,;]-?\d+(\.\d+)?([*](true|false))?$/i.test(centerParameter)) {
      const centerArray = centerParameter.split(/\*/);
      const coord = centerArray[0];
      const draw = centerArray[1];
      const coordArray = coord.split(/[,;]+/);
      if (coordArray.length === 2) {
        centerParam.x = Number.parseFloat(coordArray[0]);
        centerParam.y = Number.parseFloat(coordArray[1]);
      } else {
        Exception('El formato del parámetro center no es correcto');
      }
      centerParam.draw = /^1|(true)$/i.test(draw);
    } else {
      Exception('El formato del parámetro center no es correcto');
    }
  } else if (isArray(centerParameter)) {
    // array
    if ((centerParameter.length === 2) || (centerParameter.length === 3)) {
      if (isString(centerParameter[0])) {
        centerParameter[0] = Number.parseFloat(centerParameter[0]);
      }
      if (isString(centerParameter[1])) {
        centerParameter[1] = Number.parseFloat(centerParameter[1]);
      }
      centerParam.x = centerParameter[0];
      centerParam.y = centerParameter[1];
    } else {
      Exception('El formato del parámetro center no es correcto');
    }
  } else if (isObject(centerParameter)) {
    // object
    // x
    if (!isNull(centerParameter.x)) {
      if (isString(centerParameter.x)) {
        centerParameter.x = Number.parseFloat(centerParameter.x);
      }
      centerParam.x = centerParameter.x;
    } else {
      Exception('El formato del parámetro center no es correcto');
    }
    // y
    if (!isNull(centerParameter.y)) {
      if (isString(centerParameter.y)) {
        centerParameter.y = Number.parseFloat(centerParameter.y);
      }
      centerParam.y = centerParameter.y;
    } else {
      Exception('El formato del parámetro center no es correcto');
    }
    // draw
    if (!isNull(centerParameter.draw)) {
      centerParam.draw = /^true$/.test(centerParameter.draw);
    } else {
      centerParam.draw = false;
    }
  } else {
    // unknown
    Exception(`El parámetro no es de un tipo soportado: ${typeof maxExtentParameter}`);
  }

  if (Number.isNaN(centerParam.x) || Number.isNaN(centerParam.y)) {
    Exception('El formato del parámetro center no es correcto');
  }

  return centerParam;
};

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameKML = (parameter) => {
  let name;
  let params;
  if (isString(parameter)) {
    if (/^KML\*.+/i.test(parameter)) {
      // <KML>*<NAME>*<URL>(*<FILENAME>)?*<EXTRACT>
      if (/^KML\*[^*]+\*[^*]+(\*[^*]+)?(\*(true|false))?$/i.test(parameter)) {
        params = parameter.split(/\*/);
        name = params[1].trim();
      }
    } else if (/^[^*]*\*[^*]+/.test(parameter)) {
      // <NAME>*<URL>(*<FILENAME>)?(*<EXTRACT>)?
      params = parameter.split(/\*/);
      name = params[0].trim();
    } else if (/^[^*]*/.test(parameter)) {
      // <NAME>(*<URL>(*<FILENAME>)?(*<EXTRACT>)?)? filtering
      params = parameter.split(/\*/);
      name = params[0].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.name)) {
    name = parameter.name.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(name) || /^(true|false)$/i.test(name)) {
    name = null;
  }
  return name;
};
/**
 * Parses the parameter in order to get the type
 * @private
 * @function
 */
const getType = (parameter, forcedType) => {
  let type;
  if (isString(parameter)) {
    if (/^\s*osm\s*$/i.test(parameter)) {
      type = LayerType.OSM;
    } else if (/^\s*mapbox\*.+$/i.test(parameter)) {
      type = LayerType.Mapbox;
    } else {
      const typeMatches = parameter.match(/^(\w+)\*.+$/);
      if (typeMatches && (typeMatches.length > 1)) {
        type = LayerType.parse(typeMatches[1]);
        if (isUndefined(type)) {
          Exception(`No se reconoce el tipo de capa ${typeMatches[1]}`);
        }
      }
      if (isUndefined(type) && !isNullOrEmpty(forcedType)) {
        type = forcedType;
      } else if (isUndefined(type)) {
        Exception(`No se reconoce el tipo de capa ${type}`);
      }
    }
  } else if (isObject(parameter)) {
    if (!isNullOrEmpty(parameter.type)) {
      type = LayerType.parse(parameter.type);
      if (isUndefined(type)) {
        Exception(`No se reconoce el tipo de capa ${type}`);
      }
    }
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (!isNullOrEmpty(type) && !isNullOrEmpty(forcedType) && (type !== forcedType)) {
    Exception('El tipo de la capa ('.concat(type)
      .concat(') no era el esperado (').concat(forcedType).concat(')'));
  }

  if (isNullOrEmpty(type) && !isNullOrEmpty(forcedType)) {
    type = forcedType;
  }
  return type;
};

/**
 * Parses the parameter in order to get the transparence
 * @private
 * @function
 */
const getExtractKML = (parameter) => {
  let extract;
  let params;
  if (isString(parameter)) {
    // <KML>*<NAME>*<URL>(*<FILENAME>)?*<EXTRACT>
    if (/^KML\*[^*]+\*[^*]+(\*[^*]+)?(\*(true|false))?$/i.test(parameter)) {
      params = parameter.split(/\*/);
      extract = params[params.length - 1].trim();
    } else if (/^[^*]+\*[^*]+\*(true|false)$/i.test(parameter)) {
      // <NAME>*<URL>*<EXTRACT>
      params = parameter.split(/\*/);
      extract = params[2].trim();
    } else if (/^[^*]+\*(true|false)$/i.test(parameter)) {
      // <URL>*<EXTRACT>
      params = parameter.split(/\*/);
      extract = params[1].trim();
    }
  } else if (isObject(parameter)) {
    extract = normalize(parameter.extract);
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (!isNullOrEmpty(extract)) {
    extract = /^1|(true)$/i.test(extract);
  } else {
    extract = undefined;
  }
  return extract;
};

/**
 * Parses the parameter in order to get the options
 * @private
 * @function
 */
const getOptionsKML = (parameter) => {
  let options;
  if (isString(parameter)) {
    // TODO ver como se pone el parámetro
  } else if (isObject(parameter)) {
    options = parameter.options;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return options;
};

/**
 * Parses the specified user maxExtent parameter into an object
 *
 * @param {String|Array<String>|Array<Number>|Mx.Extent} maxExtentParameter parameters
 * provided by the user
 * @returns {Mx.Extent}
 * @public
 * @function
 * @api
 */
export const maxExtent = (maxExtentParam) => {
  const maxExtentParameter = maxExtentParam;
  const maxExtentVar = {
    x: {},
    y: {},
  };

  // checks if the param is null or empty
  if (isNullOrEmpty(maxExtentParameter)) {
    Exception('No ha especificado ningún parámetro maxExtent');
  }

  // string
  if (isString(maxExtentParameter)) {
    if (/^\s*-?\d+(\.\d+)?\s*[,;]\s*-?\d+(\.\d+)?\s*[,;]\s*-?\d+(\.\d+)?\s*[,;]\s*-?\d+(\.\d+)?$/.test(maxExtentParameter)) {
      const extentArray = maxExtentParameter.split(/[,;]+/);
      if (extentArray.length === 4) {
        maxExtentVar.x.min = Number.parseFloat(extentArray[0]);
        maxExtentVar.y.min = Number.parseFloat(extentArray[1]);
        maxExtentVar.x.max = Number.parseFloat(extentArray[2]);
        maxExtentVar.y.max = Number.parseFloat(extentArray[3]);
      } else {
        Exception('El formato del parámetro maxExtent no es correcto');
      }
    } else {
      Exception('El formato del parámetro maxExtent no es correcto');
    }
  } else if (isArray(maxExtentParameter)) {
    // array
    if (maxExtentParameter.length === 4) {
      if (isString(maxExtentParameter[0])) {
        maxExtentParameter[0] = Number.parseFloat(maxExtentParameter[0]);
      }
      if (isString(maxExtentParameter[1])) {
        maxExtentParameter[1] = Number.parseFloat(maxExtentParameter[1]);
      }
      if (isString(maxExtentParameter[2])) {
        maxExtentParameter[2] = Number.parseFloat(maxExtentParameter[2]);
      }
      if (isString(maxExtentParameter[3])) {
        maxExtentParameter[3] = Number.parseFloat(maxExtentParameter[3]);
      }
      maxExtentVar.x.min = maxExtentParameter[0];
      maxExtentVar.y.min = maxExtentParameter[1];
      maxExtentVar.x.max = maxExtentParameter[2];
      maxExtentVar.y.max = maxExtentParameter[3];
    } else {
      Exception('El formato del parámetro maxExtent no es correcto');
    }
  } else if (isObject(maxExtentParameter)) {
    // object
    // x min
    if (!isNull(maxExtentParameter.left)) {
      if (isString(maxExtentParameter.left)) {
        maxExtentParameter.left = Number.parseFloat(maxExtentParameter.left);
      }
      maxExtentVar.x.min = maxExtentParameter.left;
    } else if (!isNull(maxExtentParameter.x.min)) {
      if (isString(maxExtentParameter.x.min)) {
        maxExtentParameter.x.min = Number.parseFloat(maxExtentParameter.x.min);
      }
      maxExtentVar.x.min = maxExtentParameter.x.min;
    } else {
      Exception('El formato del parámetro maxExtent no es correcto');
    }
    // y min
    if (!isNull(maxExtentParameter.bottom)) {
      if (isString(maxExtentParameter.bottom)) {
        maxExtentParameter.bottom = Number.parseFloat(maxExtentParameter.bottom);
      }
      maxExtentVar.y.min = maxExtentParameter.bottom;
    } else if (!isNull(maxExtentParameter.y.min)) {
      if (isString(maxExtentParameter.y.min)) {
        maxExtentParameter.y.min = Number.parseFloat(maxExtentParameter.y.min);
      }
      maxExtentVar.y.min = maxExtentParameter.y.min;
    } else {
      Exception('El formato del parámetro maxExtent no es correcto');
    }
    // x max
    if (!isNull(maxExtentParameter.right)) {
      if (isString(maxExtentParameter.right)) {
        maxExtentParameter.right = Number.parseFloat(maxExtentParameter.right);
      }
      maxExtentVar.x.max = maxExtentParameter.right;
    } else if (!isNull(maxExtentParameter.x.max)) {
      if (isString(maxExtentParameter.x.max)) {
        maxExtentParameter.x.max = Number.parseFloat(maxExtentParameter.x.max);
      }
      maxExtentVar.x.max = maxExtentParameter.x.max;
    } else {
      Exception('El formato del parámetro maxExtent no es correcto');
    }
    // y max
    if (!isNull(maxExtentParameter.top)) {
      if (isString(maxExtentParameter.top)) {
        maxExtentParameter.top = Number.parseFloat(maxExtentParameter.top);
      }
      maxExtentVar.y.max = maxExtentParameter.top;
    } else if (!isNull(maxExtentParameter.y.max)) {
      if (isString(maxExtentParameter.y.max)) {
        maxExtentParameter.y.max = Number.parseFloat(maxExtentParameter.y.max);
      }
      maxExtentVar.y.max = maxExtentParameter.y.max;
    } else {
      Exception('El formato del parámetro maxExtent no es correcto');
    }
  } else {
    // unknown
    Exception(`El parámetro no es de un tipo soportado: ${typeof maxExtentParameter}`);
  }

  if (Number.isNaN(maxExtentVar.x.min) || Number.isNaN(maxExtentVar.y.min) ||
    Number.isNaN(maxExtentVar.x.max) || Number.isNaN(maxExtentVar.y.max)) {
    Exception('El formato del parámetro maxExtent no es correcto');
  }

  return maxExtentVar;
};


/**
 * Parses the specified user projection parameter into an object
 *
 * @param {String|Mx.Projection} projectionParameter parameters
 * provided by the user
 * @returns {Mx.Projection}
 * @public
 * @function
 * @api
 */
export const projection = (projectionParameter) => {
  const projectionVar = {
    code: null,
    units: null,
  };

  // checks if the param is null or empty
  if (isNullOrEmpty(projectionParameter)) {
    Exception('No ha especificado ningún parámetro projection');
  }

  // string
  if (isString(projectionParameter)) {
    if (/^(EPSG:)?\d+\*((d(egrees)?)|(m(eters)?))$/i.test(projectionParameter)) {
      const projectionArray = projectionParameter.split(/\*/);
      projectionVar.code = projectionArray[0];
      projectionVar.units = normalize(projectionArray[1].substring(0, 1));
    } else {
      Exception(`El formato del parámetro projection no es correcto. </br>Se usará la proyección por defecto: ${M.config.DEFAULT_PROJ}`);
    }
  } else if (isObject(projectionParameter)) {
    // object
    // y max
    if (!isNull(projectionParameter.code) &&
      !isNull(projectionParameter.units)) {
      projectionVar.code = projectionParameter.code;
      projectionVar.units = normalize(projectionParameter.units.substring(0, 1));
    } else {
      Exception(`El formato del parámetro projection no es correcto. </br>Se usará la proyección por defecto: ${M.config.DEFAULT_PROJ}`);
    }
  } else {
    // unknown
    Exception(`El parámetro no es de un tipo soportado: ${typeof projectionParameter}`);
  }

  if ((projectionVar.units !== 'm') && (projectionVar.units !== 'd')) {
    Exception(`La unidad "${projectionParameter.units}" del parámetro projection no es válida. Las disponibles son: "m" o "d"`);
  }

  return projectionVar;
};

/**
 * Parses the parameter in order to get the service URL
 * @private
 * @function
 */
const getURLKML = (parameter) => {
  let url;
  if (isString(parameter)) {
    // v3 <KML>*<NAME>*<DIR>*<FILENAME>*<EXTRACT>
    if (/^KML\*[^*]+\*[^*]+\*[^*]+\.kml\*(true|false)$/i.test(parameter)) {
      const params = parameter.split(/\*/);
      url = params[2].concat(params[3]);
    } else {
      const urlMatches = parameter.match(/^([^*]*\*)*(https?:\/\/[^*]+)(\*(true|false))?$/i);
      if (urlMatches && (urlMatches.length > 2)) {
        url = urlMatches[2];
      }
    }
  } else if (isObject(parameter)) {
    url = parameter.url;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return url;
};

/**
 * Parses the specified user resolutions parameter into an array
 *
 * @param {String|Array<String>|Array<Number>} resolutionsParameter parameters
 * provided by the user
 * @returns {Array<Number>}
 * @public
 * @function
 * @api
 */
export const resolutions = (resolutionsParam) => {
  let resolutionsParameter = resolutionsParam;
  let resolutionsVar = [];

  // checks if the param is null or empty
  if (isNullOrEmpty(resolutionsParameter)) {
    Exception('No ha especificado ningún parámetro resolutions');
  }

  // string
  if (isString(resolutionsParameter)) {
    if (/^\d+(\.\d+)?([,;]\d+(\.\d+)?)*$/.test(resolutionsParameter)) {
      resolutionsParameter = resolutionsParameter.split(/[,;]+/);
    } else {
      Exception('El formato del parámetro resolutions no es correcto');
    }
  }
  // array
  if (isArray(resolutionsParameter)) {
    resolutionsVar = resolutionsParameter.map((resolution) => {
      if (isString(resolution)) {
        return Number.parseFloat(resolution);
      }
      return resolution;
    });
  } else {
    // unknown
    Exception(`El parámetro no es de un tipo soportado: ${typeof resolutionsParameter}`);
  }

  let valid = true;
  for (let i = 0, len = resolutionsVar.length; i < len && valid; i += 1) {
    valid = !Number.isNaN(resolutionsVar[i]);
  }

  if (!valid) {
    Exception('El formato del parámetro resolutions no es correcto');
  }
  return resolutionsVar;
};

/**
 * Parses the specified user zoom parameter into a number
 *
 * @param {String|Number} zoomParameter parameters
 * provided by the user
 * @returns {Number}
 * @public
 * @function
 * @api
 */
export const zoom = (zoomParam) => {
  const zoomParameter = zoomParam;
  let zoomVar;

  // checks if the param is null or empty
  if (isNullOrEmpty(zoomParameter)) {
    Exception('No ha especificado ningún parámetro zoom');
  }

  // string
  if (isString(zoomParameter)) {
    zoomVar = Number.parseInt(zoomParameter, 10);
  } else if (typeof zoomParameter === 'number') {
    // number
    zoomVar = zoomParameter;
  } else {
    // unknown
    Exception(`El parámetro no es de un tipo soportado: ${typeof zoomParameter}`);
  }

  if (Number.isNaN(zoomVar)) {
    Exception('El formato del parámetro zoom no es correcto');
  }
  return zoomVar;
};

/**
 * Parses the specified user layer KML parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.KML|Array<Mx.parameters.KML>}
 * @public
 * @function
 * @api
 */
export const kml = (userParamer) => {
  const userParameters = userParamer;
  let layersVar = [];

  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layersVar = userParametersArray.map((userParam) => {
    const layerObj = {};

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

  if (!isArray(userParameters)) {
    layersVar = layersVar[0];
  }

  return layersVar;
};

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getURLMapbox = (parameter) => {
  let url;
  if (isString(parameter)) {
    url = null; // URL by string type no supported
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.url)) {
    url = parameter.url.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return url;
};

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameMapbox = (parameter) => {
  let name;
  let params;
  if (isString(parameter)) {
    if (/^MAPBOX\*.+/i.test(parameter)) {
      // <MAPBOX>*<NAME>(*<TRANSPARENT>)?(*<TITLE>)?
      if (/^MAPBOX\*[^*]+(\*[^*]+){0,2}/i.test(parameter)) {
        params = parameter.split(/\*/);
        name = params[1].trim();
      }
    } else if (/^[^*]+(\*[^*]+){0,2}/.test(parameter)) {
      // <NAME>(*<TRANSPARENT>)?(*<TITLE>)?
      params = parameter.split(/\*/);
      name = params[0].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.name)) {
    name = parameter.name.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(name) || /^(true|false)$/i.test(name)) {
    name = null;
  }
  return name;
};

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getTransparentMapbox = (parameter) => {
  let transparent;
  let params;
  if (isString(parameter)) {
    if (/^MAPBOX\*.+/i.test(parameter)) {
      // <MAPBOX>*<NAME>*<TRANSPARENT>(*<TITLE>)?
      if (/^MAPBOX\*[^*]+\*[^*]+(\*[^*]+)?/i.test(parameter)) {
        params = parameter.split(/\*/);
        transparent = params[2].trim();
      }
    } else if (/^[^*]+\*[^*]+(\*[^*]+)?/.test(parameter)) {
      // <NAME>*<TRANSPARENT>(*<TITLE>)?
      params = parameter.split(/\*/);
      transparent = params[1].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.transparent)) {
    transparent = normalize(parameter.transparent);
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  if (!isNullOrEmpty(transparent)) {
    transparent = /^1|(true)$/i.test(transparent);
  }
  return transparent;
};

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getAccessTokenMapbox = (parameter) => {
  let accessToken;
  if (isString(parameter)) {
    accessToken = null; // accessToken by string type no supported
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.accessToken)) {
    accessToken = parameter.accessToken.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return accessToken;
};

/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getLegendMapbox = (parameter) => {
  let legend;
  let params;
  if (isString(parameter)) {
    if (/^MAPBOX\*.+/i.test(parameter)) {
      // <MAPBOX>*<NAME>*<TRANSPARENT>*<TITLE>
      if (/^MAPBOX\*[^*]+\*[^*]+\*[^*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        legend = params[3].trim();
      }
    } else if (/^[^*]+\*[^*]+\*[^*]+/.test(parameter)) {
      // <NAME>*<TRANSPARENT>*<TITLE>
      params = parameter.split(/\*/);
      legend = params[2].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.legend)) {
    legend = parameter.legend.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(legend) || /^(true|false)$/i.test(legend)) {
    legend = null;
  }
  return legend;
};

/**
 * Parses the specified user layer Mapbox parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.KML|Array<Mx.parameters.KML>}
 * @public
 * @function
 * @api
 */
export const mapbox = (userParameters) => {
  let layers = [];

  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    const layerObj = {};

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

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameOSM = (parameter) => {
  let name;
  if (isObject(parameter) && !isNullOrEmpty(parameter.name)) {
    name = parameter.name.trim();
  }
  if (!isNullOrEmpty(name) && (isUrl(name) || /^(true|false)$/i.test(name))) {
    name = null;
  }
  return name;
};

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getTransparentOSM = (parameter) => {
  let transparent;
  let params;
  if (isString(parameter)) {
    // <OSM>*<TRANSPARENT>(*<TITLE>)?
    if (/^OSM\*[^*]+(\*[^*]+)?/i.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = params[1].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.transparent)) {
    transparent = normalize(parameter.transparent);
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  if (!isNullOrEmpty(transparent)) {
    transparent = /^1|(true)$/i.test(transparent);
  }
  return transparent;
};

/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getLegendOSM = (parameter) => {
  let legend;
  let params;
  if (isString(parameter)) {
    // <OSM>*(<TRANSPARENT>)?*<TITLE>
    if (/^OSM\*([^*]+)?\*[^*]+/i.test(parameter)) {
      params = parameter.split(/\*/);
      legend = params[2].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.legend)) {
    legend = parameter.legend.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(legend) || /^(true|false)$/i.test(legend)) {
    legend = null;
  }
  return legend;
};

/**
 * Parses the specified user layer KML parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.KML|Array<Mx.parameters.KML>}
 * @public
 * @function
 * @api
 */
export const osm = (userParame) => {
  let userParameters = userParame;
  let layers = [];

  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    userParameters = {
      type: LayerType.OSM,
      name: 'osm',
    };
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    const layerObj = {};

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

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameWFS = (parameter) => {
  let name;
  let params;
  let namespaceName;
  if (isString(parameter)) {
    if (/^WFS(T)?\*.+/i.test(parameter)) {
      // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>
      if (/^WFS(T)?\*[^*]*\*[^*]+\*[^*]+:[^*]+/i.test(parameter) || /^[^*]*\*[^*]+:[^*]+/.test(parameter)) {
        params = parameter.split(/\*/);
        namespaceName = params[3].trim();
        name = namespaceName.split(':')[1];
      } else if (/^WFS(T)?\*[^*]*\*[^*]+[^*]+/i.test(parameter)) {
        // <WFS(T)?>*(<TITLE>)?*<URL>*<NAME>
        params = parameter.split(/\*/);
        name = params[3].trim();
      }
    } else if (/^[^*]*\*[^*]+:[^*]+/.test(parameter)) {
      // <URL>*<NAMESPACE>:<NAME>
      params = parameter.split(/\*/);
      namespaceName = params[1].trim();
      name = namespaceName.split(':')[1];
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.name)) {
    name = parameter.name.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(name) || /^(true|false)$/i.test(name)) {
    name = null;
  }
  return name;
};

/**
 * Parses the parameter in order to get the service URL
 * @private
 * @function
 */
const getURLWFS = (parameter) => {
  let url;
  if (isString(parameter)) {
    const urlMatches = parameter.match(/^([^*]*\*)*(https?:\/\/[^*]+)([^*]*\*?)*$/i);
    if (urlMatches && (urlMatches.length > 2)) {
      url = urlMatches[2];
    }
  } else if (isObject(parameter)) {
    url = parameter.url;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return url;
};

/**
 * Parses the parameter in order to get the layer namespace
 * @private
 * @function
 */
const getNamespaceWFS = (parameter) => {
  let namespace;
  let params;
  let namespaceName;
  if (isString(parameter)) {
    if (/^WFS(T)?\*.+/i.test(parameter)) {
      // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>
      if (/^WFS(T)?\*[^*]*\*[^*]+\*[^*]+:[^*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        namespaceName = params[3].trim();
        namespace = namespaceName.split(':')[0];
      }
    } else if (/^[^*]*\*[^*]+:[^*]+/.test(parameter)) {
      // <URL>*<NAMESPACE>:<NAME>
      params = parameter.split(/\*/);
      namespaceName = params[1].trim();
      namespace = namespaceName.split(':')[0];
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.namespace)) {
    namespace = parameter.namespace.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(namespace) || /^(true|false)$/i.test(namespace)) {
    namespace = null;
  }
  return namespace;
};

/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getLegendWFS = (parameter) => {
  let legend;
  let params;
  if (isString(parameter)) {
    // <WFS(T)?>*<TITLE>*<URL>...
    if (/^WFS(T)?\*[^*]/i.test(parameter)) {
      params = parameter.split(/\*/);
      legend = params[1].trim();
    } else if (/^[^*]+\*[^*]+:[^*]+\*[^*]+/.test(parameter)) {
      // <URL>*<NAMESPACE>:<NAME>*<TITLE>
      params = parameter.split(/\*/);
      legend = params[2].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.legend)) {
    legend = parameter.legend.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(legend) || /^(true|false)$/i.test(legend)) {
    legend = null;
  }
  return legend;
};

/**
 * Parses the parameter in order to get the CQL filter
 * @private
 * @function
 */
const getCQLWFS = (parameter) => {
  let cql;
  let params;
  if (isString(parameter)) {
    // URL*NAMESPACE:NAME*TITLE*CQL
    if (/^[^*]+\*[^*]+:[^*]+\*[^*]+\*[^*]+/i.test(parameter)) {
      params = parameter.split(/\*/);
      cql = params[3].trim();
    }
    // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>*<ID>*<CQL>
    if (/^WFS(T)?\*[^*]*\*[^*]+\*[^*]+:[^*]+\*[^*]+\*[^*]*\*[^*]*/i.test(parameter)) {
      params = parameter.split(/\*/);
      cql = params[6].trim();
    }
  } else if ((isObject(parameter) &&
      !isNullOrEmpty(parameter.cql)) || (!isNullOrEmpty(parameter.ecql))) {
    cql = parameter.cql ? parameter.cql.trim() : parameter.ecql.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (/^(true|false)$/i.test(cql) || /^\d\.\d\.\d$/.test(cql)) {
    cql = undefined;
  }
  return cql;
};

/**
 * Parses the parameter in order to get the layer geometry
 * @private
 * @function
 */
const getGeometryWFS = (parameter) => {
  let geometry;
  let params;
  if (isString(parameter)) {
    if (/^WFS(T)?\*.+/i.test(parameter)) {
      // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>
      if (/^WFS(T)?\*[^*]*\*[^*]+\*[^*]+:[^*]+\*[^*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        geometry = params[4].trim();
      } else if (/^WFS(T)?\*[^*]*\*[^*][^*]+\*[^*]+/i.test(parameter)) {
        // <WFS(T)?>*(<TITLE>)?*<URL>*<NAME>*<GEOM>
        params = parameter.split(/\*/);
        geometry = params[4].trim();
      }
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.geometry)) {
    geometry = parameter.geometry.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(geometry) || /^(true|false)$/i.test(geometry)) {
    geometry = null;
  }
  return geometry;
};

/**
 * Parses the parameter in order to get the layer namespace
 * @private
 * @function
 */
const getIdsWFS = (parameter) => {
  let ids;
  let params;
  if (isString(parameter)) {
    if (/^WFS(T)?\*.+/i.test(parameter)) {
      // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>*<FEATURE_ID1>-<FEATURE_ID2>...
      if (/^WFS(T)?\*[^*]*\*[^*]+\*[^*]+:[^*]+\*[^*]+\*(.-?)+$/i.test(parameter)) {
        params = parameter.split(/\*/);
        ids = params[5].trim().split('-');
      } else if (/^WFS(T)?\*[^*]*\*[^*]+\*[^*]+\*[^*]+\*(.-?)+$/i.test(parameter)) {
        // <WFS(T)?>*(<TITLE>)?*<URL>*<NAME>*<GEOM>*<FEATURE_ID1>-<FEATURE_ID2>...
        params = parameter.split(/\*/);
        ids = params[5].trim().split('-');
      }
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.ids)) {
    ids = parameter.ids;
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(ids)) {
    ids = null;
  }

  if (!isNullOrEmpty(ids) && !isArray(ids)) {
    ids = [ids];
  }
  return ids;
};

/**
 * Parses the parameter in order to get the style
 * @private
 * @function
 */
const getStyleWFS = (parameter) => {
  let params;
  let style;

  if (isString(parameter)) {
    if (/^WFS(T)?\*.+/i.test(parameter)) {
      // <WFS(T)?>*(<TITLE>)?*<URL>*<NAMESPACE>:<NAME>*<GEOM>...
      // ...*<FEATURE_ID1>-<FEATURE_ID2>*<CQL>*<STYLE>...
      if (/^WFS(T)?\*[^*]*\*[^*]+\*[^*]+:[^*]+\*[^*]+\*[^*]*\*[^*]*\*[^*]*/i.test(parameter)) {
        params = parameter.split(/\*/);
        style = params[7].trim();
      }
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.style)) {
    style = parameter.style;
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return style;
};

/**
 * Parses the parameter in order to get the version
 * @private
 * @function
 */
const getVersionWFS = (parameter) => {
  let version;
  if (isString(parameter)) {
    if (/(\d\.\d\.\d)$/.test(parameter)) {
      version = parameter.match(/\d\.\d\.\d$/)[0];
    }
  } else if (isObject(parameter)) {
    version = parameter.version;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return version;
};

/**
 * Parses the parameter in order to get the options
 * @private
 * @function
 */
const getOptionsWFS = (parameter) => {
  let options;
  if (isString(parameter)) {
    // TODO ver como se pone el parámetro
  } else if (isObject(parameter)) {
    options = parameter.options;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return options;
};

/**
 * Parses the specified user layer WFS parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.WFS|Array<Mx.parameters.WFS>}
 * @public
 * @function
 * @api
 */
export const wfs = (userParameters) => {
  let layers = [];

  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    const layerObj = {};

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

    // gets the styles
    layerObj.style = getStyleWFS(userParam);

    // gets the options
    layerObj.options = getOptionsWFS(userParam);

    // format specified by the user when create object WFS
    layerObj.outputFormat = userParameters.outputFormat;

    return layerObj;
  });

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};


/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getLegendGeoJSON = (parameter) => {
  let legend;
  let params;
  if (isString(parameter)) {
    // <GeoJSON(T)?>*<TYPE>*<LEGEND>...
    if (/^GeoJSON(T)?\*[^*]/i.test(parameter)) {
      params = parameter.split(/\*/);
      legend = params[1].trim();
    } else if (/^[^*]+\*[^*]+:[^*]+\*[^*]+/.test(parameter)) {
      // <TYPE>*<LEGEND>...
      params = parameter.split(/\*/);
      legend = params[2].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.legend)) {
    legend = parameter.legend.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(legend) || /^(true|false)$/i.test(legend)) {
    legend = null;
  }
  return legend;
};

/**
 * Parses the parameter in order to get the service URL
 * @private
 * @function
 */
const getURLGeoJSON = (parameter) => {
  let url;
  if (isString(parameter)) {
    const urlMatches = parameter.match(/^([^*]*\*)*(https?:\/\/[^*]+)([^*]*\*?)*$/i);
    if (urlMatches && (urlMatches.length > 2)) {
      url = urlMatches[2];
    }
  } else if (isObject(parameter)) {
    url = parameter.url;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return url;
};

/**
 * Parses the parameter in order to get the transparence
 * @private
 * @function
 */
const getExtractGeoJSON = (parameter) => {
  let extract;
  let params;
  let hideParams;
  if (isString(parameter)) {
    // [TYPE]*[LEGEND]*[URL]*[EXTRACT/HIDE]*[STYLE]
    if (/^GeoJSON\*[^*]+\*[^*]+\*[^*]*(true|false)/i.test(parameter)) {
      params = parameter.split(/\*/);
      extract = params[3].trim();
    } else {
      params = parameter.split(/\*/);
      hideParams = params[3];
      if (!isNullOrEmpty(hideParams)) {
        extract = [hideParams];
      } else {
        extract = false;
      }
    }
  } else if (isObject(parameter)) {
    extract = normalize(parameter.extract);
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  return extract;
};

/**
 * Parses the parameter in order to get the style
 * @private
 * @function
 */
const getStyleGeoJSON = (parameter) => {
  let params;
  let style;

  if (isString(parameter)) {
    if (/^GeoJSON(T)?\*.+/i.test(parameter)) {
      // [TYPE]*[LEGEND]*[URL]*[EXTRACT/HIDE]*[STYLE]
      if (/^GeoJSON(T)?\*[^*]*\*[^*]+\*[^*]+\*[^*]*/i.test(parameter)) {
        params = parameter.split(/\*/);
        style = params[4].trim();
      } else if (/^GeoJSON(T)?\*[^*]*\*[^*]+\*/i.test(parameter)) {
        params = parameter.split(/\*/);
        style = params[4].trim();
      }
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.style)) {
    style = parameter.style;
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return style;
};


/**
 * Parses the specified user layer GeoJSON parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.GeoJSON|Array<Mx.parameters.GeoJSON>}
 * @public
 * @function
 * @api
 */
export const geojson = (userParameters) => {
  let layers = [];

  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    const layerObj = {};

    // gets the layer type
    layerObj.type = LayerType.GeoJSON;

    // gets the name
    layerObj.legend = getLegendGeoJSON(userParam);

    // gets the URL
    layerObj.url = getURLGeoJSON(userParam);

    // gets the name
    layerObj.extract = getExtractGeoJSON(userParam);

    // gets the styles
    layerObj.style = getStyleGeoJSON(userParam);

    return layerObj;
  });

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameWMC = (parameter, type) => {
  let name;
  let params;
  if (isString(parameter)) {
    // <WMC>*<URL>*<NAME>
    if (/^\w{3,7}\*[^*]+\*[^*]+$/.test(parameter)) {
      params = parameter.split(/\*/);
      name = params[2].trim();
    } else if (/^\w{3,7}\*[^*]$/.test(parameter)) {
      // <WMC>*(<PREDEFINED_NAME> OR <URL>)
      params = parameter.split(/\*/);
      name = params[1].trim();
    } else if (/^[^*]+\*[^*]+$/.test(parameter)) {
      // (<URL>*<NAME>)
      params = parameter.split(/\*/);
      name = params[1].trim();
    } else if (/^[^*]+$/.test(parameter) && !isUrl(parameter)) {
      // (<PREDEFINED_NAME> OR <URL>)
      name = parameter;
    }
  } else if (isObject(parameter)) {
    name = normalize(parameter.name);
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(name)) {
    name = null;
  }
  return name;
};

/**
 * Parses the parameter in order to get the service URL
 * @private
 * @function
 */
const getURLWMC = (parameter) => {
  let url;
  if (isString(parameter)) {
    const urlMatches = parameter.match(/^([^*]*\*)*(https?:\/\/[^*]+)([^*]*\*?)*$/i);
    if (urlMatches && (urlMatches.length > 2)) {
      url = urlMatches[2];
    }
  } else if (isObject(parameter)) {
    url = parameter.url;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return url;
};

/**
 * Parses the parameter in order to get the options
 * @private
 * @function
 */
const getOptionsWMC = (parameter) => {
  let options;
  if (isString(parameter)) {
    // TODO ver como se pone el parámetro
  } else if (isObject(parameter)) {
    options = parameter.options;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return options;
};

/**
 * Parses the specified user layer WMC parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.WMC|Array<Mx.parameters.WMC>}
 * @public
 * @function
 * @api
 */
export const wmc = (userParameters) => {
  let layers = [];

  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    const layerObj = {};

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

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameWMS = (parameter) => {
  let name;
  let params;
  if (isString(parameter)) {
    if (/^WMS\*.+/i.test(parameter)) {
      // <WMS>*<TITLE>*<URL>*<NAME>
      if (/^WMS\*[^*]+\*[^*]+\*[^*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        name = params[3].trim();
      }
    } else if (/^[^*]*\*[^*]+/.test(parameter)) {
      // <URL>*<NAME>
      params = parameter.split(/\*/);
      name = params[1].trim();
    } else if (/^[^*]*/.test(parameter)) {
      // <NAME>
      params = parameter.split(/\*/);
      name = params[0].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.name)) {
    name = parameter.name.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(name) || /^(true|false)$/i.test(name)) {
    name = null;
  }
  return name;
};

/**
 * Parses the parameter in order to get the service URL
 * @private
 * @function
 */
const getURLWMS = (parameter) => {
  let url;
  if (isString(parameter)) {
    const urlMatches = parameter.match(/^([^*]*\*)*(https?:\/\/[^*]+)([^*]*\*?)*$/i);
    if (urlMatches && (urlMatches.length > 2)) {
      url = urlMatches[2];
    }
  } else if (isObject(parameter)) {
    url = parameter.url;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return url;
};

/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getLegendWMS = (parameter) => {
  let legend;
  let params;
  if (isString(parameter)) {
    // <WMS>*<TITLE>
    if (/^WMS\*[^*]/i.test(parameter)) {
      params = parameter.split(/\*/);
      legend = params[1].trim();
    } else if (/^[^*]+\*[^*]+\*[^*]+/.test(parameter)) {
      // <URL>*<NAME>*<TITLE>
      params = parameter.split(/\*/);
      legend = params[2].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.legend)) {
    legend = parameter.legend.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(legend) || /^(true|false)$/i.test(legend)) {
    legend = null;
  }
  return legend;
};

/**
 * Parses the parameter in order to get the transparence
 * @private
 * @function
 */
const getTransparentWMS = (parameter) => {
  let transparent;
  let params;
  if (isString(parameter)) {
    // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>
    if (/^WMS\*[^*]+\*[^*]+\*[^*]+\*(true|false)/i.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = params[4].trim();
    } else if (/^WMS_FULL\*[^*]+(\*(true|false))?/i.test(parameter)) {
      // <WMS_FULL>*<URL>(*<TILED>)?
      params = parameter.split(/\*/);
      transparent = true;
    } else if (/^[^*]+\*[^*]+\*[^*]+\*(true|false)/i.test(parameter)) {
      // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>
      params = parameter.split(/\*/);
      transparent = params[3].trim();
    } else if (/^[^*]+\*[^*]+\*(true|false)/i.test(parameter)) {
      // <URL>*<NAME>*<TRANSPARENCE>
      params = parameter.split(/\*/);
      transparent = params[2].trim();
    }
  } else if (isObject(parameter)) {
    transparent = normalize(parameter.transparent);
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  if (!isNullOrEmpty(transparent)) {
    transparent = /^1|(true)$/i.test(transparent);
  }
  return transparent;
};

/**
 * Parses the parameter in order to get the layer tile
 * @private
 * @function
 */
const getTiledWMS = (parameter) => {
  let tiled;
  let params;
  if (isString(parameter)) {
    // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>*<TILED>
    if (/^WMS\*[^*]+\*[^*]+\*[^*]+\*(true|false)\*(true|false)$/i.test(parameter)) {
      params = parameter.split(/\*/);
      tiled = params[5].trim();
    } else if (/^WMS\*[^*]+\*[^*]+\*[^*]+\*(true|false)/i.test(parameter)) {
      tiled = true;
    } else if (/^WMS_FULL\*[^*]+\*(true|false)/i.test(parameter)) {
      // <WMS_FULL>*<URL>*<TILED>
      params = parameter.split(/\*/);
      tiled = params[2].trim();
    } else if (/^[^*]+\*[^*]+\*[^*]+\*(true|false)\*(true|false)/i.test(parameter)) {
      // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>*<TILED>
      params = parameter.split(/\*/);
    } else if (/^[^*]+\*[^*]+\*(true|false)\*(true|false)/i.test(parameter)) {
      // <URL>*<NAME>*<TRANSPARENCE>*<TILED>
      params = parameter.split(/\*/);
    }
  } else if (isObject(parameter)) {
    tiled = normalize(parameter.tiled);
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  if (!isNullOrEmpty(tiled)) {
    tiled = /^1|(true)$/i.test(tiled);
  }
  return tiled;
};

/**
 * Parses the parameter in order to get the CQL filter
 * @private
 * @function
 */
const getCQLWMS = (parameter) => {
  let cql;
  let params;
  if (isString(parameter)) {
    // <WMS>*<NAME>*<URL>*<TITLE>*<TRANSPARENCE>*<TILED>
    if (/^WMS\*[^*]+\*[^*]+\*[^*]+\*(true|false)\*(true|false)$/i.test(parameter)) {
      params = parameter.split(/\*/);
      cql = params[5].trim();
    } else if (/^WMS\*[^*]+\*[^*]+\*[^*]+\*(true|false)/i.test(parameter)) {
      cql = true;
    } else if (/^[^*]+\*[^*]+\*[^*]+\*(true|false)\*(true|false)\*[^*]+/i.test(parameter)) {
      // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>*<TILED>*<CQL>
      params = parameter.split(/\*/);
      cql = params[5].trim();
    } else if (/^[^*]+\*[^*]+\*[^*]+\*(true|false)\*[^*]+/i.test(parameter)) {
      // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>*<CQL>
      params = parameter.split(/\*/);
      cql = params[4].trim();
    } else if (/^[^*]+\*[^*]+\*[^*]+\*[^*]+/i.test(parameter)) {
      // <URL>*<NAME>*<TITLE>*<CQL>
      params = parameter.split(/\*/);
      cql = params[3].trim();
    } else if (/^[^*]+\*[^*]+\*(true|false)\*(true|false)\*[^*]+/i.test(parameter)) {
      // <URL>*<NAME>*<TRANSPARENCE>*<TILED>*<CQL>
      params = parameter.split(/\*/);
      cql = params[4].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.cql)) {
    cql = parameter.cql.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (/^(true|false)$/i.test(cql) || /^\d\.\d\.\d$/.test(cql)) {
    cql = undefined;
  }
  return cql;
};

/**
 * Parses the parameter in order to get the version
 * @private
 * @function
 */
const getVersionWMS = (parameter) => {
  let version;
  if (isString(parameter)) {
    if (/(\d\.\d\.\d)$/.test(parameter)) {
      version = parameter.match(/\d\.\d\.\d$/)[0];
    }
  } else if (isObject(parameter)) {
    version = parameter.version;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return version;
};

/**
 * Parses the parameter in order to get the options
 * @private
 * @function
 */
const getOptionsWMS = (parameter) => {
  let options;
  if (isString(parameter)) {
    // TODO ver como se pone el parámetro
  } else if (isObject(parameter)) {
    options = parameter.options;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return options;
};

/**
 * Parses the specified user layer WMS parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.WMS|Array<Mx.parameters.WMS>}
 * @public
 * @function
 * @api
 */
export const wms = (userParameters) => {
  let layers = [];

  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    const layerObj = {};

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

    layerObj.cql = getCQLWMS(userParam);

    // gets the version
    layerObj.version = getVersionWMS(userParam);

    // gets the options
    layerObj.options = getOptionsWMS(userParam);

    return layerObj;
  });

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};

/**
 * Parses the parameter in order to get the layer name
 * @private
 * @function
 */
const getNameWMTS = (parameter) => {
  let name;
  let params;
  if (isString(parameter)) {
    if (/^WMTS\*.+/i.test(parameter)) {
      // <WMTS>*<URL>*<NAME>(*<MATRIXSET>*<TITLE>)?
      if (/^WMTS\*[^*]+\*[^*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        name = params[2].trim();
      }
    } else if (/^[^*]*\*[^*]+/.test(parameter)) {
      // <URL>*<NAME>
      params = parameter.split(/\*/);
      name = params[1].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.name)) {
    name = parameter.name.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(name) || /^(true|false)$/i.test(name)) {
    name = null;
  }
  return name;
};

/**
 * Parses the parameter in order to get the service URL
 * @private
 * @function
 */
const getURLWMTS = (parameter) => {
  let url;
  if (isString(parameter)) {
    const urlMatches = parameter.match(/^([^*]*\*)*(https?:\/\/[^*]+)([^*]*\*?)*$/i);
    if (urlMatches && (urlMatches.length > 2)) {
      url = urlMatches[2];
    }
  } else if (isObject(parameter)) {
    url = parameter.url;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return url;
};

/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getMatrixSetWMTS = (parameter) => {
  let matrixSet;
  let params;
  if (isString(parameter)) {
    // <WMTS>*<URL>*<NAME>*<MATRIXSET>
    if (/^WMTS\*[^*]+\*[^*]+\*[^*]+/i.test(parameter)) {
      params = parameter.split(/\*/);
      matrixSet = params[3].trim();
    } else if (/^[^*]+\*[^*]+\*[^*]+/.test(parameter)) {
      // <URL>*<NAME>*<MATRIXSET>
      params = parameter.split(/\*/);
      matrixSet = params[2].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.matrixSet)) {
    matrixSet = parameter.matrixSet.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(matrixSet) || /^(true|false)$/i.test(matrixSet)) {
    matrixSet = null;
  }
  return matrixSet;
};

/**
 * Parses the parameter in order to get the layer legend
 * @private
 * @function
 */
const getLegendWMTS = (parameter) => {
  let legend;
  let params;
  if (isString(parameter)) {
    if (/^WMTS\*.+/i.test(parameter)) {
      // <WMTS>*<URL>*<NAME>*<MATRIXSET>?*<TITLE>
      if (/^WMTS\*[^*]+\*[^*]+\*[^*]*\*[^*]+/i.test(parameter)) {
        params = parameter.split(/\*/);
        legend = params[4].trim();
      }
    } else if (/^[^*]+\*[^*]+\*[^*]*\*[^*]+/.test(parameter)) {
      // <URL>*<NAME>(*<MATRIXSET>)?*<TITLE>
      params = parameter.split(/\*/);
      legend = params[3].trim();
    }
  } else if (isObject(parameter) && !isNullOrEmpty(parameter.legend)) {
    legend = parameter.legend.trim();
  } else if (!isObject(parameter)) {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }

  if (isUrl(legend) || /^(true|false)$/i.test(legend)) {
    legend = null;
  }
  return legend;
};

/**
 * Parses the parameter in order to get the options
 * @private
 * @function
 */
const getOptionsWMTS = (parameter) => {
  let options;
  if (isString(parameter)) {
    // TODO ver como se pone el parámetro
  } else if (isObject(parameter)) {
    options = parameter.options;
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  return options;
};

/**
 * Parses the parameter in order to get the transparence
 * @private
 * @function
 */
const getTransparentWMTS = (parameter) => {
  let transparent;
  let params;
  if (isString(parameter)) {
    // <WMTS>*<URL>*<NAME>*<MATRIXSET>?*<TITLE>?*<TRANSPARENT>
    if (/^WMTS\*[^*]+\*[^*]+\*[^*]*\*[^*]*\*(true|false)/i.test(parameter)) {
      params = parameter.split(/\*/);
      transparent = params[4].trim();
    } else if (/^WMS_FULL\*[^*]+(\*(true|false))?/i.test(parameter)) {
      // <WMS_FULL>*<URL>(*<TILED>)?
      params = parameter.split(/\*/);
      transparent = true;
    } else if (/^[^*]+\*[^*]+\*[^*]+\*(true|false)/i.test(parameter)) {
      // <URL>*<NAME>*<TITLE>*<TRANSPARENCE>
      params = parameter.split(/\*/);
      transparent = params[3].trim();
    } else if (/^[^*]+\*[^*]+\*(true|false)/i.test(parameter)) {
      // <URL>*<NAME>*<TRANSPARENCE>
      params = parameter.split(/\*/);
      transparent = params[2].trim();
    }
  } else if (isObject(parameter)) {
    transparent = normalize(parameter.transparent);
  } else {
    Exception(`El parámetro no es de un tipo soportado: ${typeof parameter}`);
  }
  if (!isNullOrEmpty(transparent)) {
    transparent = /^1|(true)$/i.test(transparent);
  }
  return transparent;
};


/**
 * Parses the specified user layer WMTS parameters to a object
 *
 * @param {string|Mx.parameters.Layer} userParameters parameters
 * provided by the user
 * @returns {Mx.parameters.WMTS|Array<Mx.parameters.WMTS>}
 * @public
 * @function
 * @api
 */
export const wmts = (userParameters) => {
  let layers = [];

  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    const layerObj = {};

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

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};

/**
 * @type {object}
 */
const parameterFunction = {
  kml,
  mapbox,
  osm,
  wfs,
  wmc,
  wms,
  wmts,
  geojson,
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
 * @api
 */
export const layer = (userParameters, forcedType) => {
  let layers = [];

  // checks if the param is null or empty
  if (isNullOrEmpty(userParameters)) {
    Exception('No ha especificado ningún parámetro');
  }

  // checks if the parameter is an array
  let userParametersArray = userParameters;
  if (!isArray(userParametersArray)) {
    userParametersArray = [userParametersArray];
  }

  layers = userParametersArray.map((userParam) => {
    let layerObj = null;
    if (isObject(userParam) && (userParam instanceof Layer)) {
      layerObj = userParam;
    } else {
      // gets the layer type
      let type = getType(userParam, forcedType);
      type = normalize(type);

      if (isFunction(parameterFunction[type])) {
        layerObj = parameterFunction[type](userParam);
      } else {
        layerObj = userParam;
      }
    }

    return layerObj;
  });

  if (!isArray(userParameters)) {
    layers = layers[0];
  }

  return layers;
};
