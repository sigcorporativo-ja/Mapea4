goog.provide('M.control.Location');

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
   M.control.Location = (function () {
      if (M.utils.isUndefined(M.impl.control.Location)) {
         M.exception('La implementación usada no puede crear controles Location');
      }
      // implementation of this control
      var impl = new M.impl.control.Location();

      // calls the super constructor
      goog.base(this, impl, M.control.Location.NAME);
   });
   goog.inherits(M.control.Location, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.Location.prototype.createView = function (map) {
      return M.template.compile(M.control.Location.TEMPLATE);
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @param {HTMLElement} html to add the plugin
    * @api stable
    * @export
    */
   M.control.Location.prototype.getActivationButton = function (element) {
      return element.querySelector('button#m-location-button');
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
    * @api stable
    */
   M.control.Location.prototype.equals = function (obj) {
      var equals = (obj instanceof M.control.Location);
      return equals;
   };

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Location.NAME = 'location';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Location.TEMPLATE = 'location.html';
})();