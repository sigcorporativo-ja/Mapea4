goog.provide('M.impl.Label');

/**
 * @namespace M.impl.control
 */
(function () {
   /**
    * @classdesc Main constructor of the class. Creates a Label
    * control to provides a popup with specified information.
    * If assign coordinates the popup appears in that position,
    * otherwise, in the center of the map.
    * @constructor
    * @param {String} text text to show
    * @param {Object} coord coordinated to display popup
    * @extends {ol.control.Control}
    * @constructor
    * @api stable
    */
   M.impl.Label = function (text, coord) {
      this.text_ = text;
      this.coord_ = coord;
      /**
       * 
       */
      this.popup_ = null;
   };

   /**
    * This feature displays a popup with information
    * 
    * @public
    * @function
    * @param {M.Map}
    *        map map to add the plugin
    * @api stable
    */
   M.impl.Label.prototype.show = function (map) {
      var ob = this;
      M.template.compile(M.Label.POPUP_TEMPLATE, {
         'info': String(this.text_)
      }).then(function (html) {
         ob.popup_ = new M.impl.Popup(html);
         map.addPopup(ob.popup_);
         ob.popup_.show([ob.coord_.x, ob.coord_.y]);
      });
   };

   /**
    * This function return popup created
    * 
    * @public
    * @function
    * @returns {Object} popup created
    * @api stable
    */
   M.impl.Label.prototype.getPopup = function () {
      return this.popup_;
   };
})();