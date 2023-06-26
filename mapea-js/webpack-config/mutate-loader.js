/*eslint-disable*/

/**
 * @desc Parches para sobreescribit comportamientos no deseados de openlayers
 * @func {ol/format/GML3#getCoords_} - Se deshabilita la configuracion del orden de los ejes.
 * @func {ol/format/GML3#writePos_} - Se deshabilita la configuracion del orden de los ejes.
 * @func {ol/layer/Layer#inView} - La condicion para que la capa deje de verse se establece a una desigualdad estricta
 * en las resoluciones
 */
const CONF_ENV = {
  dev: [{
      path: 'ol/format/GML3',
      original: `getCoords_(point, srsName, hasZ) {
    let axisOrientation = 'enu';
    if (srsName) {
      axisOrientation = getProjection(srsName).getAxisOrientation();
    }
    let coords =
      axisOrientation.substr(0, 2) === 'en'
        ? point[0] + ' ' + point[1]
        : point[1] + ' ' + point[0];
    if (hasZ) {
      // For newly created points, Z can be undefined.
      const z = point[2] || 0;
      coords += ' ' + z;
    }

    return coords;
  }`,
      mutated: `getCoords_(point, opt_srsName, opt_hasZ) {
        return point[0] + ' ' + point[1];
    };`,
    }, {
      path: 'ol/layer/Layer',
      original: `export function inView(layerState, viewState) {
  if (!layerState.visible) {
    return false;
  }
  const resolution = viewState.resolution;
  if (
    resolution < layerState.minResolution ||
    resolution >= layerState.maxResolution
  ) {
    return false;
  }
  const zoom = viewState.zoom;
  return zoom > layerState.minZoom && zoom <= layerState.maxZoom;
}`,
      mutated: `export function inView(layerState, viewState) {
    if (!layerState.visible) {
        return false;
    }
    var resolution = viewState.resolution;
    if (resolution < layerState.minResolution || resolution > layerState.maxResolution) {
        return false;
    }
    var zoom = viewState.zoom;
    return zoom > layerState.minZoom && zoom <= layerState.maxZoom;
  }`,
    },
    {
      path: 'ol/format/GML3',
      original: `writePos_(node, value, objectStack) {
    const context = objectStack[objectStack.length - 1];
    const hasZ = context['hasZ'];
    const srsDimension = hasZ ? '3' : '2';
    node.setAttribute('srsDimension', srsDimension);
    const srsName = context['srsName'];
    let axisOrientation = 'enu';
    if (srsName) {
      axisOrientation = getProjection(srsName).getAxisOrientation();
    }
    const point = value.getCoordinates();
    let coords;
    // only 2d for simple features profile
    if (axisOrientation.substr(0, 2) === 'en') {
      coords = point[0] + ' ' + point[1];
    } else {
      coords = point[1] + ' ' + point[0];
    }
    if (hasZ) {
      // For newly created points, Z can be undefined.
      const z = point[2] || 0;
      coords += ' ' + z;
    }
    writeStringTextNode(node, coords);
  }`,
      mutated: `writePos_(node, value, objectStack) {
        var point = value.getCoordinates();
        var coords = point[0] + " " + point[1];
        writeStringTextNode(node, coords);
    };`,
    }
  ],
  prod: [{
      path: 'ol/format/GML3',
      original: `getCoords_(point, srsName, hasZ) {
    let axisOrientation = 'enu';
    if (srsName) {
      axisOrientation = getProjection(srsName).getAxisOrientation();
    }
    let coords =
      axisOrientation.substr(0, 2) === 'en'
        ? point[0] + ' ' + point[1]
        : point[1] + ' ' + point[0];
    if (hasZ) {
      // For newly created points, Z can be undefined.
      const z = point[2] || 0;
      coords += ' ' + z;
    }

    return coords;
  }`,
      mutated: `getCoords_(point, opt_srsName, opt_hasZ) {
        return point[0] + ' ' + point[1];
    };`,
    }, {
      path: 'ol/layer/Layer',
      original: `export function inView(layerState, viewState) {
  if (!layerState.visible) {
    return false;
  }
  const resolution = viewState.resolution;
  if (
    resolution < layerState.minResolution ||
    resolution >= layerState.maxResolution
  ) {
    return false;
  }
  const zoom = viewState.zoom;
  return zoom > layerState.minZoom && zoom <= layerState.maxZoom;
}`,
      mutated: `export function inView(layerState, viewState) {
    if (!layerState.visible) {
        return false;
    }
    var resolution = viewState.resolution;
    if (resolution < layerState.minResolution || resolution > layerState.maxResolution) {
        return false;
    }
    var zoom = viewState.zoom;
    return zoom > layerState.minZoom && zoom <= layerState.maxZoom;
  }`,
    },
    {
      path: 'ol/format/GML3',
      original: `writePos_(node, value, objectStack) {
    const context = objectStack[objectStack.length - 1];
    const hasZ = context['hasZ'];
    const srsDimension = hasZ ? '3' : '2';
    node.setAttribute('srsDimension', srsDimension);
    const srsName = context['srsName'];
    let axisOrientation = 'enu';
    if (srsName) {
      axisOrientation = getProjection(srsName).getAxisOrientation();
    }
    const point = value.getCoordinates();
    let coords;
    // only 2d for simple features profile
    if (axisOrientation.substr(0, 2) === 'en') {
      coords = point[0] + ' ' + point[1];
    } else {
      coords = point[1] + ' ' + point[0];
    }
    if (hasZ) {
      // For newly created points, Z can be undefined.
      const z = point[2] || 0;
      coords += ' ' + z;
    }
    writeStringTextNode(node, coords);
  }`,
      mutated: `writePos_(node, value, objectStack) {
        var point = value.getCoordinates();
        var coords = point[0] + " " + point[1];
        writeStringTextNode(node, coords);
    };`,
    }
  ]
}

/**
 * @function
 * @desc Mutate Loader for Webpack 4
 * Este loader permite sobreescribir funcionalidad de
 * librerías  externas a partir de una configuración dada.
 */
function mutateLoader(content, map, meta) {
  const configurations = CONF_ENV[this.query.mode];
  const options = configurations.filter((opts) => {
    const regexp = new RegExp(opts.path);
    return regexp.test(this.resourcePath);
  });

  if (options.length > 0) {
    let replacedContent = content;
    options.forEach(opt => {
      replacedContent = replacedContent.replace(opt.original, opt.mutated);
    });
    this.callback(null, replacedContent, false, meta);
  } else {
    this.callback(null, content, false, meta);
  }
  return 0;
}

module.exports = mutateLoader;
