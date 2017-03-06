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
       * @type {String}
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
    * @returns {Promise} html response
    * @api stable
    */
   M.control.DrawFeature.prototype.createView = function(map) {
      return M.template.compile(M.control.DrawFeature.TEMPLATE, {
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
   M.control.DrawFeature.prototype.getActivationButton = function(element) {
      return element.querySelector('button#m-button-drawfeature');
   };

   /**
    * This function checks if an object is equals to this control
    *
    * @function
    * @api stable
    * @param {*} obj - Object to compare
    * @returns {boolean} equals - Returns if they are equal or not
    */
   M.control.DrawFeature.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.DrawFeature);
      return equals;
   };

   /**
    * This function set layer for draw
    *
    * @public
    * @function
    * @param {M.layer.WFS} layer - Layer
    * @api stable
    */
   M.control.DrawFeature.prototype.setLayer = function(layer) {
      this.getImpl().layer_ = layer;
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
    * Template for this controls - button
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.DrawFeature.TEMPLATE = 'drawfeature.html';
})();