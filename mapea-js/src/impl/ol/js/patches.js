/* eslint-disable */
import LayerModule from 'ol/layer/Layer';
import OLFormatGML3 from 'ol/format/GML3';
// import OLInteractionPointer from 'ol/interaction/Pointer';
import { writeStringTextNode } from 'ol/format/xsd';
import { find, findIndex, includes } from 'ol/array';
import { get as getProjection } from 'ol/proj';
import { createFromCapabilitiesMatrixSet } from 'ol/tilegrid/WMTS';
import WMTSRequestEncoding from 'ol/source/WMTSRequestEncoding';

// import { POINTERUP, POINTERDOWN, POINTERDRAG } from 'ol/MapBrowserEventType';
// import { getValues } from 'ol/obj';


/**
 * Return `true` if the layer is visible, and if the passed resolution is
 * between the layer's minResolution and maxResolution. The comparison is
 * inclusive for `minResolution` and exclusive for `maxResolution`.
 * @param {ol.layer.LayerState} layerState Layer state.
 * @param {number} resolution Resolution.
 * @return {boolean} The layer is visible at the given resolution.
 *
 * PATCH: inclusive maxResolution comparasion to show layers with the
 * same resolution as its maxResolution
 */
LayerModule.visibleAtResolution = (layerState, resolution) => {
  return layerState.visible && resolution >= layerState.minResolution &&
    resolution <= layerState.maxResolution;
};

/**
 * @param {Node} node Node.
 * @param {ol.geom.Point} value Point geometry.
 * @param {Array.<*>} objectStack Node stack.
 *
 * PATCH: disables axis order configuration
 */
OLFormatGML3.prototype.writePos_ = (node, value, objectStack) => {
  // var context = objectStack[objectStack.length - 1];
  // PATCH: ------------------------------ init
  // var srsName = context['srsName'];
  // var axisOrientation = 'enu';
  // if (srsName) {
  //   axisOrientation = ol.proj.get(srsName).getAxisOrientation();
  // }
  // ------------------------------------- end
  const point = value.getCoordinates();
  const coords = `${point[0]} ${point[1]}`;
  // PATCH: ------------------------------ init
  // only 2d for simple features profile
  // if (axisOrientation.substr(0, 2) === 'en') {
  // ------------------------------------- end
  // PATCH: ------------------------------ init
  // } else {
  //   coords = (point[1] + ' ' + point[0]);
  // }
  // ------------------------------------- end
  writeStringTextNode(node, coords);
};

/**
 * @param {Array.<number>} point Point geometry.
 * @param {string=} optSRSName Optional srsName
 * @return {string} The coords string.
 *
 * PATCH: disables axis order configuration
 */
OLFormatGML3.prototype.getCoords_ = (point, optSRSName) => {
  // PATCH: ------------------------------ init
  // var axisOrientation = 'enu';
  // if (optSRSName) {
  //   axisOrientation = ol.proj.get(optSRSName).getAxisOrientation();
  // }
  // return ((axisOrientation.substr(0, 2) === 'en') ?
  //     point[0] + ' ' + point[1] :
  //     point[1] + ' ' + point[0]);
  return `${point[0]} ${point[1]}`;
  // ------------------------------------- end
};

/**
 * Generate source options from a capabilities object.
 * @param {Object} wmtsCap An object representing the capabilities document.
 * @param {!Object} config Configuration properties for the layer.  Defaults for
 *                  the layer will apply if not provided.
 *
 * Required config properties:
 *  - layer - {string} The layer identifier.
 *
 * Optional config properties:
 *  - matrixSet - {string} The matrix set identifier, required if there is
 *       more than one matrix set in the layer capabilities.
 *  - projection - {string} The desired CRS when no matrixSet is specified.
 *       eg: "EPSG:3857". If the desired projection is not available,
 *       an error is thrown.
 *  - requestEncoding - {string} url encoding format for the layer. Default is
 *       the first tile url format found in the GetCapabilities response.
 *  - style - {string} The name of the style
 *  - format - {string} Image format for the layer. Default is the first
 *       format returned in the GetCapabilities response.
 *  - crossOrigin - {string|null|undefined} Cross origin. Default is `undefined`.
 * @return {?Options} WMTS source options object or `null` if the layer was not found.
 * @api
 *
 * PATCH: allow override tileGrid extent
 */
