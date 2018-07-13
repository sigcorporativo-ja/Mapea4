import Utils from 'facade/js/util/Utils';

/**
 * @namespace M.impl.envolvedExtent
 */
export default class EnvolvedExtent {
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
  static calculate(map) {
    return new Promise((success) => {
      // get max extent from the selected WMC
      const selectedWMC = map.getWMC().filter((wmcLayer) => {
        return (wmcLayer.selected === true);
      })[0];
      // get max extent from WMS layers
      // if a base layer was specified then it calculates its maxExtent
      let wmsLayers = [];
      const baseLayers = map.getBaseLayers().filter((baseLayer) => {
        return baseLayer.isVisible();
      });
      if (baseLayers.length > 0) {
        wmsLayers.push(baseLayers[0]);
      }
      else {
        // if no base layers were specified then calculates the
        // envolved max extent for all WMS layers
        wmsLayers = map.getWMS();
      }
      if (!Utils.isNullOrEmpty(selectedWMC)) {
        EnvolvedExtent.calculateFromWMC(selectedWMC).then((extent) => {
          EnvolvedExtent.extentwmc = extent;
          success(extent);
        });
      }
      else if (wmsLayers.length > 0) {
        EnvolvedExtent.calculateFromWMS(wmsLayers).then((extent) => {
          if (Utils.isNullOrEmpty(EnvolvedExtent.extentwmc)) {
            success(extent);
          }
          else {
            success(EnvolvedExtent.extentwmc);
          }
        });
      }
      else {
        EnvolvedExtent.calculateFromProjection(map).then((extent) => {
          if (Utils.isNullOrEmpty(EnvolvedExtent.extentwmc)) {
            success(extent);
          }
          else {
            success(EnvolvedExtent.extentwmc);
          }
        });
      }
    });
  }

  /**
   * Calculates the extension from WMC
   * @function
   * @public
   * @param {M.layer.WMC} wmcLayer - WMC
   * @returns {Promise} extent
   * @api stable
   */
  static calculateFromWMC(wmcLayer) {
    return new Promise((success) => {
      wmcLayer.getImpl().getMaxExtent().then((extent) => {
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
      let projExtent = ol.proj.get(map.getProjection().code).getExtent();
      if (Utils.isNullOrEmpty(projExtent)) {
        projExtent = [-180, -90, 180, 90];
        success(projExtent);
      }
      else {
        const err = new Error('Error en calculateFromProjection. Modulo EnvolvedExtent.');
        fail(err);
      }
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
    const promise = new Promise((success, fail) => {
      let index = 0;
      const wmsLayersLength = wmsLayers.length;
      let envolvedExtent = [Infinity, Infinity, -Infinity, -Infinity];
      const updateExtent = (extent) => {
        envolvedExtent = EnvolvedExtent.updateExtent(envolvedExtent, extent);
        if (index === (wmsLayersLength - 1)) {
          success(envolvedExtent);
        }
        else {
          const err = new Error('Error en calculateFromWMC. Modulo EnvolvedExtent.');
          fail(err);
        }
        index += 1;
      };

      if (!Utils.isNullOrEmpty(wmsLayers)) {
        for (let i = 0; i < wmsLayersLength; i += 1) {
          const wmsLayer = wmsLayers[i];
          const extent = wmsLayer.getImpl().getExtent();
          if (extent instanceof Promise) {
            extent.then(updateExtent);
          }
          else {
            updateExtent(extent);
          }
        }
      }
      else {
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
  static updateExtent(extent, newExtent) {
    const extentVariable = extent;
    if (Utils.isArray(newExtent)) {
      extentVariable[0] = Math.min(extentVariable[0], newExtent[0]);
      extentVariable[1] = Math.min(extentVariable[1], newExtent[1]);
      extentVariable[2] = Math.max(extentVariable[2], newExtent[2]);
      extentVariable[3] = Math.max(extentVariable[3], newExtent[3]);
    }
    else if (Utils.isObject(newExtent)) {
      extentVariable[0] = Math.min(extentVariable[0], newExtent.x.min);
      extentVariable[1] = Math.min(extentVariable[1], newExtent.y.min);
      extentVariable[2] = Math.max(extentVariable[2], newExtent.x.max);
      extentVariable[3] = Math.max(extentVariable[3], newExtent.y.max);
    }
    return extentVariable;
  }
}


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
EnvolvedExtent.extentwmc = null;
