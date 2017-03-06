goog.provide('P.control.ClearFeature');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a ClearFeature
    * control to clean deleted, created and modified unsaved features.
    *
    * @constructor
    * @param {M.layer.WFS} layer - Layer for use in control
    * @extends {M.Control}
    * @api stable
    */
   M.control.ClearFeature = (function(layer) {
      if (M.utils.isUndefined(M.impl.control.ClearFeature)) {
         M.exception('La implementación usada no puede crear controles ClearFeature');
      }
      // implementation of this control
      var impl = new M.impl.control.ClearFeature(layer);
      // calls the super constructor
      goog.base(this, impl, M.control.ClearFeature.NAME);
   });
   goog.inherits(M.control.ClearFeature, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.ClearFeature.prototype.createView = function(map) {
      return M.template.compile(M.control.ClearFeature.TEMPLATE, {
         'jsonp': true
      });
   };

   /**
    * This function adds the click event to the button
    *
    * @public
    * @function
    * @param {HTMLElement} element - HTML control
    * @api stable
    * @export
    */
   M.control.ClearFeature.prototype.manageActivation = function(element) {
      var activationBtn = element.querySelector('button#m-button-clearfeature');
      goog.events.listen(activationBtn, goog.events.EventType.CLICK, this.clear_, false, this);
   };

   /**
    * This function checks if an object is equals to this control
    *
    * @function
    * @api stable
    * @param {*} obj - Object to compare
    * @returns {boolean} equals - Returns if they are equal or not
    */
   M.control.ClearFeature.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.ClearFeature);
      return equals;
   };

   /**
    * This function clean deleted, created and modified unsaved features
    *
    * @private
    * @function
    * @param {goog.events.BrowserEvent} evt - Event
    */
   M.control.ClearFeature.prototype.clear_ = function(evt) {
      evt.preventDefault();
      this.getImpl().clear();
   };

   /**
    * This function set layer for clear
    *
    * @public
    * @function
    * @param {M.layer.WFS} layer - Layer
    * @api stable
    */
   M.control.ClearFeature.prototype.setLayer = function(layer) {
      this.getImpl().layer_ = layer;
   };


   /**
    * Name for this controls
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