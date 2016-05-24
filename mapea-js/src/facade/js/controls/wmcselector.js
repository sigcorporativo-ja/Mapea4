goog.provide('M.control.WMCSelector');

goog.require('M.Control');
goog.require('M.template');
goog.require('M.utils');
goog.require('M.exception');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMCSelector
    * control to provides a way to select an specific WMC
    *
    * @constructor
    * @extends {M.Control}
    * @api stable
    */
   M.control.WMCSelector = (function() {
      // checks if the implementation can create WMC layers
      if (M.utils.isUndefined(M.impl.control.WMCSelector)) {
         M.exception('La implementación usada no puede crear controles WMCSelector');
      }

      // implementation of this control
      var impl = new M.impl.control.WMCSelector();

      // calls the super constructor
      goog.base(this, impl, 'wmcselector');
   });
   goog.inherits(M.control.WMCSelector, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.control.WMCSelector.prototype.createView = function(map) {
      // compiles the template
      return M.template.compile(M.control.WMCSelector.TEMPLATE, {
         'jsonp': true,
         'vars': {
            'layers': map.getWMC()
         }
      });
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
    * @api stable
    */
   M.control.WMCSelector.prototype.equals = function(obj) {
      var equals = false;
      if (obj instanceof M.control.WMCSelector) {
         equals = (this.name === obj.name);
      }
      return equals;
   };

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.WMCSelector.TEMPLATE = 'wmcselector.html';
})();