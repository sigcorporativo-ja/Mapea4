goog.provide('M.control.GetFeatureInfo');

goog.require('M.Control');
goog.require('M.utils');
goog.require('M.exception');
goog.require('goog.dom.classlist');


(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a GetFeatureInfo
    * control to provides a popup with information about the place
    * where the user has clicked inside the map
    *
    * @constructor
    * @param {string} format - Format response
    * @param {object} options - Control options
    * @extends {M.Control}
    * @api stable
    */
   M.control.GetFeatureInfo = (function(format, options) {
      if (M.utils.isUndefined(M.impl.control.GetFeatureInfo)) {
         M.exception('La implementación usada no puede crear controles GetFeatureInfo');
      }

      options = (options || {});

      // implementation of this control
      var impl = new M.impl.control.GetFeatureInfo(format, options);

      // calls the super constructor
      goog.base(this, impl, M.control.GetFeatureInfo.NAME);
   });
   goog.inherits(M.control.GetFeatureInfo, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Facade map
    * @returns {Promise} HTML template
    * @api stable
    */
   M.control.GetFeatureInfo.prototype.createView = function(map) {
      return M.template.compile(M.control.GetFeatureInfo.TEMPLATE, {
         'jsonp': true
      });
   };

   /**
    * This function returns the HTML button control.
    *
    * @public
    * @function
    * @param {HTMLElement} element - Template control
    * @returns {HTMLElement} HTML control button
    * @api stable
    * @export
    */
   M.control.GetFeatureInfo.prototype.getActivationButton = function(element) {
      return element.querySelector('button#m-getfeatureinfo-button');
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
   M.control.GetFeatureInfo.prototype.equals = function(obj) {
      var equals = false;
      if (obj instanceof M.control.GetFeatureInfo) {
         equals = (this.name === obj.name);
      }
      return equals;
   };

   /**
    * Name to identify this control
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.GetFeatureInfo.NAME = 'getfeatureinfo';

   /**
    * Title for the popup
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.GetFeatureInfo.POPUP_TITLE = 'Información';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.GetFeatureInfo.TEMPLATE = 'getfeatureinfo.html';

   /**
    * Template for this controls - popup
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.GetFeatureInfo.POPUP_TEMPLATE = 'getfeatureinfo_popup.html';
})();