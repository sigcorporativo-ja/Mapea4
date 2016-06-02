goog.provide('M.Label');

goog.require('M.facade.Base');
goog.require('M.utils');
goog.require('M.exception');
goog.require('goog.dom.classlist');


(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a Label
    * control to provides a popup with specified information.
    * @constructor
    * @param {String} text text to show
    * @param {Object} coordOpts coordinate to display popup
    * @extends {M.facade.Base}
    * @api stable
    */
   M.Label = (function(text, coordOpts) {
      // implementation of this control
      var impl = new M.impl.Label(text, coordOpts);
      // calls the super constructor
      goog.base(this, impl);
   });
   goog.inherits(M.Label, M.facade.Base);

   /**
    * This function remove the popup with information
    *
    * @public
    * @function
    * @api stable
    * @export
    */
   M.Label.prototype.hide = function() {
      this.getImpl().hide();
   };

   /**
    * This function displays the popup with information
    *
    * @public
    * @function
    * @param {M.Map} map map where show popup
    * @api stable
    * @export
    */
   M.Label.prototype.show = function(map) {
      this.getImpl().show(map);
   };

   /**
    * This function return popup created
    *
    * @public
    * @function
    * @returns {M.Popup} popup created
    * @api stable
    * @export
    */
   M.Label.prototype.getPopup = function() {
      return this.getImpl().getPopup();
   };

   /**
    * Template for this controls - popup
    * @const
    * @type {String}
    * @public
    * @api stable
    */
   M.Label.POPUP_TEMPLATE = 'label_popup.html';
})();