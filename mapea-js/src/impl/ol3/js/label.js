goog.provide('M.impl.Label');

/**
 * @namespace M.impl.control
 */
(function() {
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
   M.impl.Label = function(text, coordOpts) {
      this.text_ = text;

      this.coord_ = [coordOpts.x, coordOpts.y];

      this.popup_ = null;

      this.facadeMap_ = null;
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
   M.impl.Label.prototype.show = function(map) {
      this.facadeMap_ = map;
      var this_ = this;
      M.template.compile(M.Label.POPUP_TEMPLATE, {
         'jsonp': true,
         'vars': {
            'info': this.text_
         },
         'parseToHtml': false
      }).then(function(htmlAsText) {
         map.removePopup();
         this_.popup_ = new M.Popup();
         this_.popup_.addTab({
            'icon': 'g-cartografia-comentarios',
            'title': 'Información',
            'content': htmlAsText
         });
         map.addPopup(this_.popup_, this_.coord_);
      });
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
   M.impl.Label.prototype.hide = function() {
      this.facadeMap_.removePopup();
   };

   /**
    * This function return popup created
    *
    * @public
    * @function
    * @returns {Object} popup created
    * @api stable
    */
   M.impl.Label.prototype.getPopup = function() {
      return this.popup_;
   };
})();