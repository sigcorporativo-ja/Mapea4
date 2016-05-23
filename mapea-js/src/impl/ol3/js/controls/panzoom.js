goog.provide('M.impl.control.Panzoom');

goog.require('ol.control.Zoom');

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
   M.impl.control.Panzoom = function () {
      goog.base(this);
   };
   goog.inherits(M.impl.control.Panzoom, ol.control.Zoom);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Panzoom.prototype.addTo = function (map, element) {
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
   M.impl.control.Panzoom.prototype.destroy = function () {
      this.map.removeControl(this);
      this.map = null;
   };
})();