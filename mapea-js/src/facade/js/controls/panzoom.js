goog.provide('M.control.Panzoom');

goog.require('M.Control');
goog.require('M.utils');
goog.require('M.exception');

(function () {
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
   M.control.Panzoom = (function () {
      if (M.utils.isUndefined(M.impl.control.Panzoom)) {
         M.exception('La implementación usada no puede crear controles Panzoom');
      }
      // implementation of this control
      var impl = new M.impl.control.Panzoom();

      // calls the super constructor
      goog.base(this, impl);
   });
   goog.inherits(M.control.Panzoom, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.Panzoom.prototype.createView = function (map) {
      return M.template.compile(M.control.Panzoom.TEMPLATE);
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
    * @api stable
    */
   M.control.Panzoom.prototype.equals = function (obj) {
      var equals = (obj instanceof M.control.Panzoom);
      return equals;
   };

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Panzoom.NAME = 'panzoom';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Panzoom.TEMPLATE = 'panzoom.html';
})();