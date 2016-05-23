goog.provide('M.Label');

goog.require('M.facade.Base');
goog.require('M.utils');
goog.require('M.exception');
goog.require('goog.dom.classlist');


(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a Label
    * control to provides a popup with specified information.
    * If assign coordinates the popup appears in that position,
    * otherwise, in the center of the map.
    * @constructor
    * @param {String} text text to show
    * @param {Object} coord coordinated to display popup
    * @extends {M.Control}
    * @api stable
    */
   M.Label = (function (text, coord) {
      this.text = text;
      this.coord = coord;
      if (M.utils.isUndefined(M.impl.Label)) {
         M.exception('La implementación usada no puede crear labels');
      }
      // implementation of this control
      var impl = new M.impl.Label(text, coord);
      // calls the super constructor
      goog.base(this, impl);
   });
   goog.inherits(M.Label, M.facade.Base);

   /**
    * This function calls the show method of implementation
    * 
    * @public
    * @function
    * @param {M.Map} map map to add the plugin
    * @api stable
    * @export
    */
   M.Label.prototype.show = function (map) {
      this.getImpl().show(map);

   };

   /**
    * This function return popup created
    * 
    * @public
    * @function
    * @returns {Object} popup created
    * @api stable
    * @export
    */
   M.Label.prototype.getPopup = function () {
      return this.getImpl().getPopup();
   };

   /**
    * Template for this controls - popup
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.Label.POPUP_TEMPLATE = 'label_popup.html';
})();