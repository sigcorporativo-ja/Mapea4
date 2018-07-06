import Utils from "facade/js/utils/utils";

/**
 * @namespace M.impl.envolvedExtent
 */
export default class EnvolvedExtent {

  /**
   * The map instance
   * @private
   * @type {M.impl.Map}
   */
  EnvolvedExtent.calculating = false;

  /**
   * Extent from wmc
   * @private
   * @type {ol.Extent}
   */
  EnvolvedExtent.extentwmc_ = null;

  /**
   * This function calculates the envolved extent
   * of the whole map.
   *
   * Gets the maxExtent following this order:
   *
   * 1. Gets it from a selected WMC layer
   * 2. Gets it from a WMS base layer
   * 3. Gets it from envolved WMS layers
   * 4. Gets it from other layers
   * 5. Gets it from the projection
   *
   * @function
   * @param {M.Map} map
   * @param {Object} opt_this
   * @returns {Mx.Extent}
   * @api stable
   */
  static calculate(map, opt_this) {
    return new Promise((success, fail) => {
      // get max extent from the selected WMC
      let selectedWMC = map.getWMC().filter(wmcLayer => {
        return (wmcLayer.selected === true);
      })[0];
      // get max extent from WMS layers
      // if a base layer was specified then it calculates its maxExtent
      let wmsLayers = [];
      let baseLayers = map.getBaseLayers().filter(baseLayer => {
        return baseLayer.isVisible();
      });
      if (baseLayers.length > 0) {
        wmsLayers.push(baseLayers[0]);
      } else {
        // if no base layers were specified then calculates the
        // envolved max extent for all WMS layers
        wmsLayers = map.getWMS();
      }
      if (!Utils.isNullOrEmpty(selectedWMC)) {
        EnvolvedExtent.calculateFromWMC(selectedWMC).then(extent => {
          EnvolvedExtent.extentwmc_ = extent;
          success(extent);
        });
      } else if (wmsLayers.length > 0) {
        EnvolvedExtent.calculateFromWMS(wmsLayers).then(extent => {
          if (Utils.isNullOrEmpty(EnvolvedExtent.extentwmc_)) {
            success(extent);
          } else {
            success(EnvolvedExtent.extentwmc_);
          }
        });
      } else {
        EnvolvedExtent.calculateFromProjection(map).then(extent => {
          if (Utils.isNullOrEmpty(M.impl.envolvedExtent.extentwmc_)) {
            success(extent);
          } else {
            success(EnvolvedExtent.extentwmc_);
          }
        });
      }
    });
  };

  /**
   * Calculates the extension from WMC
   * @function
   * @public
   * @param {M.layer.WMC} wmcLayer - WMC
   * @returns {Promise} extent
   * @api stable
   */
  static calculateFromWMC(wmcLayer) {
    return new Promise((success, fail) => {
      wmcLayer.getImpl().getMaxExtent().then(extent => {
        success(extent);
      });
    });
  }

  /**
   * Calculates the extension from Projection
   * @function
   * @public
   * @param {M.Map} map - Map
   * @returns {Promise} extent
   * @api stable
   */
  static calculateFromProjection(map) {
    return new Promise((success, fail) => {
      var projExtent = ol.proj.get(map.getProjection().code).getExtent();
      if (Utils.isNullOrEmpty(projExtent)) {
        projExtent = [-180, -90, 180, 90];
      }
      success(projExtent);
    });
  }

  /**
   * This function calculates the envolved extent
   * of the whole map
   *
   * @function
   * @param {M.Map} map
   * @param {Object} opt_this
   * @returns {Mx.Extent}
   * @api stable
   */
  static calculateFromWMS(wmsLayers) {
    let promise = new Promise((success, fail) => {
      let index = 0;
      let wmsLayersLength = wmsLayers.length;
      let envolvedExtent = [Infinity, Infinity, -Infinity, -Infinity];
      let updateExtent = (extent) => {
        EnvolvedExtent.updateExtent_(envolvedExtent, extent);
        if (index === (wmsLayersLength - 1)) {
          success(envolvedExtent);
        }
        index++;
      };

      if (!Utils.isNullOrEmpty(wmsLayers)) {
        for (var i = 0; i < wmsLayersLength; i++) {
          let wmsLayer = wmsLayers[i];
          let extent = wmsLayer.getImpl().getExtent();
          if (extent instanceof Promise) {
            extent.then(updateExtent);
          } else {
            updateExtent(extent);
          }
        }
      } else {
        success(envolvedExtent);
      }
    });
    return promise;
  }

  /**
   * This function calculates the extent for a specific layer
   * from its getCapabilities
   *
   * @private
   * @function
   * @param {Mx.GetCapabilities} capabilities
   */
  static updateExtent_(extent, newExtent) {
    if (Utils.isArray(newExtent)) {
      extent[0] = Math.min(extent[0], newExtent[0]);
      extent[1] = Math.min(extent[1], newExtent[1]);
      extent[2] = Math.max(extent[2], newExtent[2]);
      extent[3] = Math.max(extent[3], newExtent[3]);
    } else if (Utils.isObject(newExtent)) {
      extent[0] = Math.min(extent[0], newExtent.x.min);
      extent[1] = Math.min(extent[1], newExtent.y.min);
      extent[2] = Math.max(extent[2], newExtent.x.max);
      extent[3] = Math.max(extent[3], newExtent.y.max);
    }
  };
}
