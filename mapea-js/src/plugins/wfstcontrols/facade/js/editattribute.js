goog.provide('P.control.EditAttribute');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a EditAttribute
    * edit the attributes of the features
    *
    * @constructor
    * @param {M.layer.WFS} layer - Layer for use in control
    * @extends {M.Control}
    * @api stable
    */
   M.control.EditAttribute = (function(layer) {
      /**
       * Name of the control
       * @public
       * @type {String}
       */
      this.name = M.control.EditAttribute.NAME;

      if (M.utils.isUndefined(M.impl.control.EditAttribute)) {
         M.exception('La implementación usada no puede crear controles EditAttribute');
      }
      // implementation of this control
      var impl = new M.impl.control.EditAttribute(layer);

      // calls the super constructor
      goog.base(this, impl, M.control.EditAttribute.NAME);
   });
   goog.inherits(M.control.EditAttribute, M.Control);


   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.EditAttribute.prototype.createView = function(map) {
      return M.template.compile(M.control.EditAttribute.TEMPLATE, {
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
   M.control.EditAttribute.prototype.getActivationButton = function(element) {
      return element.querySelector('button#m-button-editattribute');
   };

   /**
    * This function checks if an object is equals to this control
    *
    * @function
    * @api stable
    * @param {*} obj - Object to compare
    * @returns {boolean} equals - Returns if they are equal or not
    */
   M.control.EditAttribute.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.EditAttribute);
      return equals;
   };

   /**
    * This function set layer for edit attributes features
    *
    * @public
    * @function
    * @param {M.layer.WFS} layer - Layer
    * @api stable
    */
   M.control.EditAttribute.prototype.setLayer = function(layer) {
      this.getImpl().layer_ = layer;
   };

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.EditAttribute.NAME = 'editattribute';

   /**
    * Title for the popup
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.EditAttribute.POPUP_TITLE = 'Editattribute';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.EditAttribute.TEMPLATE = 'editattribute.html';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.EditAttribute.TEMPLATE_POPUP = 'editattribute_popup.html';
})();