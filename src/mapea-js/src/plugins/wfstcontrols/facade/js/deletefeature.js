goog.provide('P.control.DeleteFeature');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a DeleteFeature
    * control to remove features map
    *
    * @constructor
    * @param {M.layer.WFS} layer - Layer for use in control
    * @extends {M.Control}
    * @api stable
    */
   M.control.DeleteFeature = (function(layer) {
      this.name = M.control.DeleteFeature.NAME;

      if (M.utils.isUndefined(M.impl.control.DeleteFeature)) {
         M.exception('La implementación usada no puede crear controles DeleteFeature');
      }
      // implementation of this control
      var impl = new M.impl.control.DeleteFeature(layer);

      // calls the super constructor
      goog.base(this, impl, M.control.DeleteFeature.NAME);
   });
   goog.inherits(M.control.DeleteFeature, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.DeleteFeature.prototype.createView = function(map) {
      return M.template.compile(M.control.DeleteFeature.TEMPLATE, {
         'jsonp': true
      });
   };

   /**
    * This function returns the HTML button
    *
    * @public
    * @function
    * @param {HTMLElement} element - HTML control
    * @return {HTMLElement} return HTML button
    * @api stable
    * @export
    */
   M.control.DeleteFeature.prototype.getActivationButton = function(element) {
      return element.querySelector('button#m-button-deletefeature');
   };

   /**
    * This function checks if an object is equals to this control
    *
    * @function
    * @api stable
    * @param {*} obj - Object to compare
    * @returns {boolean} equals - Returns if they are equal or not
    */
   M.control.DeleteFeature.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.DeleteFeature);
      return equals;
   };

   /**
    * This function set layer for delete features
    *
    * @public
    * @function
    * @param {M.layer.WFS} layer - Layer
    * @api stable
    */
   M.control.DeleteFeature.prototype.setLayer = function(layer) {
      this.getImpl().layer_ = layer;
   };

   /**
    * Name for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.DeleteFeature.NAME = 'deletefeature';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.DeleteFeature.TEMPLATE = 'deletefeature.html';
})();