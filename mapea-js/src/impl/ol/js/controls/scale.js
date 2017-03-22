goog.provide('M.impl.control.Scale');

goog.require('M.impl.Control');
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
   M.impl.control.Scale = function() {
      this.facadeMap_ = null;
   };
   goog.inherits(M.impl.control.Scale, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Scale.prototype.addTo = function(map, element) {
      this.facadeMap_ = map;

      var scaleId = 'm-scale-span';
      this.scaleContainer_ = element.querySelector('#'.concat(scaleId));

      ol.control.Control.call(this, {
         'element': element,
         'render': this.render,
         'target': null
      });
      map.getMapImpl().addControl(this);
   };

   /**
    * Update the scale line element.
    * @param {ol.MapEvent} mapEvent Map event.
    * @this {ol.control.ScaleLine}
    * @api
    */
   M.impl.control.Scale.prototype.render = function(mapEvent) {
      var frameState = mapEvent.frameState;
      if (!M.utils.isNullOrEmpty(frameState)) {
         M.impl.control.Scale.updateElement_(frameState.viewState, this.scaleContainer_, this.facadeMap_);
      }
   };

   /**
    * @private
    */
   M.impl.control.Scale.updateElement_ = function(viewState, container, map) {
      container.innerHTML = map.getScale();
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Scale.prototype.destroy = function() {
      goog.base(this, 'destroy');
      this.scaleContainer_ = null;
   };
})();