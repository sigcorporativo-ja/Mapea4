goog.provide('M.impl.Label');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a Label
    * control
    * @constructor
    * @param {String} text text to show
    * @param {Object} coordOpts coordinate to display popup
    * @api stable
    */
   M.impl.Label = function(text, coordOpts) {
      /**
       * Text to show
       * @private
       * @type {String}
       */
      this.text_ = text;

      /**
       * Coordinates where to display the popup
       * @private
       * @type {Array}
       */
      this.coord_ = [coordOpts.x, coordOpts.y];

      /**
       * Popup
       * @private
       * @type {M.Popup}
       */
      this.popup_ = null;

      /**
       * Map
       * @private
       * @type {M.Map}
       */
      this.facadeMap_ = null;
   };

   /**
    * This function displays the popup with information
    *
    * @public
    * @function
    * @param {M.Map} map map where show popup
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
    * This function remove the popup with information
    *
    * @public
    * @function
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
    * @returns {M.Popup} popup created
    * @api stable
    */
   M.impl.Label.prototype.getPopup = function() {
      return this.popup_;
   };
})();