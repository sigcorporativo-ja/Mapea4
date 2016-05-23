goog.provide('M.impl.control.OverviewMap');

goog.require('ol.control.OverviewMap');

/**
 * @namespace M.impl.control
 */
(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMC selector
    * control
    *
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.control.OverviewMap = function () {};
   goog.inherits(M.impl.control.OverviewMap, ol.control.OverviewMap);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.OverviewMap.prototype.addTo = function (map, element) {
      var baseLayers = map.getBaseLayers();
      ol.control.OverviewMap.call(this, {
         layers: baseLayers.map(function (layer) {
            return layer.getImpl().getOL3Layer();
         })
      });
      map.getMapImpl().addControl(this);
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.OverviewMap.prototype.destroy = function () {
      this.map.removeControl(this);
      this.map = null;
   };
})();