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
      original: `GML3.prototype.getCoords_ = function (point, opt_srsName, opt_hasZ) {
        var axisOrientation = 'enu';
        if (opt_srsName) {
            axisOrientation = getProjection(opt_srsName).getAxisOrientation();
        }
        var coords = ((axisOrientation.substr(0, 2) === 'en') ?
            point[0] + ' ' + point[1] :
            point[1] + ' ' + point[0]);
        if (opt_hasZ) {
            // For newly created points, Z can be undefined.
            var z = point[2] || 0;
            coords += ' ' + z;
        }
        return coords;
    };`,
      mutated: `GML3.prototype.getCoords_ = function (point, opt_srsName, opt_hasZ) {
        return point[0] + ' ' + point[1];
    };`,
    }, {
      path: 'ol/layer/Layer',
      original: `export function inView(layerState, viewState) {
    if (!layerState.visible) {
        return false;
    }
    var resolution = viewState.resolution;
    if (resolution < layerState.minResolution || resolution >= layerState.maxResolution) {
        return false;
    }
    var zoom = viewState.zoom;
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
      original: `GML3.prototype.writePos_ = function (node, value, objectStack) {
        var context = objectStack[objectStack.length - 1];
        var hasZ = context['hasZ'];
        var srsDimension = hasZ ? '3' : '2';
        node.setAttribute('srsDimension', srsDimension);
        var srsName = context['srsName'];
        var axisOrientation = 'enu';
        if (srsName) {
            axisOrientation = getProjection(srsName).getAxisOrientation();
        }
        var point = value.getCoordinates();
        var coords;
        // only 2d for simple features profile
        if (axisOrientation.substr(0, 2) === 'en') {
            coords = (point[0] + ' ' + point[1]);
        }
        else {
            coords = (point[1] + ' ' + point[0]);
        }
        if (hasZ) {
            // For newly created points, Z can be undefined.
            var z = point[2] || 0;
            coords += ' ' + z;
        }
        writeStringTextNode(node, coords);
    };`,
      mutated: `GML3.prototype.writePos_ = function (node, value, objectStack) {
        var point = value.getCoordinates();
        var coords = point[0] + " " + point[1];
        writeStringTextNode(node, coords);
    };`,
    }
  ],
  prod: [{
      path: 'ol/format/GML3',
      original: `GML3.prototype.getCoords_ = function (point, opt_srsName, opt_hasZ) {
    var axisOrientation = 'enu';

    if (opt_srsName) {
      axisOrientation = getProjection(opt_srsName).getAxisOrientation();
    }

    var coords = axisOrientation.substr(0, 2) === 'en' ? point[0] + ' ' + point[1] : point[1] + ' ' + point[0];

    if (opt_hasZ) {
      // For newly created points, Z can be undefined.
      var z = point[2] || 0;
      coords += ' ' + z;
    }

    return coords;
  };`,
      mutated: `GML3.prototype.getCoords_ = function (point, opt_srsName, opt_hasZ) {
        return point[0] + ' ' + point[1];
    };`,
    }, {
      path: 'ol/layer/Layer',
      original: `export function inView(layerState, viewState) {
  if (!layerState.visible) {
    return false;
  }

  var resolution = viewState.resolution;

  if (resolution < layerState.minResolution || resolution >= layerState.maxResolution) {
    return false;
  }

  var zoom = viewState.zoom;
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
      original: `GML3.prototype.writePos_ = function (node, value, objectStack) {
    var context = objectStack[objectStack.length - 1];
    var hasZ = context['hasZ'];
    var srsDimension = hasZ ? '3' : '2';
    node.setAttribute('srsDimension', srsDimension);
    var srsName = context['srsName'];
    var axisOrientation = 'enu';

    if (srsName) {
      axisOrientation = getProjection(srsName).getAxisOrientation();
    }

    var point = value.getCoordinates();
    var coords; // only 2d for simple features profile

    if (axisOrientation.substr(0, 2) === 'en') {
      coords = point[0] + ' ' + point[1];
    } else {
      coords = point[1] + ' ' + point[0];
    }

    if (hasZ) {
      // For newly created points, Z can be undefined.
      var z = point[2] || 0;
      coords += ' ' + z;
    }

    writeStringTextNode(node, coords);
  };`,
      mutated: `GML3.prototype.writePos_ = function (node, value, objectStack) {
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
