goog.provide('M.impl.control.Navtoolbar');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMC selector
    * control
    *
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.control.Navtoolbar = function() {
      this.element_ = null;
   };

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Navtoolbar.prototype.addTo = function(map, element) {
      this.element_ = element;
   };

   /**
    * function remove the event 'click'
    *
    * @public
    * @function
    * @api stable
    * @export
    */
   M.impl.control.Navtoolbar.prototype.getElement = function() {
      return this.element_;
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    * @export
    */
   M.impl.control.Navtoolbar.prototype.destroy = function() {};
})();