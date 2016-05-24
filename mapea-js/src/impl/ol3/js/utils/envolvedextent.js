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
    * This function calculates the envolved extent
    * of the whole map
    *
    * @function
    * @param {M.Map} map
    * @param {Object} opt_this
    * @returns {Mx.Extent}
    * @api stable
    */
   M.impl.envolvedExtent.calculate = function(map, opt_this) {
      var envolvedExtent = {
         x: {
            max: Number.NEGATIVE_INFINITY,
            min: Number.POSITIVE_INFINITY
         },
         y: {
            max: Number.NEGATIVE_INFINITY,
            min: Number.POSITIVE_INFINITY
         }
      };

      var calculatingWMCExtent = false;
      var calculatingWMSExtent = false;

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
            calculatingWMCExtent = true;
            selectedWMC.getImpl().getMaxExtent().then(function(extent) {
               M.impl.envolvedExtent.updateExtent_(envolvedExtent, extent);
               calculatingWMCExtent = false;

               // call success
               if (!calculatingWMCExtent && !calculatingWMSExtent) {
                  success.call(opt_this, envolvedExtent);
               }
            });
         }
         else if (wmsLayers.length > 0) {
            calculatingWMSExtent = true;
            M.impl.envolvedExtent.calculateFromWMS(wmsLayers).then(function(extent) {
               M.impl.envolvedExtent.updateExtent_(envolvedExtent, extent);
               calculatingWMSExtent = false;

               // call success
               if (!calculatingWMCExtent && !calculatingWMSExtent) {
                  success.call(opt_this, envolvedExtent);
               }
            });
         }
         else {
            var projExtent = ol.proj.get(map.getProjection().code).getExtent();
            if (M.utils.isNullOrEmpty(projExtent)) {
               projExtent = [-180, -90, 180, 90];
            }
            M.impl.envolvedExtent.updateExtent_(envolvedExtent, projExtent);
            success.call(opt_this, envolvedExtent);
         }
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
      if (M.utils.isArray(extent) && M.utils.isArray(newExtent)) {
         extent[0] = Math.min(extent[0], newExtent[0]);
         extent[1] = Math.min(extent[1], newExtent[1]);
         extent[2] = Math.max(extent[2], newExtent[2]);
         extent[3] = Math.max(extent[3], newExtent[3]);
      }
      else if (M.utils.isObject(extent) && M.utils.isArray(newExtent)) {
         extent.x.min = Math.min(extent.x.min, newExtent[0]);
         extent.y.min = Math.min(extent.y.min, newExtent[1]);
         extent.x.max = Math.max(extent.x.max, newExtent[2]);
         extent.y.max = Math.max(extent.y.max, newExtent[3]);
      }
      else if (M.utils.isArray(extent) && M.utils.isObject(newExtent)) {
         extent[0] = Math.min(extent[0], newExtent.x.min);
         extent[1] = Math.min(extent[1], newExtent.y.min);
         extent[2] = Math.max(extent[2], newExtent.x.max);
         extent[3] = Math.max(extent[3], newExtent.y.max);
      }
      else if (M.utils.isObject(extent) && M.utils.isObject(newExtent)) {
         extent.x.min = Math.min(extent.x.min, newExtent.x.min);
         extent.y.min = Math.min(extent.y.min, newExtent.y.min);
         extent.x.max = Math.max(extent.x.max, newExtent.x.max);
         extent.y.max = Math.max(extent.y.max, newExtent.y.max);
      }
   };
})();