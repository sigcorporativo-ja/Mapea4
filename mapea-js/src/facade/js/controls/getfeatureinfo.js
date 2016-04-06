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
    * where the user has clicked inside the map.
    *
    * @constructor
    * @param {String} format format response
    * @extends {M.Control}
    * @api stable
    */
   M.control.GetFeatureInfo = (function(format) {
      if (M.utils.isUndefined(M.impl.control.GetFeatureInfo)) {
         M.exception('La implementación usada no puede crear controles GetFeatureInfo');
      }
      // implementation of this control
      var impl = new M.impl.control.GetFeatureInfo(format);

      // calls the super constructor
      goog.base(this, impl, M.control.GetFeatureInfo.NAME);
   });
   goog.inherits(M.control.GetFeatureInfo, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.GetFeatureInfo.prototype.createView = function(map) {
      return M.template.compile(M.control.GetFeatureInfo.TEMPLATE);
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
   M.control.GetFeatureInfo.prototype.getActivationButton = function(element) {
      return element.querySelector('button#m-getfeatureinfo-button');
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
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
    * Template for this controls - button
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