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
    * @param {M.layer.WFS} layer - layer for use in control
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
       * Describe feature
       * @type {Mx.describeFeatureType.WFSTBase} - Describe feature
       */
      this.describeFeatureType_ = null;

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
         var this_ = this;
         this.layer_.getImpl().getDescribeFeatureType().then(function(describeFeatureType) {
            this_.describeFeatureType_ = describeFeatureType;
            this_.createInteraction_();
            this_.facadeMap_.getMapImpl().addInteraction(this_.interaction_);
            this_.interaction_.setActive(true);
         });
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
         var this_ = this;
         this.layer_.getImpl().getDescribeFeatureType().then(function(describeFeatureType) {
            this_.describeFeatureType_ = describeFeatureType;
            this_.createInteraction_();
            this_.facadeMap_.getMapImpl().addInteraction(this_.interaction_);
            this_.interaction_.setActive(false);
         });
      }
      else {
         this.interaction_.setActive(false);
      }
   };

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
      this.describeFeatureType_ = null;
      this.modifiedFeatures = null;
   };
})();