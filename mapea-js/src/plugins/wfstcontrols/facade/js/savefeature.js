goog.provide('P.control.SaveFeature');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a SaveFeature
    * control save changes to features
    *
    * @constructor
    * @param {M.layer.WFS} layer - Layer for use in control
    * @extends {M.Control}
    * @api stable
    */
   M.control.SaveFeature = (function(layer) {
      /**
       * Name of this control
       * @public
       * @type {string}
       * @api stable
       */
      this.name = M.control.SaveFeature.NAME;

      if (M.utils.isUndefined(M.impl.control.SaveFeature)) {
         M.exception('La implementación usada no puede crear controles SaveFeature');
      }
      // implementation of this control
      var impl = new M.impl.control.SaveFeature(layer);
      // calls the super constructor
      goog.base(this, impl, M.control.SaveFeature.NAME);
   });
   goog.inherits(M.control.SaveFeature, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.SaveFeature.prototype.createView = function(map) {
      this.facadeMap_ = map;
      return M.template.compile(M.control.SaveFeature.TEMPLATE, {
         'jsonp': true
      });
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
   M.control.SaveFeature.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.SaveFeature);
      return equals;
   };

   /**
    * This function adds the click event to the button control
    *
    * @public
    * @function
    * @param {HTMLElement} html - Control template
    * @api stable
    */
   M.control.SaveFeature.prototype.manageActivation = function(html) {
      var button = html.querySelector('button#m-button-savefeature');
      goog.events.listen(button, goog.events.EventType.CLICK, this.saveFeature_, false, this);
   };

   /**
    * This function save changes to features
    *
    * @private
    * @function
    */
   M.control.SaveFeature.prototype.saveFeature_ = function() {
      this.getImpl().saveFeature();
   };

   /**
    * Name for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.SaveFeature.NAME = 'savefeature';

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.SaveFeature.TEMPLATE = 'savefeature.html';
})();