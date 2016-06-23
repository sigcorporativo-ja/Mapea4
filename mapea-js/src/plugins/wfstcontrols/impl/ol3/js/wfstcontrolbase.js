goog.provide('P.impl.control.WFSTBase');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMC selector
    * control
    *
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.control.WFSTBase = function(layer) {
      /**
       * TODO
       * @private
       * @type {ol.Feature}
       */
      this.layer_ = layer;

      /**
       * TODO
       * @private
       * @type {ol.Feature}
       */
      this.interaction_ = null;

      /**
       * TODO
       * @private
       * @type {ol.Feature}
       */
      this.describeFeatureType_ = null;

      /**
       * TODO
       * @public
       * @type {ol.Feature}
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
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
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
    * This function add events to the button 'DeleteFeature'
    *
    * @public
    * @function
    * @param {function} html control button
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
    * This function add events to the button 'DeleteFeature'
    *
    * @public
    * @function
    * @param {function} html control button
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
    * TODO
    *
    * @private
    * @function
    */
   M.impl.control.WFSTBase.prototype.createInteraction_ = function() {};

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
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