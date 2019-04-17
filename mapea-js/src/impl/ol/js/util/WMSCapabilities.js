/**
 * @module M/impl/GetCapabilities
 */
import { isNullOrEmpty, isArray, isObject, isUndefined } from 'M/util/Utils';
import WMS from 'M/layer/WMS';
import { get as getProj } from 'ol/proj';
import ImplUtils from './Utils';

/**
 * @classdesc
 * Main constructor of the class. Creates a WMS layer
 * with parameters specified by the user
 * @api
 */
class GetCapabilities {
  /**
   * @constructor
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  constructor(capabilities, serviceUrl, projection) {
    /**
     * The WMS layers capabilities
     * @private
     * @type {Object}
     */
    this.capabilities_ = capabilities;

    /**
     * The projection
     * @private
     * @type {Mx.Projection}
     */
    this.projection_ = projection;

    /**
     * The projection
     * @private
     * @type {Mx.Projection}
     */
    this.serviceUrl_ = serviceUrl;
  }

  /**
   * This function calculates the extent for a specific layer
   * from its getCapabilities
   *
   * @public
   * @function
   * @param {Mx.GetCapabilities} capabilities
   * @param {String} layerName
   * @returns {Array<Number>} the extension
   * @api stable
   */
  getLayerExtent(layerName) {
    const layer = this.capabilities_.Capability.Layer;
    const extent = this.getExtentRecursive_(layer, layerName);
    return extent;
  }

  /**
   * This function calculates the extent for a specific layer
   * from its getCapabilities
   *
   * @private
   * @function
   * @param {Mx.GetCapabilities} capabilities
   * @param {String} layerName
   * @returns {Array<Number>} the extension
   */
  getExtentRecursive_(layer, layerName) {
    let extent = null;
    let i;
    if (!isNullOrEmpty(layer)) {
      // array
      if (isArray(layer)) {
        for (i = 0; i < layer.length && extent === null; i += 1) {
          extent = this.getExtentRecursive_(layer[i], layerName);
        }
      } else if (isObject(layer)) {
        // base case
        if (isNullOrEmpty(layerName) || (layer.Name === layerName)) {
          if (!isNullOrEmpty(layer.BoundingBox)) {
            const bboxSameProj = layer.BoundingBox.find(bbox => bbox.crs === this.projection_.code);
            if (!isNullOrEmpty(bboxSameProj)) {
              extent = bboxSameProj.extent;
            } else {
              const bbox = layer.BoundingBox[0];
              const projSrc = getProj(bbox.crs);
              const projDest = getProj(this.projection_.code);
              extent = ImplUtils.transformExtent(bbox.extent, projSrc, projDest);
            }
          } else if (!isNullOrEmpty(layer.LatLonBoundingBox)) {
            const bbox = layer.LatLonBoundingBox[0];
            // if the layer has not the SRS then transformExtent
            // the latLonBoundingBox which is always present
            const projSrc = getProj('EPSG:4326');
            const projDest = getProj(this.projection_.code);
            extent = ImplUtils.transformExtent(bbox.extent, projSrc, projDest);
          }
        } else if (!isUndefined(layer.Layer)) {
          // recursive case
          extent = this.getExtentRecursive_(layer.Layer, layerName);
        }
      }
    }
    return extent;
  }

  /**
   * This function calculates the extent for a specific layer
   * from its getCapabilities
   *
   * @private
   * @function
   * @param {Mx.GetCapabilities} capabilities
   * @param {String} layerName
   * @returns {Array<Number>} the extension
   */
  getLayers() {
    const layer = this.capabilities_.Capability.Layer;
    const layers = this.getLayersRecursive_(layer);
    return layers;
  }

  /**
   * This function calculates the extent for a specific layer
   * from its getCapabilities
   *
   * @private
   * @function
   * @param {Mx.GetCapabilities} capabilities
   * @param {String} layerName
   * @returns {Array<Number>} the extension
   */
  getLayersRecursive_(layer) {
    let layers = [];
    if (!isNullOrEmpty(layer.Layer)) {
      layers = this.getLayersRecursive_(layer.Layer);
    } else if (isArray(layer)) {
      layer.forEach((layerElem) => {
        layers = layers.concat(this.getLayersRecursive_(layerElem));
      });
    } else { // base case
      layers.push(new WMS({ url: this.serviceUrl_, name: layer.Name }));
    }
    return layers;
  }
}

export default GetCapabilities;
