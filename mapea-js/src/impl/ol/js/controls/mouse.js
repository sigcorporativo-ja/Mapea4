goog.provide('M.impl.control.Mouse');

goog.require('ol.control.MousePosition');

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
   M.impl.control.Mouse = function() {
      this.facadeMap_ = null;
   };
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
    M.impl.control.Mouse.prototype.addTo = function(map, element) {
      this.facadeMap_ = map;
      ol.control.MousePosition.call(this, {
         'coordinateFormat': ol.coordinate.createStringXY(4),
         'projection': map.getProjection().code,
         'undefinedHTML': '',
         'className': 'm-mouse-position g-cartografia-flecha'
      });
      map.getMapImpl().addControl(this);

      // update projection mouse
      map.getImpl().on(M.evt.CHANGE, function() {
         this.setProjection(ol.proj.get(map.getProjection().code));
      }, this);
   };

   /**
    * function remove the event 'click'
    *
    * @public
    * @function
    * @api stable
    * @export
    */
   M.impl.control.Mouse.prototype.getElement = function() {
      return this.element;
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
   M.impl.control.Mouse.prototype.destroy = function() {
      this.facadeMap_.getMapImpl().removeControl(this);
      this.facadeMap_ = null;
   };
})();
