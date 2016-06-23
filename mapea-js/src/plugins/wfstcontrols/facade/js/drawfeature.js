goog.provide('P.control.DrawFeature');

(function() {
   /**
    * @classdesc Main constructor of the class. Creates a DrawFeature
    * control to draw features on the map.
    *
    * @constructor
    * @param {M.layer.WFS} layer - Layer for use in control
    * @extends {M.Control}
    * @api stable
    */
   M.control.DrawFeature = (function(layer) {
      /**
       * Name of the control
       * @public
       * @type {string}
       * @api stable
       */
      this.name = M.control.DrawFeature.NAME;

      if (M.utils.isUndefined(M.impl.control.DrawFeature)) {
         M.exception('La implementación usada no puede crear controles DrawFeature');
      }
      // implementation of this control
      var impl = new M.impl.control.DrawFeature(layer);

      // calls the super constructor
      goog.base(this, impl, M.control.DrawFeature.NAME);
   });
   goog.inherits(M.control.DrawFeature, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the control
    * @returns {Promise} HTML response
    * @api stable
    */
   M.control.DrawFeature.prototype.createView = function(map) {
      return M.template.compile(M.control.DrawFeature.TEMPLATE, {
         'jsonp': true
      });
   };

   /**
    * Returns the control button
    *
    * @public
    * @function
    * @param {HTMLElement} element - HTML control
    * @returns {HTMLElement} HTML control button
    * @api stable
    * @export
    */
   M.control.DrawFeature.prototype.getActivationButton = function(element) {
      return element.querySelector('button#m-button-drawfeature');
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @public
    * @function
    * @param {*} obj - Object to compare
    * @returns {boolean} equals - Returns if they are equal or not
    * @api stable
    */
   M.control.DrawFeature.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.DrawFeature);
      return equals;
   };

   /**
    * Name for this controls
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.DrawFeature.NAME = 'drawfeature';

   /**
    * Template for this controls
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.DrawFeature.TEMPLATE = 'drawfeature.html';
})();