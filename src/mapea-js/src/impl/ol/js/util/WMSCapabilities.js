import Utils from 'facade/js/util/Utils';
import WMS from 'facade/js/layer/WMS';

/**
 * @namespace M.impl.GetCapabilities
 */
export default class GetCapabilities {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
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
    let ilen;
    if (!Utils.isNullOrEmpty(layer)) {
      // array
      if (Utils.isArray(layer)) {
        for (i = 0; i < layer.length && extent === null; i += 1) {
          extent = this.getExtentRecursive_(layer[i], layerName);
        }
      }
      else if (Utils.isObject(layer)) {
        // base case
        if (Utils.isNullOrEmpty(layerName) || (layer.Name === layerName)) {
          // if the layer supports the SRS
          let srsArray = [];
          if (!Utils.isNullOrEmpty(layer.SRS)) {
            srsArray = layer.SRS;
          }
          else if (!Utils.isNullOrEmpty(layer.CRS)) {
            srsArray = layer.CRS;
          }
          if (srsArray.indexOf(this.projection_.code) !== -1) {
            let matchedBbox = null;
            const bboxes = layer.BoundingBox;
            for (i = 0, ilen = bboxes.length;
              (i < ilen) && (matchedBbox === null); i += 1) {
              const bbox = bboxes[i];
              if (bbox.crs === this.projection_.code) {
                matchedBbox = bbox;
              }
            }
            if (matchedBbox === null) {
              matchedBbox = bboxes[0];
            }
            extent = matchedBbox.extent;
            if (matchedBbox.crs !== this.projection_.code) {
              const projSrc = ol.proj.get(matchedBbox.crs);
              const projDest = ol.proj.get(this.projection_.code);
              extent = ol.proj.transformExtent(extent, projSrc, projDest);
            }
          }
          // if the layer has not the SRS then transformExtent
          // the latLonBoundingBox which is always present
          else {
            extent = layer.LatLonBoundingBox[0].extent;
            extent = ol.proj.transformExtent(extent, ol.proj.get('EPSG:4326'), ol.proj.get(this.projection_.code));
          }
        }
        // recursive case
        else if (!Utils.isUndefined(layer.Layer)) {
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
    if (!Utils.isNullOrEmpty(layer.Layer)) {
      layers = this.getLayersRecursive_(layer.Layer);
    }
    else if (Utils.isArray(layer)) {
      layer.forEach((layerElem) => {
        layers = layers.concat(this.getLayersRecursive_(layerElem));
      });
    }
    else { // base case
      layers.push(new WMS({
        url: this.serviceUrl_,
        name: layer.Name,
      }));
    }
    return layers;
  }
}
