goog.provide('P.control.ClearFeature');

(function () {
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
   M.control.ClearFeature = (function (layer) {
      if (M.utils.isUndefined(M.impl.control.ClearFeature)) {
         M.exception('La implementación usada no puede crear controles ClearFeature');
      }
      // implementation of this control
      var impl = new M.impl.control.ClearFeature(layer);
      // calls the super constructor
      goog.base(this, impl);
   });
   goog.inherits(M.control.ClearFeature, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.ClearFeature.prototype.createView = function (map) {
      this.facadeMap_ = map;
      var this_ = this;
      var promise = new Promise(function (success, fail) {
         M.template.compile(M.control.ClearFeature.TEMPLATE).then(function (html) {
            this_.addEvents(html);
            success(html);
         });
      });
      return promise;
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
    * @api stable
    */
   M.control.ClearFeature.prototype.equals = function (obj) {
      var equals = (obj instanceof M.control.ClearFeature);
      return equals;
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.control.ClearFeature.prototype.addEvents = function (html) {
      var button = html.getElementsByTagName('button')['m-button-clearfeature'];
      goog.events.listen(button, [goog.events.EventType.CLICK, goog.events.EventType.TOUCHEND],
         function (e) {
            this.clear_();
         }, false, this);
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.control.ClearFeature.prototype.clear_ = function () {
      this.getImpl().clear();
   };


   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.ClearFeature.NAME = 'clearfeature';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.ClearFeature.TEMPLATE = 'clearfeature.html';

})();