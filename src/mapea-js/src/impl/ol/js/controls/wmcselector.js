goog.provide('M.impl.control.WMCSelector');

goog.require('M.impl.Control');

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
   M.impl.control.WMCSelector = function() {};
   goog.inherits(M.impl.control.WMCSelector, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.WMCSelector.prototype.addTo = function(map, element) {
      var select = element.getElementsByTagName('select')[0];
      select.addEventListener('change', function(e) {
         var selectedWMCLayer = map.getWMC(e.target.value)[0];
         selectedWMCLayer.select();
      });

      goog.base(this, 'addTo', map, element);
   };
})();