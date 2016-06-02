goog.provide('M.control.Location');

goog.require('M.Control');
goog.require('M.utils');
goog.require('M.exception');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a Location
    * control that allows the user to locate and draw your
    * position on the map.
    *
    * @constructor
    * @extends {M.Control}
    * @api stable
    */
   M.control.Location = (function() {
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
   M.control.Location.prototype.createView = function(map) {
      return M.template.compile(M.control.Location.TEMPLATE, {
         'jsonp': true
      });
   };

   /**
    * This function returns the HTML button control.
    *
    * @public
    * @function
    * @param {HTMLElement} element control template
    * @returns {HTMLElement} HTML control button
    * @api stable
    * @export
    */
   M.control.Location.prototype.getActivationButton = function(element) {
      return element.querySelector('button#m-location-button');
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @public
    * @function
    * @param {Object} obj object to compare
    * @returns {Boolean}
    * @api stable
    */
   M.control.Location.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.Location);
      return equals;
   };

   /**
    * Name to identify this control
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