import { isNullOrEmpty, isArray, isObject } from 'M/util/Utils';
import { get as getProj } from 'ol/proj';
import ImplUtils from './Utils';

/**
 * TODO
 * @function
 */
const getExtentRecursive = (layer, layerName, code) => {
  let extent = null;
  if (!isNullOrEmpty(layer)) {
    if (isArray(layer)) {
      for (let i = 0; i < layer.length && extent === null; i += 1) {
        extent = getExtentRecursive(layer[i], layerName, code);
      }
    } else if (isObject(layer)) {
      // base case
      if (isNullOrEmpty(layerName) || (layer.Identifier === layerName)) {
        extent = layer.WGS84BoundingBox;
        const extentProj = getProj('EPSG:4326');
        const oldProj = getProj(code);
        extent = ImplUtils.transformExtent(extent, extentProj, oldProj);
      }
    }
  }
  return extent;
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
const getLayerExtent = (parsedCapabilities, name, code) => {
  return getExtentRecursive(parsedCapabilities.Layer, name, code);
};

export default getLayerExtent;
