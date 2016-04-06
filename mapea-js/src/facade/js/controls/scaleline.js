goog.provide('M.control.ScaleLine');

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
   M.control.ScaleLine = (function () {
      if (M.utils.isUndefined(M.impl.control.ScaleLine)) {
         M.exception('La implementación usada no puede crear controles ScaleLine');
      }
      // implementation of this control
      var impl = new M.impl.control.ScaleLine();

      // calls the super constructor
      goog.base(this, impl, M.control.ScaleLine.NAME);
   });
   goog.inherits(M.control.ScaleLine, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.ScaleLine.prototype.createView = function (map) {
      return M.template.compile(M.control.ScaleLine.TEMPLATE);
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
    * @api stable
    */
   M.control.ScaleLine.prototype.equals = function (obj) {
      var equals = (obj instanceof M.control.ScaleLine);
      return equals;
   };

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.ScaleLine.NAME = 'scaleline';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.ScaleLine.TEMPLATE = 'scaleline.html';
})();