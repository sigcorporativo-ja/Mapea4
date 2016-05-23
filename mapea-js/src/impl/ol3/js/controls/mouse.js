goog.provide('M.impl.control.Mouse');

goog.require('ol.control.MousePosition');

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
   M.impl.control.Mouse = function () {};
   goog.inherits(M.impl.control.Mouse, ol.control.MousePosition);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Mouse.prototype.addTo = function (map, element) {
      ol.control.MousePosition.call(this, {
         coordinateFormat: ol.coordinate.createStringXY(4),
         projection: map.getProjection().code,
         undefinedHTML: '&nbsp;'
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
   M.impl.control.Mouse.prototype.destroy = function () {
      this.map.removeControl(this);
      this.map = null;
   };
})();