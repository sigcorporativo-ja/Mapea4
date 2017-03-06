goog.provide('P.impl.control.GeosearchIntegrated');

goog.require('P.impl.layer.Geosearch');
goog.require('P.impl.control.Geosearch');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc
    * Main constructor of the GeosearchIntegrated control.
    *
    * @constructor
    * @extends {M.impl.control.Geosearch}
    * @api stable
    */
   M.impl.control.GeosearchIntegrated = function() {
      goog.base(this);
   };
   goog.inherits(M.impl.control.GeosearchIntegrated, M.impl.control.Geosearch);

   /**
    * This function replaces the addto of Geosearch not to add control
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the plugin
    * @param {function} element - Template SearchstreetGeosearch control
    * @api stable
    */
   M.impl.control.GeosearchIntegrated.prototype.addTo = function(map, element) {
      this.facadeMap_ = map;

      this.layer_.addTo(map);
      map.getImpl().getFeaturesHandler().addLayer(this.layer_);

      ol.control.Control.call(this, {
         'element': element,
         'target': null
      });
   };

   /**
    *  This function cancels the zoom function of Geosearch
    *
    * @private
    * @function
    */
   M.impl.control.GeosearchIntegrated.prototype.zoomToResults = function() {};

})();