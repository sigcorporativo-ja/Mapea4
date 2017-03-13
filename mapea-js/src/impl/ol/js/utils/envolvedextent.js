goog.provide('M.impl.envolvedExtent');

/**
 * @namespace M.impl.envolvedExtent
 */
(function() {

   /**
    * The map instance
    * @private
    * @type {M.impl.Map}
    */
   M.impl.envolvedExtent.calculating = false;

    /**
    * Extent from wmc
    * @private
    * @type {ol.Extent}
    */
   M.impl.envolvedExtent.extentwmc_ = null;

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
   M.impl.envolvedExtent.calculate = function(map, opt_this) {
      return new Promise(function(success, fail) {
         // get max extent from the selected WMC
         var selectedWMC = map.getWMC().filter(function(wmcLayer) {
            return (wmcLayer.selected === true);
         })[0];
         // get max extent from WMS layers
         // if a base layer was specified then it calculates its maxExtent
         var wmsLayers = [];
         var baseLayers = map.getBaseLayers().filter(function(baseLayer) {
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
         if (!M.utils.isNullOrEmpty(selectedWMC)) {
            M.impl.envolvedExtent.calculateFromWMC(selectedWMC).then(function(extent) {
               M.impl.envolvedExtent.extentwmc_ = extent;
               success(extent);
            });
         }
         else if (wmsLayers.length > 0) {
            M.impl.envolvedExtent.calculateFromWMS(wmsLayers).then(function(extent) {
               if(M.utils.isNullOrEmpty(M.impl.envolvedExtent.extentwmc_)){
                  success(extent);
               }else{
                  success(M.impl.envolvedExtent.extentwmc_);
               }
            });
         }
         else {
            M.impl.envolvedExtent.calculateFromProjection(map).then(function(extent) {
               if(M.utils.isNullOrEmpty(M.impl.envolvedExtent.extentwmc_)){
                  success(extent);
               }else{
                  success(M.impl.envolvedExtent.extentwmc_);
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
   M.impl.envolvedExtent.calculateFromWMC = function(wmcLayer) {
      return new Promise(function(success, fail) {
         wmcLayer.getImpl().getMaxExtent().then(function(extent) {
            success(extent);
         });
      });
   };

   /**
    * Calculates the extension from Projection
    * @function
    * @public
    * @param {M.Map} map - Map
    * @returns {Promise} extent
    * @api stable
    */
   M.impl.envolvedExtent.calculateFromProjection = function(map) {
      return new Promise(function(success, fail) {
         var projExtent = ol.proj.get(map.getProjection().code).getExtent();
         if (M.utils.isNullOrEmpty(projExtent)) {
            projExtent = [-180, -90, 180, 90];
         }
         success(projExtent);
      });
   };

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
   M.impl.envolvedExtent.calculateFromWMS = function(wmsLayers) {
      var promise = new Promise(function(success, fail) {
         var index = 0;
         var wmsLayersLength = wmsLayers.length;
         var envolvedExtent = [Infinity, Infinity, -Infinity, -Infinity];
         var updateExtent = function(extent) {
            M.impl.envolvedExtent.updateExtent_(envolvedExtent, extent);
            if (index === (wmsLayersLength - 1)) {
               success(envolvedExtent);
            }
            index++;
         };

         if (!M.utils.isNullOrEmpty(wmsLayers)) {
            for (var i = 0; i < wmsLayersLength; i++) {
               var wmsLayer = wmsLayers[i];
               var extent = wmsLayer.getImpl().getExtent();
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
   };

   /**
    * This function calculates the extent for a specific layer
    * from its getCapabilities
    *
    * @private
    * @function
    * @param {Mx.GetCapabilities} capabilities
    */
   M.impl.envolvedExtent.updateExtent_ = function(extent, newExtent) {
      if (M.utils.isArray(newExtent)) {
         extent[0] = Math.min(extent[0], newExtent[0]);
         extent[1] = Math.min(extent[1], newExtent[1]);
         extent[2] = Math.max(extent[2], newExtent[2]);
         extent[3] = Math.max(extent[3], newExtent[3]);
      }
      else if (M.utils.isObject(newExtent)) {
         extent[0] = Math.min(extent[0], newExtent.x.min);
         extent[1] = Math.min(extent[1], newExtent.y.min);
         extent[2] = Math.max(extent[2], newExtent.x.max);
         extent[3] = Math.max(extent[3], newExtent.y.max);
      }
   };
})();
