goog.provide('M.impl.Control');

goog.require('ol.control.Control');

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
   M.impl.Control = function() {
      /**
       * @private
       * @type {string}
       * @expose
       */
      this.facadeMap_ = null;
   };
   goog.inherits(M.impl.Control, ol.control.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    * @export
    */
   M.impl.Control.prototype.addTo = function(map, element) {
      this.facadeMap_ = map;
      ol.control.Control.call(this, {
         'element': element,
         'target': null
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
    * @export
    */
   M.impl.Control.prototype.destroy = function() {
      this.facadeMap_.getMapImpl().removeControl(this);
      this.facadeMap_ = null;
   };

   /**
    * function remove the event 'click'
    *
    * @public
    * @function
    * @api stable
    * @export
    */
   M.impl.Control.prototype.getElement = function() {
      return this.element;
   };
})();