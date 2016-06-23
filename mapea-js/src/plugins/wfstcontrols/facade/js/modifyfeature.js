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
       * Name of this control
       * @public
       * @type {string}
       * @api stable
       */
      this.name = M.control.ModifyFeature.NAME;

      /**
       * Impl control
       * @public
       * @type {M.impl.control.ModifyFeature}
       * @api stable
       */
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
    * @returns {Promise} HTML response
    * @api stable
    */
   M.control.ModifyFeature.prototype.createView = function(map) {
      return M.template.compile(M.control.ModifyFeature.TEMPLATE, {
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
   M.control.ModifyFeature.prototype.getActivationButton = function(element) {
      return element.querySelector('button#m-button-modifyfeature');
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
   M.control.ModifyFeature.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.ModifyFeature);
      return equals;
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