goog.provide('M.control.Mouse');

goog.require('M.Control');
goog.require('M.utils');
goog.require('M.exception');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a GetFeatureInfo
    * control to provides a popup with information about the place
    * where the user has clicked inside the map.
    *
    * @constructor
    * @param {String} format format response
    * @extends {M.Control}
    * @api stable
    */
   M.control.Mouse = (function() {
      if (M.utils.isUndefined(M.impl.control.Mouse)) {
         M.exception('La implementación usada no puede crear controles Mouse');
      }
      // implementation of this control
      var impl = new M.impl.control.Mouse();

      // calls the super constructor
      goog.base(this, impl, M.control.Mouse.NAME);
   });
   goog.inherits(M.control.Mouse, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.Mouse.prototype.createView = function(map) {
      return M.template.compile(M.control.Mouse.TEMPLATE, {
         'jsonp': true
      });
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
    * @api stable
    */
   M.control.Mouse.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.Mouse);
      return equals;
   };

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Mouse.NAME = 'mouse';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Mouse.TEMPLATE = 'mouse.html';
})();