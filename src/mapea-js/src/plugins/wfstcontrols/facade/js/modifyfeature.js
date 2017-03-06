goog.provide('P.control.ModifyFeature');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a ModifyFeature
    * control to edit map features
    *
    * @constructor
    * @param {M.layer.WFS} layer - Layer for use in control
    * @extends {M.Control}
    * @api stable
    */
   M.control.ModifyFeature = (function(layer) {
      /**
       * Name of the control
       * @public
       * @type {String}
       */
      this.name = M.control.ModifyFeature.NAME;
      this.modify = null;

      if (M.utils.isUndefined(M.impl.control.ModifyFeature)) {
         M.exception('La implementación usada no puede crear controles ModifyFeature');
      }

      // implementation of this control
      var impl = new M.impl.control.ModifyFeature(layer);

      // calls the super constructor
      goog.base(this, impl, M.control.ModifyFeature.NAME);
   });
   goog.inherits(M.control.ModifyFeature, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.ModifyFeature.prototype.createView = function(map) {
      return M.template.compile(M.control.ModifyFeature.TEMPLATE, {
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
   M.control.ModifyFeature.prototype.getActivationButton = function(element) {
      return element.querySelector('button#m-button-modifyfeature');
   };

   /**
    * This function checks if an object is equals to this control
    *
    * @function
    * @api stable
    * @param {*} obj - Object to compare
    * @returns {boolean} equals - Returns if they are equal or not
    */
   M.control.ModifyFeature.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.ModifyFeature);
      return equals;
   };

   /**
    * This function set layer for modify features
    *
    * @public
    * @function
    * @param {M.layer.WFS} layer - Layer
    * @api stable
    */
   M.control.ModifyFeature.prototype.setLayer = function(layer) {
      this.getImpl().layer_ = layer;
   };

   /**
    * Name for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.ModifyFeature.NAME = 'modifyfeature';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.ModifyFeature.TEMPLATE = 'modifyfeature.html';
})();