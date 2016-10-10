goog.provide('P.impl.control.WFSTBase');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc
    * Main constructor of the class.
    *
    * @constructor
    * @param {M.layer.WFS} layer - Layer for use in control
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.control.WFSTBase = function(layer) {
      /**
       * Layer for use in control
       * @private
       * @type {M.layer.WFS}
       */
      this.layer_ = layer;

      /**
       * Interaction pointer
       * @private
       * @type {ol.interaction.Pointer}
       */
      this.interaction_ = null;

      /**
       * Store modified features
       * @public
       * @type {array}
       * @api stable
       */
      this.modifiedFeatures = [];

      goog.base(this);
   };
   goog.inherits(M.impl.control.WFSTBase, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the plugin
    * @param {HTMLElement} element - Container control
    * @api stable
    */
   M.impl.control.WFSTBase.prototype.addTo = function(map, element) {
      this.facadeMap_ = map;

      ol.control.Control.call(this, {
         'element': element,
         'target': null
      });
      map.getMapImpl().addControl(this);
   };

   /**
    * This function activate control
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.WFSTBase.prototype.activate = function() {
      if (M.utils.isNullOrEmpty(this.interaction_)) {
        this.createInteraction_();
        this.facadeMap_.getMapImpl().addInteraction(this.interaction_);
        this.interaction_.setActive(true);
      }
      else {
         this.interaction_.setActive(true);
      }
   };

   /**
    * This function deactivate control
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.WFSTBase.prototype.deactivate = function() {
      if (M.utils.isNullOrEmpty(this.interaction_)) {
        this.createInteraction_();
        this.facadeMap_.getMapImpl().addInteraction(this.interaction_);
        this.interaction_.setActive(false);
      }
      else {
         this.interaction_.setActive(false);
      }
   };

   /**
    * TODO
    *
    * @private
    * @function
    */
   M.impl.control.WFSTBase.prototype.createInteraction_ = function() {};

   /**
    * This function destroys this control and cleaning the HTML
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.WFSTBase.prototype.destroy = function() {
      this.facadeMap_.getMapImpl().removeControl(this);
      this.layer_ = null;
      this.interaction_ = null;
      this.modifiedFeatures = null;
   };
})();