export const optionsFromCapabilities = (wmtsCap, config) => {
  const layers = wmtsCap['Contents']['Layer'];
  const l = find(layers, function (elt, index, array) {
    return elt['Identifier'] == config['layer'];
  });
  if (l === null) {
    return null;
  }
  const tileMatrixSets = wmtsCap['Contents']['TileMatrixSet'];
  let idx;
  if (l['TileMatrixSetLink'].length > 1) {
    if ('projection' in config) {
      idx = findIndex(l['TileMatrixSetLink'],
        function (elt, index, array) {
          const tileMatrixSet = find(tileMatrixSets, function (el) {
            return el['Identifier'] == elt['TileMatrixSet'];
          });
          const supportedCRS = tileMatrixSet['SupportedCRS'];
          const proj1 = getProjection(supportedCRS.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3')) ||
            getProjection(supportedCRS);
          const proj2 = getProjection(config['projection']);
          if (proj1 && proj2) {
            return equivalent(proj1, proj2);
          } else {
            return supportedCRS == config['projection'];
          }
        });
    } else {
      idx = findIndex(l['TileMatrixSetLink'],
        function (elt, index, array) {
          return elt['TileMatrixSet'] == config['matrixSet'];
        });
    }
  } else {
    idx = 0;
  }
  if (idx < 0) {
    idx = 0;
  }
  const matrixSet = /** @type {string} */
    (l['TileMatrixSetLink'][idx]['TileMatrixSet']);
  const matrixLimits = /** @type {Array<Object>} */
    (l['TileMatrixSetLink'][idx]['TileMatrixSetLimits']);

  let format = /** @type {string} */ (l['Format'][0]);
  if ('format' in config) {
    format = config['format'];
  }
  idx = findIndex(l['Style'], function (elt, index, array) {
    if ('style' in config) {
      return elt['Title'] == config['style'];
    } else {
      return elt['isDefault'];
    }
  });
  if (idx < 0) {
    idx = 0;
  }
  const style = /** @type {string} */ (l['Style'][idx]['Identifier']);

  const dimensions = {};
  if ('Dimension' in l) {
    l['Dimension'].forEach(function (elt, index, array) {
      const key = elt['Identifier'];
      let value = elt['Default'];
      if (value === undefined) {
        value = elt['Value'][0];
      }
      dimensions[key] = value;
    });
  }

  const matrixSets = wmtsCap['Contents']['TileMatrixSet'];
  const matrixSetObj = find(matrixSets, function (elt, index, array) {
    return elt['Identifier'] == matrixSet;
  });

  let projection;
  const code = matrixSetObj['SupportedCRS'];
  if (code) {
    projection = getProjection(code.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3')) ||
      getProjection(code);
  }
  if ('projection' in config) {
    const projConfig = getProjection(config['projection']);
    if (projConfig) {
      if (!projection || equivalent(projConfig, projection)) {
        projection = projConfig;
      }
    }
  }

  const wgs84BoundingBox = l['WGS84BoundingBox'];
  let extent, wrapX;
  // PATCH init ------------------
  if (config.extent) {
    extent = config.extent;
  }
  // PATCH end ------------------
  else if (wgs84BoundingBox !== undefined) {
    const wgs84ProjectionExtent = getProjection('EPSG:4326').getExtent();
    wrapX = (wgs84BoundingBox[0] == wgs84ProjectionExtent[0] &&
      wgs84BoundingBox[2] == wgs84ProjectionExtent[2]);
    extent = transformExtent(
      wgs84BoundingBox, 'EPSG:4326', projection);
    const projectionExtent = projection.getExtent();
    if (projectionExtent) {
      // If possible, do a sanity check on the extent - it should never be
      // bigger than the validity extent of the projection of a matrix set.
      if (!containsExtent(projectionExtent, extent)) {
        extent = undefined;
      }
    }
  }

  const tileGrid = createFromCapabilitiesMatrixSet(matrixSetObj, extent, matrixLimits);

  /** @type {!Array<string>} */
  const urls = [];
  let requestEncoding = config['requestEncoding'];
  requestEncoding = requestEncoding !== undefined ? requestEncoding : '';

  if ('OperationsMetadata' in wmtsCap && 'GetTile' in wmtsCap['OperationsMetadata']) {
    const gets = wmtsCap['OperationsMetadata']['GetTile']['DCP']['HTTP']['Get'];

    for (let i = 0, ii = gets.length; i < ii; ++i) {
      if (gets[i]['Constraint']) {
        const constraint = find(gets[i]['Constraint'], function (element) {
          return element['name'] == 'GetEncoding';
        });
        const encodings = constraint['AllowedValues']['Value'];

        if (requestEncoding === '') {
          // requestEncoding not provided, use the first encoding from the list
          requestEncoding = encodings[0];
        }
        if (requestEncoding === WMTSRequestEncoding.KVP) {
          if (includes(encodings, WMTSRequestEncoding.KVP)) {
            urls.push( /** @type {string} */ (gets[i]['href']));
          }
        } else {
          break;
        }
      } else if (gets[i]['href']) {
        requestEncoding = WMTSRequestEncoding.KVP;
        urls.push( /** @type {string} */ (gets[i]['href']));
      }
    }
  }
  if (urls.length === 0) {
    requestEncoding = WMTSRequestEncoding.REST;
    l['ResourceURL'].forEach(function (element) {
      if (element['resourceType'] === 'tile') {
        format = element['format'];
        urls.push( /** @type {string} */ (element['template']));
      }
    });
  }

  return {
    urls: urls,
    layer: config['layer'],
    matrixSet: matrixSet,
    format: format,
    projection: projection,
    requestEncoding: requestEncoding,
    tileGrid: tileGrid,
    style: style,
    dimensions: dimensions,
    wrapX: wrapX,
    crossOrigin: config['crossOrigin']
  };
}
