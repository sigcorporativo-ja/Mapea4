goog.provide('P.control.SaveFeature');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a SaveFeature
    * control save changes to features
    *
    * @constructor
    * @param {M.layer.WFS}
    * layer layer for use in control
    * @extends {M.Control}
    * @api stable
    */
   M.control.SaveFeature = (function(layer) {
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
    * @param {M.Map} map map to add the control
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
    * @function
    * @api stable
    */
   M.control.SaveFeature.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.SaveFeature);
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
   M.control.SaveFeature.prototype.manageActivation = function(html) {
      var button = html.querySelector('button#m-button-savefeature');
      goog.events.listen(button, goog.events.EventType.CLICK, this.saveFeature_, false, this);
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.control.SaveFeature.prototype.saveFeature_ = function(html) {
      this.getImpl().saveFeature();
   };

        /**
 * This function set layer for editting
 *
 * @public
 * @function
 * @api stable
 */
  M.control.SaveFeature.prototype.setLayer = function(layer) {
   this.getImpl().layer_ = layer;
  };

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.SaveFeature.NAME = 'savefeature';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.SaveFeature.TEMPLATE = 'savefeature.html';
})();