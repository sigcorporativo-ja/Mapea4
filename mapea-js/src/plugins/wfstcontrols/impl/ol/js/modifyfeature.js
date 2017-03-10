goog.provide('P.impl.control.ModifyFeature');


/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a ModifyFeature
    * control
    *
    * @constructor
    * @param {M.layer.WFS} layer - Layer for use in control
    * @extends {M.impl.Control}
    * @api stable
    */
   M.impl.control.ModifyFeature = function(layer) {
      /**
       * Layer for use in control
       * @private
       * @type {M.layer.WFS}
       */
      this.layer_ = layer;
      /**
       * Interaction modify
       * @public
       * @type {ol.interaction.Modify}
       * @api stable
       */
      this.modify = null;
      /**
       * Store modified features
       * @public
       * @type {array}
       * @api stable
       */
      this.modifiedFeatures = [];
      /**
       * Current feature
       * @public
       * @type {array}
       */
      this.currentFeature_ = null;
   };
   goog.inherits(M.impl.control.ModifyFeature, M.impl.Control);

   /**
    * This function active control
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.ModifyFeature.prototype.activate = function() {
      if (M.utils.isNullOrEmpty(this.modify)) {
         this.createInteractionModify_();
      }
      this.modify.setActive(true);
   };

   /**
    * This function deactivate control
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.ModifyFeature.prototype.deactivate = function() {
      if (M.utils.isNullOrEmpty(this.modify)) {
         this.createInteractionModify_();
      }
      var olMap = this.facadeMap_.getMapImpl();
      olMap.removeInteraction(this.modify);
      this.modify = null;
   };

   /**
    * This function creates the interaction to modify
    *
    * @private
    * @function
    */
   M.impl.control.ModifyFeature.prototype.createInteractionModify_ = function() {
      var olMap = this.facadeMap_.getMapImpl();
      var layerImpl = this.layer_.getImpl();
      var olLayer = layerImpl.getOL3Layer();

      var layerFeatures = new ol.Collection(olLayer.getSource().getFeatures());
      layerFeatures.forEach(function(feature) {
         feature.on('change', function(evt) {
            this.currentFeature_ = evt.target;
         }, this);
      }, this);
      this.modify = new ol.interaction.Modify({
         features: layerFeatures,
         deleteCondition: function(event) {
            return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
         },
         style: olLayer.getStyle()
      });
      this.modify.on('modifyend', function(evt) {
         var featureIdx = this.modifiedFeatures.indexOf(this.currentFeature_);
         if (featureIdx >= 0) {
            this.modifiedFeatures[featureIdx] = this.currentFeature_;
         }
         else {
            this.modifiedFeatures.push(this.currentFeature_);
         }
         this.currentFeature_ = null;
      }, this);
      olMap.addInteraction(this.modify);

      // updates features from refresh
      layerImpl.on(M.evt.LOAD, this.updateLayerFeatures_, this);
   };

   /**
    * This function remove unsaved changes
    *
    * @private
    * @function
    */
   M.impl.control.ModifyFeature.prototype.updateLayerFeatures_ = function() {
      this.facadeMap_.getMapImpl().removeInteraction(this.modify);
      this.modify = null;
   };

   /**
    * This function destroys this control and cleaning the HTML
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.ModifyFeature.prototype.destroy = function() {
      this.facadeMap_.getMapImpl().removeControl(this);
      this.layer_ = null;
      this.modify = null;
      this.modifiedFeatures = [];
   };
})();